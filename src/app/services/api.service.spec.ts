import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, LeadIntakeRequest, LeadIntakeResponse } from './api.service';
import { SubdomainService } from './subdomain.service';
import { Company } from '../models/company.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let subdomainService: jasmine.SpyObj<SubdomainService>;

  // Mock da empresa para testes
  const mockCompany: Company = {
    id: 'test-company-id',
    name: 'Test Company',
    subdomain: 'test',
    contactEmail: 'owner@test.com',
    ownerId: 'test-owner-id',
    ownerEmail: 'owner@test.com',
    smtpConfig: {
      host: 'smtp.test.com',
      port: 587,
      secure: false,
      user: 'test@test.com',
      password: 'password',
      fromName: 'Test Company',
      fromEmail: 'noreply@test.com'
    },
    apiConfig: {
      enabled: true,
      token: 'test-api-token',
      endpoint: 'http://localhost:5000/api/v1/lead-intake'
    },
    plan: 'professional',
    features: {
      maxBoards: 10,
      maxUsers: 5,
      maxLeadsPerMonth: 1000,
      maxEmailsPerMonth: 500,
      customBranding: true,
      apiAccess: true,
      webhooks: true,
      advancedReports: true,
      whiteLabel: false
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    const subdomainServiceSpy = jasmine.createSpyObj('SubdomainService', [
      'getCurrentCompany',
      'setCurrentCompany',
      'getApiUrl',
      'isDevelopment'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: SubdomainService, useValue: subdomainServiceSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    subdomainService = TestBed.inject(SubdomainService) as jasmine.SpyObj<SubdomainService>;

    // Configurar mocks padrão
    subdomainService.getCurrentCompany.and.returnValue(mockCompany);
    subdomainService.isDevelopment.and.returnValue(true);
    subdomainService.getApiUrl.and.returnValue('http://localhost:5000');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('submitLead', () => {
    it('should submit lead with boardId in URL path, not in body', () => {
      const testLead: LeadIntakeRequest = {
        boardId: 'board-123',
        companyName: 'Test Company',
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '(11) 99999-9999',
        customFields: {
          customField1: 'value1',
          customField2: 'value2'
        }
      };

      const expectedResponse: LeadIntakeResponse = {
        success: true,
        leadId: 'lead-456',
        message: 'Lead created successfully'
      };

      service.submitLead(testLead).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.leadId).toBe('lead-456');
      });

      // URL deve incluir o boardId (desenvolvimento usa localhost)
      const expectedUrl = `http://localhost:5000/api/v1/lead-intake/board-123`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      
      // boardId NÃO deve estar no corpo
      expect(req.request.body.boardId).toBeUndefined();
      
      // Outros dados devem estar no corpo
      expect(req.request.body.companyId).toBe(mockCompany.id);
      expect(req.request.body.subdomain).toBe(mockCompany.subdomain);
      expect(req.request.body.customFields).toEqual(testLead.customFields);
      expect(req.request.body.companyName).toBe('Test Company');
      expect(req.request.body.contactName).toBe('John Doe');
      
      // Verificar headers
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockCompany.apiConfig.token}`);
      expect(req.request.headers.get('X-Company-Subdomain')).toBe(mockCompany.subdomain);

      req.flush(expectedResponse);
    });

    it('should handle missing company context', () => {
      subdomainService.getCurrentCompany.and.returnValue(null);

      service.submitLead({}).subscribe({
        next: () => fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toBe('Empresa não encontrada');
        }
      });

      httpMock.expectNone(mockCompany.apiConfig.endpoint);
    });

    it('should include captcha token when provided', () => {
      const testLead: LeadIntakeRequest = {
        contactName: 'Test User',
        contactEmail: 'test@example.com'
      };

      const captchaToken = 'test-captcha-token';

      service.submitLead(testLead, captchaToken).subscribe();

      const req = httpMock.expectOne('http://localhost:5000/api/v1/lead-intake');
      expect(req.request.headers.get('X-Captcha-Token')).toBe(captchaToken);

      req.flush({ success: true });
    });
  });

  describe('testApiEndpoint', () => {
    it('should test API with boardId in URL, not in body', () => {
      const boardId = 'test-board-id';

      service.testApiEndpoint(boardId).subscribe(response => {
        expect(response.testMode).toBe(true);
        expect(response.timestamp).toBeDefined();
      });

      // URL deve incluir o boardId (desenvolvimento usa localhost)
      const expectedUrl = `http://localhost:5000/api/v1/lead-intake/${boardId}`;
      const req = httpMock.expectOne(expectedUrl);
      
      // boardId NÃO deve estar no corpo
      expect(req.request.body.boardId).toBeUndefined();
      
      // Outros dados devem estar no corpo
      expect(req.request.body.companyName).toBe('Empresa Teste');
      expect(req.request.body.source).toBe('api-test');
      expect(req.request.body.customFields).toBeDefined();
      expect(req.request.body.customFields.testField).toBe('Valor de teste');

      req.flush({ success: true, leadId: 'test-lead-id' });
    });

    it('should test API without boardId parameter', () => {
      service.testApiEndpoint().subscribe();

      // Sem boardId, usa URL base (desenvolvimento)
      const req = httpMock.expectOne('http://localhost:5000/api/v1/lead-intake');
      expect(req.request.body.boardId).toBeUndefined();

      req.flush({ success: true });
    });
  });

  describe('getIntegrationExamples', () => {
    it('should generate examples with boardId in URL and form fields', () => {
      const boardId = 'example-board-id';
      const formFields = [
        { name: 'customField1', type: 'text', includeInApi: true },
        { name: 'temperature', type: 'temperatura', includeInApi: true, apiFieldName: 'temp' },
        { name: 'privateField', type: 'text', includeInApi: false }
      ];

      const examples = service.getIntegrationExamples(boardId, formFields);

      // boardId deve estar na URL, NÃO no corpo (desenvolvimento usa localhost)
      const expectedUrlWithBoard = `http://localhost:5000/api/v1/lead-intake/${boardId}`;
      expect(examples['curl']).toContain(expectedUrlWithBoard);
      expect(examples['curl']).not.toContain(`"boardId"`);
      
      // Campos personalizados devem estar no corpo
      expect(examples['curl']).toContain(`"customField1": "Valor exemplo"`);
      expect(examples['curl']).toContain(`"temp": "Quente"`);
      expect(examples['curl']).not.toContain('privateField');

      // JavaScript deve ter URL com boardId
      expect(examples['javascript']).toContain(expectedUrlWithBoard);
      expect(examples['javascript']).not.toContain(`boardId:`);
      
      // PHP deve ter URL com boardId  
      expect(examples['php']).toContain(expectedUrlWithBoard);
      expect(examples['php']).not.toContain(`'boardId'`);
      
      // Python deve ter URL com boardId
      expect(examples['python']).toContain(expectedUrlWithBoard);
      expect(examples['python']).not.toContain(`'boardId'`);
    });

    it('should generate examples without form fields', () => {
      const boardId = 'example-board-id';

      const examples = service.getIntegrationExamples(boardId);

      // boardId deve estar na URL, NÃO no corpo (desenvolvimento usa localhost)
      const expectedUrlWithBoard = `http://localhost:5000/api/v1/lead-intake/${boardId}`;
      expect(examples['curl']).toContain(expectedUrlWithBoard);
      expect(examples['curl']).not.toContain(`"boardId"`);
      expect(examples['curl']).toContain('Configure campos personalizados');
      
      // JavaScript deve ter URL com boardId
      expect(examples['javascript']).toContain(expectedUrlWithBoard);
      expect(examples['javascript']).not.toContain(`boardId:`);
    });

    it('should handle missing company context', () => {
      subdomainService.getCurrentCompany.and.returnValue(null);

      const examples = service.getIntegrationExamples();

      expect(Object.keys(examples).length).toBe(0);
    });
  });

  describe('field type examples', () => {
    it('should generate correct example values for different field types', () => {
      const formFields = [
        { name: 'email', type: 'email', includeInApi: true },
        { name: 'phone', type: 'tel', includeInApi: true },
        { name: 'cnpj', type: 'cnpj', includeInApi: true },
        { name: 'date', type: 'date', includeInApi: true },
        { name: 'temperature', type: 'temperatura', includeInApi: true },
        { name: 'checkbox', type: 'checkbox', includeInApi: true }
      ];

      const examples = service.getIntegrationExamples('board-id', formFields);

      expect(examples['curl']).toContain(`"email": "exemplo@email.com"`);
      expect(examples['curl']).toContain(`"phone": "(11) 99999-9999"`);
      expect(examples['curl']).toContain(`"cnpj": "00.000.000/0001-00"`);
      expect(examples['curl']).toContain(`"date": "2024-01-01"`);
      expect(examples['curl']).toContain(`"temperature": "Quente"`);
      expect(examples['curl']).toContain(`"checkbox": "true"`);
    });
  });

  describe('URL generation', () => {
    it('should use custom endpoint when configured', () => {
      const customEndpoint = 'https://custom-api.example.com/intake';
      mockCompany.apiConfig.endpoint = customEndpoint;

      const url = service.getLeadIntakeUrl();
      expect(url).toBe(customEndpoint);
    });

    it('should use default development URL', () => {
      mockCompany.apiConfig.endpoint = '';
      subdomainService.isDevelopment.and.returnValue(true);

      const url = service.getLeadIntakeUrl();
      expect(url).toBe('http://localhost:5000/api/v1/lead-intake');
    });

    it('should use production URL with centralized API', () => {
      mockCompany.apiConfig.endpoint = '';
      subdomainService.isDevelopment.and.returnValue(false);

      const url = service.getLeadIntakeUrl();
      expect(url).toBe(`https://api.taskboard.com.br/v1/companies/${mockCompany.id}/leads`);
    });
  });
});