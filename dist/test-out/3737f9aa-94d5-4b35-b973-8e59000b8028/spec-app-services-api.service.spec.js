import {
  TestBed
} from "./chunk-YWKZNBNK.js";
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
  HttpStatusCode,
  REQUESTS_CONTRIBUTE_TO_STABILITY,
  SubdomainService
} from "./chunk-PDRWSRJC.js";
import {
  FactoryTarget,
  Injectable,
  NgModule,
  Observable,
  __decorate,
  catchError,
  core_exports,
  inject,
  map,
  throwError,
  ɵɵngDeclareClassMetadata,
  ɵɵngDeclareFactory,
  ɵɵngDeclareInjectable,
  ɵɵngDeclareInjector,
  ɵɵngDeclareNgModule
} from "./chunk-ZS4HIHEF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-V63QFUML.js";

// node_modules/@angular/common/fesm2022/http/testing.mjs
var HttpTestingController = class {
};
var TestRequest = class {
  request;
  observer;
  /**
   * Whether the request was cancelled after it was sent.
   */
  get cancelled() {
    return this._cancelled;
  }
  /**
   * @internal set by `HttpClientTestingBackend`
   */
  _cancelled = false;
  constructor(request, observer) {
    this.request = request;
    this.observer = observer;
  }
  /**
   * Resolve the request by returning a body plus additional HTTP information (such as response
   * headers) if provided.
   * If the request specifies an expected body type, the body is converted into the requested type.
   * Otherwise, the body is converted to `JSON` by default.
   *
   * Both successful and unsuccessful responses can be delivered via `flush()`.
   */
  flush(body, opts = {}) {
    if (this.cancelled) {
      throw new Error(`Cannot flush a cancelled request.`);
    }
    const url = this.request.urlWithParams;
    const headers = opts.headers instanceof HttpHeaders ? opts.headers : new HttpHeaders(opts.headers);
    body = _maybeConvertBody(this.request.responseType, body);
    let statusText = opts.statusText;
    let status = opts.status !== void 0 ? opts.status : HttpStatusCode.Ok;
    if (opts.status === void 0) {
      if (body === null) {
        status = HttpStatusCode.NoContent;
        statusText ||= "No Content";
      } else {
        statusText ||= "OK";
      }
    }
    if (statusText === void 0) {
      throw new Error("statusText is required when setting a custom status.");
    }
    if (status >= 200 && status < 300) {
      this.observer.next(new HttpResponse({ body, headers, status, statusText, url }));
      this.observer.complete();
    } else {
      this.observer.error(new HttpErrorResponse({ error: body, headers, status, statusText, url }));
    }
  }
  error(error, opts = {}) {
    if (this.cancelled) {
      throw new Error(`Cannot return an error for a cancelled request.`);
    }
    const headers = opts.headers instanceof HttpHeaders ? opts.headers : new HttpHeaders(opts.headers);
    this.observer.error(new HttpErrorResponse({
      error,
      headers,
      status: opts.status || 0,
      statusText: opts.statusText || "",
      url: this.request.urlWithParams
    }));
  }
  /**
   * Deliver an arbitrary `HttpEvent` (such as a progress event) on the response stream for this
   * request.
   */
  event(event) {
    if (this.cancelled) {
      throw new Error(`Cannot send events to a cancelled request.`);
    }
    this.observer.next(event);
  }
};
function _toArrayBufferBody(body) {
  if (typeof ArrayBuffer === "undefined") {
    throw new Error("ArrayBuffer responses are not supported on this platform.");
  }
  if (body instanceof ArrayBuffer) {
    return body;
  }
  throw new Error("Automatic conversion to ArrayBuffer is not supported for response type.");
}
function _toBlob(body) {
  if (typeof Blob === "undefined") {
    throw new Error("Blob responses are not supported on this platform.");
  }
  if (body instanceof Blob) {
    return body;
  }
  if (ArrayBuffer && body instanceof ArrayBuffer) {
    return new Blob([body]);
  }
  throw new Error("Automatic conversion to Blob is not supported for response type.");
}
function _toJsonBody(body, format = "JSON") {
  if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
    throw new Error(`Automatic conversion to ${format} is not supported for ArrayBuffers.`);
  }
  if (typeof Blob !== "undefined" && body instanceof Blob) {
    throw new Error(`Automatic conversion to ${format} is not supported for Blobs.`);
  }
  if (typeof body === "string" || typeof body === "number" || typeof body === "object" || typeof body === "boolean" || Array.isArray(body)) {
    return body;
  }
  throw new Error(`Automatic conversion to ${format} is not supported for response type.`);
}
function _toTextBody(body) {
  if (typeof body === "string") {
    return body;
  }
  if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
    throw new Error("Automatic conversion to text is not supported for ArrayBuffers.");
  }
  if (typeof Blob !== "undefined" && body instanceof Blob) {
    throw new Error("Automatic conversion to text is not supported for Blobs.");
  }
  return JSON.stringify(_toJsonBody(body, "text"));
}
function _maybeConvertBody(responseType, body) {
  if (body === null) {
    return null;
  }
  switch (responseType) {
    case "arraybuffer":
      return _toArrayBufferBody(body);
    case "blob":
      return _toBlob(body);
    case "json":
      return _toJsonBody(body);
    case "text":
      return _toTextBody(body);
    default:
      throw new Error(`Unsupported responseType: ${responseType}`);
  }
}
var HttpClientTestingBackend = class _HttpClientTestingBackend {
  /**
   * List of pending requests which have not yet been expected.
   */
  open = [];
  /**
   * Used when checking if we need to throw the NOT_USING_FETCH_BACKEND_IN_SSR error
   */
  isTestingBackend = true;
  /**
   * Handle an incoming request by queueing it in the list of open requests.
   */
  handle(req) {
    return new Observable((observer) => {
      const testReq = new TestRequest(req, observer);
      this.open.push(testReq);
      observer.next({ type: HttpEventType.Sent });
      return () => {
        testReq._cancelled = true;
      };
    });
  }
  /**
   * Helper function to search for requests in the list of open requests.
   */
  _match(match) {
    if (typeof match === "string") {
      return this.open.filter((testReq) => testReq.request.urlWithParams === match);
    } else if (typeof match === "function") {
      return this.open.filter((testReq) => match(testReq.request));
    } else {
      return this.open.filter((testReq) => (!match.method || testReq.request.method === match.method.toUpperCase()) && (!match.url || testReq.request.urlWithParams === match.url));
    }
  }
  /**
   * Search for requests in the list of open requests, and return all that match
   * without asserting anything about the number of matches.
   */
  match(match) {
    const results = this._match(match);
    results.forEach((result) => {
      const index = this.open.indexOf(result);
      if (index !== -1) {
        this.open.splice(index, 1);
      }
    });
    return results;
  }
  /**
   * Expect that a single outstanding request matches the given matcher, and return
   * it.
   *
   * Requests returned through this API will no longer be in the list of open requests,
   * and thus will not match twice.
   */
  expectOne(match, description) {
    description ||= this.descriptionFromMatcher(match);
    const matches = this.match(match);
    if (matches.length > 1) {
      throw new Error(`Expected one matching request for criteria "${description}", found ${matches.length} requests.`);
    }
    if (matches.length === 0) {
      let message = `Expected one matching request for criteria "${description}", found none.`;
      if (this.open.length > 0) {
        const requests = this.open.map(describeRequest).join(", ");
        message += ` Requests received are: ${requests}.`;
      }
      throw new Error(message);
    }
    return matches[0];
  }
  /**
   * Expect that no outstanding requests match the given matcher, and throw an error
   * if any do.
   */
  expectNone(match, description) {
    description ||= this.descriptionFromMatcher(match);
    const matches = this.match(match);
    if (matches.length > 0) {
      throw new Error(`Expected zero matching requests for criteria "${description}", found ${matches.length}.`);
    }
  }
  /**
   * Validate that there are no outstanding requests.
   */
  verify(opts = {}) {
    let open = this.open;
    if (opts.ignoreCancelled) {
      open = open.filter((testReq) => !testReq.cancelled);
    }
    if (open.length > 0) {
      const requests = open.map(describeRequest).join(", ");
      throw new Error(`Expected no open requests, found ${open.length}: ${requests}`);
    }
  }
  descriptionFromMatcher(matcher) {
    if (typeof matcher === "string") {
      return `Match URL: ${matcher}`;
    } else if (typeof matcher === "object") {
      const method = matcher.method || "(any)";
      const url = matcher.url || "(any)";
      return `Match method: ${method}, URL: ${url}`;
    } else {
      return `Match by function: ${matcher.name}`;
    }
  }
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _HttpClientTestingBackend, deps: [], target: FactoryTarget.Injectable });
  static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _HttpClientTestingBackend });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: HttpClientTestingBackend, decorators: [{
  type: Injectable
}] });
function describeRequest(testRequest) {
  const url = testRequest.request.urlWithParams;
  const method = testRequest.request.method;
  return `${method} ${url}`;
}
function provideHttpClientTesting() {
  return [
    HttpClientTestingBackend,
    { provide: HttpBackend, useExisting: HttpClientTestingBackend },
    { provide: HttpTestingController, useExisting: HttpClientTestingBackend },
    { provide: REQUESTS_CONTRIBUTE_TO_STABILITY, useValue: false }
  ];
}
var HttpClientTestingModule = class _HttpClientTestingModule {
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _HttpClientTestingModule, deps: [], target: FactoryTarget.NgModule });
  static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _HttpClientTestingModule, imports: [HttpClientModule] });
  static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _HttpClientTestingModule, providers: [provideHttpClientTesting()], imports: [HttpClientModule] });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: HttpClientTestingModule, decorators: [{
  type: NgModule,
  args: [{
    imports: [HttpClientModule],
    providers: [provideHttpClientTesting()]
  }]
}] });

