import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubdomainService } from './subdomain.service';

export interface LeadIntakeRequest {
  companyName?: string;
  cnpj?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  boardId?: string; // ID do quadro onde o lead será criado
  phaseId?: string; // ID da fase específica (opcional, usará fase inicial se não fornecido)
  customFields?: { [key: string]: any };
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface LeadIntakeResponse {
  success: boolean;
  leadId?: string;
  message?: string;
  error?: string;
}

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  companyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private subdomainService = inject(SubdomainService);

  // Lead Intake API - endpoint público para receber leads
  submitLead(leadData: LeadIntakeRequest, captchaToken?: string): Observable<LeadIntakeResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const apiUrl = this.getLeadIntakeUrl();
    const headers = this.getApiHeaders(company.apiConfig.token);

    // Adicionar token de captcha se fornecido
    if (captchaToken) {
      headers.set('X-Captcha-Token', captchaToken);
    }

    const payload = {
      ...leadData,
      companyId: company.id,
      subdomain: company.subdomain,
      timestamp: new Date().toISOString()
    };

    return this.http.post<LeadIntakeResponse>(apiUrl, payload, { headers }).pipe(
      map(response => ({
        ...response,
        success: true
      })),
      catchError(error => {
        console.error('Erro ao submeter lead:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.message || 'Erro ao submeter lead'
        }));
      })
    );
  }

  // Webhook para notificações de automação
  sendWebhook(webhookUrl: string, payload: WebhookPayload): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'User-Agent': 'TaskBoard-Webhooks/1.0'
    });

    return this.http.post(webhookUrl, payload, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao enviar webhook:', error);
        return throwError(() => error);
      })
    );
  }

  // Obter informações da empresa via API pública
  getCompanyInfo(subdomain: string): Observable<any> {
    const url = `${this.getBaseApiUrl()}/companies/${subdomain}/info`;
    
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Erro ao obter informações da empresa:', error);
        return throwError(() => error);
      })
    );
  }

  // Obter configuração do formulário público
  getPublicFormConfig(): Observable<any> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const url = `${this.getCompanyApiUrl()}/form-config`;
    const headers = this.getApiHeaders(company.apiConfig.token);

    return this.http.get(url, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter configuração do formulário:', error);
        return throwError(() => error);
      })
    );
  }

  // Validar token da API
  validateApiToken(token: string): Observable<boolean> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const url = `${this.getCompanyApiUrl()}/validate-token`;
    const headers = this.getApiHeaders(token);

    return this.http.post<{ valid: boolean }>(url, {}, { headers }).pipe(
      map(response => response.valid),
      catchError(error => {
        console.error('Erro ao validar token:', error);
        return throwError(() => false);
      })
    );
  }

  // Regenerar token da API
  regenerateApiToken(): Observable<{ token: string }> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const url = `${this.getCompanyApiUrl()}/regenerate-token`;
    const headers = this.getApiHeaders(company.apiConfig.token);

    return this.http.post<{ token: string }>(url, {}, { headers }).pipe(
      map(response => {
        // Atualizar token localmente
        if (company) {
          company.apiConfig.token = response.token;
          this.subdomainService.setCurrentCompany(company);
        }
        return response;
      }),
      catchError(error => {
        console.error('Erro ao regenerar token:', error);
        return throwError(() => error);
      })
    );
  }

  // Obter estatísticas da API
  getApiStats(period: '24h' | '7d' | '30d' = '24h'): Observable<any> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const url = `${this.getCompanyApiUrl()}/stats?period=${period}`;
    const headers = this.getApiHeaders(company.apiConfig.token);

    return this.http.get(url, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter estatísticas da API:', error);
        return throwError(() => error);
      })
    );
  }

  // Obter logs da API
  getApiLogs(limit: number = 100, offset: number = 0): Observable<any> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const url = `${this.getCompanyApiUrl()}/logs?limit=${limit}&offset=${offset}`;
    const headers = this.getApiHeaders(company.apiConfig.token);

    return this.http.get(url, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter logs da API:', error);
        return throwError(() => error);
      })
    );
  }

  // Testar endpoint da API
  testApiEndpoint(boardId?: string): Observable<any> {
    const testPayload: LeadIntakeRequest = {
      boardId: boardId || undefined, // Será usado o quadro padrão se não fornecido
      companyName: 'Empresa Teste',
      contactName: 'Teste API',
      contactEmail: 'teste@api.com',
      contactPhone: '(11) 99999-9999',
      source: 'api-test',
      customFields: {
        testField: 'Valor de teste',
        timestamp: new Date().toISOString()
      }
    };

    return this.submitLead(testPayload).pipe(
      map(response => ({
        ...response,
        testMode: true,
        timestamp: new Date().toISOString()
      }))
    );
  }

  // URLs e configurações
  getLeadIntakeUrl(): string {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    // URL personalizada definida na configuração da empresa
    if (company.apiConfig.endpoint) {
      return company.apiConfig.endpoint;
    }

    // URL padrão baseada no subdomínio
    if (this.subdomainService.isDevelopment()) {
      return `http://localhost:5000/api/v1/lead-intake`;
    }
    
    return `https://${company.subdomain}.taskboard.com.br/api/v1/lead-intake`;
  }

  getCompanyApiUrl(): string {
    const baseUrl = this.subdomainService.getApiUrl();
    return `${baseUrl}/api`;
  }

  getBaseApiUrl(): string {
    if (this.subdomainService.isDevelopment()) {
      return 'http://localhost:5000/api/v1';
    }
    
    return 'https://api.taskboard.com.br/v1';
  }

  // Gerar exemplo de código para integração
  getIntegrationExamples(boardId?: string, formFields?: any[]): { [key: string]: string } {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return {};
    }

    const apiUrl = this.getLeadIntakeUrl();
    const token = company.apiConfig.token;
    
    // Gerar campos dinâmicos baseados no formulário configurado
    const dynamicFields = this.generateDynamicFieldsExample(formFields);
    const fieldsComment = formFields && formFields.length > 0 
      ? '    // Campos configurados no formulário:\n' + formFields.map(f => `    // "${f.name}": "${f.type}"`).join(',\n') + '\n'
      : '    // Configure campos personalizados no Visual Form Builder\n';

    return {
      curl: `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -H "X-Company-Subdomain: ${company.subdomain}" \\
  -d '{
    "boardId": "${boardId || 'ID_DO_QUADRO'}",
    "companyName": "Nome da Empresa Exemplo",
    "cnpj": "00.000.000/0001-00",
    "contactName": "Nome do Contato",
    "contactEmail": "email@exemplo.com",
    "contactPhone": "(11) 99999-9999"${dynamicFields ? ',\n' + dynamicFields : ''}
  }'`,

      javascript: `${fieldsComment}fetch('${apiUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${token}',
    'X-Company-Subdomain': '${company.subdomain}'
  },
  body: JSON.stringify({
    boardId: '${boardId || 'ID_DO_QUADRO'}',
    companyName: 'Nome da Empresa Exemplo',
    cnpj: '00.000.000/0001-00',
    contactName: 'Nome do Contato',
    contactEmail: 'email@exemplo.com',
    contactPhone: '(11) 99999-9999'${dynamicFields ? ',\n    ' + dynamicFields.replace(/    /g, '    ') : ''}
  })
})
.then(response => response.json())
.then(data => console.log(data));`,

      php: `<?php
// ${fieldsComment.replace(/\/\//g, '//')}
$url = '${apiUrl}';
$data = [
    'boardId' => '${boardId || 'ID_DO_QUADRO'}',
    'companyName' => 'Nome da Empresa Exemplo',
    'cnpj' => '00.000.000/0001-00',
    'contactName' => 'Nome do Contato',
    'contactEmail' => 'email@exemplo.com',
    'contactPhone' => '(11) 99999-9999'${this.generateDynamicFieldsPhp(formFields)}
];

$options = [
    'http' => [
        'header' => [
            'Content-type: application/json',
            'Authorization: Bearer ${token}',
            'X-Company-Subdomain: ${company.subdomain}'
        ],
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>`,

      python: `import requests
import json

# ${fieldsComment.replace(/\/\//g, '#')}
url = '${apiUrl}'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${token}',
    'X-Company-Subdomain': '${company.subdomain}'
}
data = {
    'boardId': '${boardId || 'ID_DO_QUADRO'}',
    'companyName': 'Nome da Empresa Exemplo',
    'cnpj': '00.000.000/0001-00',
    'contactName': 'Nome do Contato',
    'contactEmail': 'email@exemplo.com',
    'contactPhone': '(11) 99999-9999'${this.generateDynamicFieldsPython(formFields)}
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
    };
  }

  // Gerar campos dinâmicos para JSON
  private generateDynamicFieldsExample(formFields?: any[]): string {
    if (!formFields || formFields.length === 0) {
      return '';
    }

    return formFields
      .filter(field => field.includeInApi !== false)
      .map(field => {
        const fieldName = field.apiFieldName || field.name;
        const exampleValue = this.getExampleValue(field.type);
        return `    "${fieldName}": "${exampleValue}"`;
      })
      .join(',\n');
  }

  // Gerar campos dinâmicos para PHP
  private generateDynamicFieldsPhp(formFields?: any[]): string {
    if (!formFields || formFields.length === 0) {
      return '';
    }

    return ',\n' + formFields
      .filter(field => field.includeInApi !== false)
      .map(field => {
        const fieldName = field.apiFieldName || field.name;
        const exampleValue = this.getExampleValue(field.type);
        return `    '${fieldName}' => '${exampleValue}'`;
      })
      .join(',\n');
  }

  // Gerar campos dinâmicos para Python
  private generateDynamicFieldsPython(formFields?: any[]): string {
    if (!formFields || formFields.length === 0) {
      return '';
    }

    return ',\n' + formFields
      .filter(field => field.includeInApi !== false)
      .map(field => {
        const fieldName = field.apiFieldName || field.name;
        const exampleValue = this.getExampleValue(field.type);
        return `    '${fieldName}': '${exampleValue}'`;
      })
      .join(',\n');
  }

  // Obter valor de exemplo baseado no tipo do campo
  private getExampleValue(fieldType: string): string {
    switch (fieldType) {
      case 'email':
        return 'exemplo@email.com';
      case 'tel':
        return '(11) 99999-9999';
      case 'number':
        return '123';
      case 'cnpj':
        return '00.000.000/0001-00';
      case 'cpf':
        return '000.000.000-00';
      case 'date':
        return '2024-01-01';
      case 'time':
        return '14:30';
      case 'temperatura':
        return 'Quente';
      case 'textarea':
        return 'Texto de exemplo';
      case 'select':
      case 'radio':
        return 'Opção 1';
      case 'checkbox':
        return 'true';
      default:
        return 'Valor exemplo';
    }
  }

  // Headers padrão para autenticação
  private getApiHeaders(token: string): HttpHeaders {
    const company = this.subdomainService.getCurrentCompany();
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    if (company) {
      headers = headers.set('X-Company-Subdomain', company.subdomain);
    }

    return headers;
  }
}