// src/app/services/api.service.ts
var ApiService = class ApiService2 {
  http = inject(HttpClient);
  subdomainService = inject(SubdomainService);
  // Lead Intake API - endpoint público para receber leads
  submitLead(leadData, captchaToken) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const apiUrl = this.getLeadIntakeUrl();
    const headers = this.getApiHeaders(company.apiConfig.token);
    if (captchaToken) {
      headers.set("X-Captcha-Token", captchaToken);
    }
    const payload = __spreadProps(__spreadValues({}, leadData), {
      companyId: company.id,
      subdomain: company.subdomain,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return this.http.post(apiUrl, payload, { headers }).pipe(map((response) => __spreadProps(__spreadValues({}, response), {
      success: true
    })), catchError((error) => {
      console.error("Erro ao submeter lead:", error);
      return throwError(() => ({
        success: false,
        error: error.error?.message || "Erro ao submeter lead"
      }));
    }));
  }
  // Webhook para notificações de automação
  sendWebhook(webhookUrl, payload) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "User-Agent": "TaskBoard-Webhooks/1.0"
    });
    return this.http.post(webhookUrl, payload, { headers }).pipe(catchError((error) => {
      console.error("Erro ao enviar webhook:", error);
      return throwError(() => error);
    }));
  }
  // Obter informações da empresa via API pública
  getCompanyInfo(subdomain) {
    const url = `${this.getBaseApiUrl()}/companies/${subdomain}/info`;
    return this.http.get(url).pipe(catchError((error) => {
      console.error("Erro ao obter informa\xE7\xF5es da empresa:", error);
      return throwError(() => error);
    }));
  }
  // Obter configuração do formulário público
  getPublicFormConfig() {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const url = `${this.getCompanyApiUrl()}/form-config`;
    const headers = this.getApiHeaders(company.apiConfig.token);
    return this.http.get(url, { headers }).pipe(catchError((error) => {
      console.error("Erro ao obter configura\xE7\xE3o do formul\xE1rio:", error);
      return throwError(() => error);
    }));
  }
  // Validar token da API
  validateApiToken(token) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const url = `${this.getCompanyApiUrl()}/validate-token`;
    const headers = this.getApiHeaders(token);
    return this.http.post(url, {}, { headers }).pipe(map((response) => response.valid), catchError((error) => {
      console.error("Erro ao validar token:", error);
      return throwError(() => false);
    }));
  }
  // Regenerar token da API
  regenerateApiToken() {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const url = `${this.getCompanyApiUrl()}/regenerate-token`;
    const headers = this.getApiHeaders(company.apiConfig.token);
    return this.http.post(url, {}, { headers }).pipe(map((response) => {
      if (company) {
        company.apiConfig.token = response.token;
        this.subdomainService.setCurrentCompany(company);
      }
      return response;
    }), catchError((error) => {
      console.error("Erro ao regenerar token:", error);
      return throwError(() => error);
    }));
  }
  // Obter estatísticas da API
  getApiStats(period = "24h") {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const url = `${this.getCompanyApiUrl()}/stats?period=${period}`;
    const headers = this.getApiHeaders(company.apiConfig.token);
    return this.http.get(url, { headers }).pipe(catchError((error) => {
      console.error("Erro ao obter estat\xEDsticas da API:", error);
      return throwError(() => error);
    }));
  }
  // Obter logs da API
  getApiLogs(limit = 100, offset = 0) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const url = `${this.getCompanyApiUrl()}/logs?limit=${limit}&offset=${offset}`;
    const headers = this.getApiHeaders(company.apiConfig.token);
    return this.http.get(url, { headers }).pipe(catchError((error) => {
      console.error("Erro ao obter logs da API:", error);
      return throwError(() => error);
    }));
  }
  // Testar endpoint da API
  testApiEndpoint(boardId) {
    const testPayload = {
      boardId: boardId || void 0,
      // Será usado o quadro padrão se não fornecido
      companyName: "Empresa Teste",
      contactName: "Teste API",
      contactEmail: "teste@api.com",
      contactPhone: "(11) 99999-9999",
      source: "api-test",
      customFields: {
        testField: "Valor de teste",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    return this.submitLead(testPayload).pipe(map((response) => __spreadProps(__spreadValues({}, response), {
      testMode: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    })));
  }
  // URLs e configurações
  getLeadIntakeUrl() {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      throw new Error("Empresa n\xE3o encontrada");
    }
    if (company.apiConfig.endpoint) {
      return company.apiConfig.endpoint;
    }
    if (this.subdomainService.isDevelopment()) {
      return `http://localhost:5000/api/v1/lead-intake`;
    }
    return `https://${company.subdomain}.taskboard.com.br/api/v1/lead-intake`;
  }
  getCompanyApiUrl() {
    const baseUrl = this.subdomainService.getApiUrl();
    return `${baseUrl}/api`;
  }
  getBaseApiUrl() {
    if (this.subdomainService.isDevelopment()) {
      return "http://localhost:5000/api/v1";
    }
    return "https://api.taskboard.com.br/v1";
  }
  // Gerar exemplo de código para integração
  getIntegrationExamples(boardId, formFields) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return {};
    }
    const apiUrl = this.getLeadIntakeUrl();
    const token = company.apiConfig.token;
    const dynamicFields = this.generateDynamicFieldsExample(formFields);
    const fieldsComment = formFields && formFields.length > 0 ? "    // Campos configurados no formul\xE1rio:\n" + formFields.map((f) => `    // "${f.name}": "${f.type}"`).join(",\n") + "\n" : "    // Configure campos personalizados no Visual Form Builder\n";
    return {
      curl: `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -H "X-Company-Subdomain: ${company.subdomain}" \\
  -d '{
    "boardId": "${boardId || "ID_DO_QUADRO"}",
    "companyName": "Nome da Empresa Exemplo",
    "cnpj": "00.000.000/0001-00",
    "contactName": "Nome do Contato",
    "contactEmail": "email@exemplo.com",
    "contactPhone": "(11) 99999-9999"${dynamicFields ? ",\n" + dynamicFields : ""}
  }'`,
      javascript: `${fieldsComment}fetch('${apiUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${token}',
    'X-Company-Subdomain': '${company.subdomain}'
  },
  body: JSON.stringify({
    boardId: '${boardId || "ID_DO_QUADRO"}',
    companyName: 'Nome da Empresa Exemplo',
    cnpj: '00.000.000/0001-00',
    contactName: 'Nome do Contato',
    contactEmail: 'email@exemplo.com',
    contactPhone: '(11) 99999-9999'${dynamicFields ? ",\n    " + dynamicFields.replace(/    /g, "    ") : ""}
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
      php: `<?php
// ${fieldsComment.replace(/\/\//g, "//")}
$url = '${apiUrl}';
$data = [
    'boardId' => '${boardId || "ID_DO_QUADRO"}',
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

# ${fieldsComment.replace(/\/\//g, "#")}
url = '${apiUrl}'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${token}',
    'X-Company-Subdomain': '${company.subdomain}'
}
data = {
    'boardId': '${boardId || "ID_DO_QUADRO"}',
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
  generateDynamicFieldsExample(formFields) {
    if (!formFields || formFields.length === 0) {
      return "";
    }
    return formFields.filter((field) => field.includeInApi !== false).map((field) => {
      const fieldName = field.apiFieldName || field.name;
      const exampleValue = this.getExampleValue(field.type);
      return `    "${fieldName}": "${exampleValue}"`;
    }).join(",\n");
  }
  // Gerar campos dinâmicos para PHP
  generateDynamicFieldsPhp(formFields) {
    if (!formFields || formFields.length === 0) {
      return "";
    }
    return ",\n" + formFields.filter((field) => field.includeInApi !== false).map((field) => {
      const fieldName = field.apiFieldName || field.name;
      const exampleValue = this.getExampleValue(field.type);
      return `    '${fieldName}' => '${exampleValue}'`;
    }).join(",\n");
  }
  // Gerar campos dinâmicos para Python
  generateDynamicFieldsPython(formFields) {
    if (!formFields || formFields.length === 0) {
      return "";
    }
    return ",\n" + formFields.filter((field) => field.includeInApi !== false).map((field) => {
      const fieldName = field.apiFieldName || field.name;
      const exampleValue = this.getExampleValue(field.type);
      return `    '${fieldName}': '${exampleValue}'`;
    }).join(",\n");
  }
  // Obter valor de exemplo baseado no tipo do campo
  getExampleValue(fieldType) {
    switch (fieldType) {
      case "email":
        return "exemplo@email.com";
      case "tel":
        return "(11) 99999-9999";
      case "number":
        return "123";
      case "cnpj":
        return "00.000.000/0001-00";
      case "cpf":
        return "000.000.000-00";
      case "date":
        return "2024-01-01";
      case "time":
        return "14:30";
      case "temperatura":
        return "Quente";
      case "textarea":
        return "Texto de exemplo";
      case "select":
      case "radio":
        return "Op\xE7\xE3o 1";
      case "checkbox":
        return "true";
      default:
        return "Valor exemplo";
    }
  }
  // Headers padrão para autenticação
  getApiHeaders(token) {
    const company = this.subdomainService.getCurrentCompany();
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });
    if (company) {
      headers = headers.set("X-Company-Subdomain", company.subdomain);
    }
    return headers;
  }
};
ApiService = __decorate([
  Injectable({
    providedIn: "root"
  })
], ApiService);

// src/app/services/api.service.spec.ts
describe("ApiService", () => {
  let service;
  let httpMock;
  let subdomainService;
  const mockCompany = {
    id: "test-company-id",
    name: "Test Company",
    subdomain: "test",
    contactEmail: "owner@test.com",
    ownerId: "test-owner-id",
    ownerEmail: "owner@test.com",
    smtpConfig: {
      host: "smtp.test.com",
      port: 587,
      secure: false,
      user: "test@test.com",
      password: "password",
      fromName: "Test Company",
      fromEmail: "noreply@test.com"
    },
    apiConfig: {
      enabled: true,
      token: "test-api-token",
      endpoint: "http://localhost:5000/api/v1/lead-intake"
    },
    plan: "professional",
    features: {
      maxBoards: 10,
      maxUsers: 5,
      maxLeadsPerMonth: 1e3,
      maxEmailsPerMonth: 500,
      customBranding: true,
      apiAccess: true,
      webhooks: true,
      advancedReports: true,
      whiteLabel: false
    },
    status: "active",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  };
  beforeEach(() => {
    const subdomainServiceSpy = jasmine.createSpyObj("SubdomainService", [
      "getCurrentCompany",
      "setCurrentCompany",
      "getApiUrl",
      "isDevelopment"
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
    subdomainService = TestBed.inject(SubdomainService);
    subdomainService.getCurrentCompany.and.returnValue(mockCompany);
    subdomainService.isDevelopment.and.returnValue(true);
    subdomainService.getApiUrl.and.returnValue("http://localhost:5000");
  });
  afterEach(() => {
    httpMock.verify();
  });
  describe("submitLead", () => {
    it("should submit lead with boardId instead of phaseId", () => {
      const testLead = {
        boardId: "board-123",
        companyName: "Test Company",
        contactName: "John Doe",
        contactEmail: "john@example.com",
        contactPhone: "(11) 99999-9999",
        customFields: {
          customField1: "value1",
          customField2: "value2"
        }
      };
      const expectedResponse = {
        success: true,
        leadId: "lead-456",
        message: "Lead created successfully"
      };
      service.submitLead(testLead).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.leadId).toBe("lead-456");
      });
      const req = httpMock.expectOne(mockCompany.apiConfig.endpoint);
      expect(req.request.method).toBe("POST");
      expect(req.request.body.boardId).toBe("board-123");
      expect(req.request.body.companyId).toBe(mockCompany.id);
      expect(req.request.body.subdomain).toBe(mockCompany.subdomain);
      expect(req.request.body.customFields).toEqual(testLead.customFields);
      expect(req.request.headers.get("Authorization")).toBe(`Bearer ${mockCompany.apiConfig.token}`);
      expect(req.request.headers.get("X-Company-Subdomain")).toBe(mockCompany.subdomain);
      req.flush(expectedResponse);
    });
    it("should handle missing company context", () => {
      subdomainService.getCurrentCompany.and.returnValue(null);
      service.submitLead({}).subscribe({
        next: () => fail("Should have thrown an error"),
        error: (error) => {
          expect(error.message).toBe("Empresa n\xE3o encontrada");
        }
      });
      httpMock.expectNone(mockCompany.apiConfig.endpoint);
    });
    it("should include captcha token when provided", () => {
      const testLead = {
        contactName: "Test User",
        contactEmail: "test@example.com"
      };
      const captchaToken = "test-captcha-token";
      service.submitLead(testLead, captchaToken).subscribe();
      const req = httpMock.expectOne(mockCompany.apiConfig.endpoint);
      expect(req.request.headers.get("X-Captcha-Token")).toBe(captchaToken);
      req.flush({ success: true });
    });
  });
  describe("testApiEndpoint", () => {
    it("should test API with boardId parameter", () => {
      const boardId = "test-board-id";
      service.testApiEndpoint(boardId).subscribe((response) => {
        expect(response.testMode).toBe(true);
        expect(response.timestamp).toBeDefined();
      });
      const req = httpMock.expectOne(mockCompany.apiConfig.endpoint);
      expect(req.request.body.boardId).toBe(boardId);
      expect(req.request.body.companyName).toBe("Empresa Teste");
      expect(req.request.body.source).toBe("api-test");
      expect(req.request.body.customFields).toBeDefined();
      expect(req.request.body.customFields.testField).toBe("Valor de teste");
      req.flush({ success: true, leadId: "test-lead-id" });
    });
    it("should test API without boardId parameter", () => {
      service.testApiEndpoint().subscribe();
      const req = httpMock.expectOne(mockCompany.apiConfig.endpoint);
      expect(req.request.body.boardId).toBeUndefined();
      req.flush({ success: true });
    });
  });
  describe("getIntegrationExamples", () => {
    it("should generate examples with boardId and form fields", () => {
      const boardId = "example-board-id";
      const formFields = [
        { name: "customField1", type: "text", includeInApi: true },
        { name: "temperature", type: "temperatura", includeInApi: true, apiFieldName: "temp" },
        { name: "privateField", type: "text", includeInApi: false }
      ];
      const examples = service.getIntegrationExamples(boardId, formFields);
      expect(examples["curl"]).toContain(`"boardId": "${boardId}"`);
      expect(examples["curl"]).toContain(`"customField1": "Valor exemplo"`);
      expect(examples["curl"]).toContain(`"temp": "Quente"`);
      expect(examples["curl"]).not.toContain("privateField");
      expect(examples["javascript"]).toContain(`boardId: '${boardId}'`);
      expect(examples["php"]).toContain(`'boardId' => '${boardId}'`);
      expect(examples["python"]).toContain(`'boardId': '${boardId}'`);
    });
    it("should generate examples without form fields", () => {
      const boardId = "example-board-id";
      const examples = service.getIntegrationExamples(boardId);
      expect(examples["curl"]).toContain(`"boardId": "${boardId}"`);
      expect(examples["curl"]).toContain("Configure campos personalizados");
      expect(examples["javascript"]).toContain(`boardId: '${boardId}'`);
    });
    it("should handle missing company context", () => {
      subdomainService.getCurrentCompany.and.returnValue(null);
      const examples = service.getIntegrationExamples();
      expect(Object.keys(examples).length).toBe(0);
    });
  });
  describe("field type examples", () => {
    it("should generate correct example values for different field types", () => {
      const formFields = [
        { name: "email", type: "email", includeInApi: true },
        { name: "phone", type: "tel", includeInApi: true },
        { name: "cnpj", type: "cnpj", includeInApi: true },
        { name: "date", type: "date", includeInApi: true },
        { name: "temperature", type: "temperatura", includeInApi: true },
        { name: "checkbox", type: "checkbox", includeInApi: true }
      ];
      const examples = service.getIntegrationExamples("board-id", formFields);
      expect(examples["curl"]).toContain(`"email": "exemplo@email.com"`);
      expect(examples["curl"]).toContain(`"phone": "(11) 99999-9999"`);
      expect(examples["curl"]).toContain(`"cnpj": "00.000.000/0001-00"`);
      expect(examples["curl"]).toContain(`"date": "2024-01-01"`);
      expect(examples["curl"]).toContain(`"temperature": "Quente"`);
      expect(examples["curl"]).toContain(`"checkbox": "true"`);
    });
  });
  describe("URL generation", () => {
    it("should use custom endpoint when configured", () => {
      const customEndpoint = "https://custom-api.example.com/intake";
      mockCompany.apiConfig.endpoint = customEndpoint;
      const url = service.getLeadIntakeUrl();
      expect(url).toBe(customEndpoint);
    });
    it("should use default development URL", () => {
      mockCompany.apiConfig.endpoint = "";
      subdomainService.isDevelopment.and.returnValue(true);
      const url = service.getLeadIntakeUrl();
      expect(url).toBe("http://localhost:5000/api/v1/lead-intake");
    });
    it("should use production URL with subdomain", () => {
      mockCompany.apiConfig.endpoint = "";
      subdomainService.isDevelopment.and.returnValue(false);
      const url = service.getLeadIntakeUrl();
      expect(url).toBe(`https://${mockCompany.subdomain}.taskboard.com.br/api/v1/lead-intake`);
    });
  });
});
/*! Bundled license information:

@angular/common/fesm2022/http/testing.mjs:
  (**
   * @license Angular v20.2.2
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=spec-app-services-api.service.spec.js.map
