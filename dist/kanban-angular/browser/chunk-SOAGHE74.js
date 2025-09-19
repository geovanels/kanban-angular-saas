import {
  HttpClient,
  HttpHeaders
} from "./chunk-L3ANR23A.js";
import {
  SubdomainService
} from "./chunk-NDNGZ4HQ.js";
import {
  Injectable,
  __name,
  __objRest,
  __publicField,
  __spreadProps,
  __spreadValues,
  catchError,
  inject,
  map,
  setClassMetadata,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-GMR7JISZ.js";

// src/app/services/api.service.ts
var _ApiService = class _ApiService {
  http = inject(HttpClient);
  subdomainService = inject(SubdomainService);
  // Lead Intake API - via Firebase HTTP Function
  submitLead(leadData, captchaToken) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    if (!company.id) {
      return throwError(() => new Error("ID da empresa n\xE3o encontrado"));
    }
    const boardId = leadData.boardId;
    const companyId = company.id;
    const apiUrl = this.getLeadIntakeUrl(companyId, boardId);
    let headers = this.getApiHeaders(company.apiConfig.token);
    if (captchaToken) {
      headers = headers.set("X-Captcha-Token", captchaToken);
    }
    const _a = leadData, { boardId: _ignored } = _a, rest = __objRest(_a, ["boardId"]);
    const normalized = rest.fields ? rest : { fields: rest };
    const payload = {
      leadData: normalized
    };
    return this.http.post(apiUrl, payload, { headers }).pipe(map((response) => __spreadProps(__spreadValues({}, response), {
      success: true
    })), catchError((error) => {
      console.error("Erro ao submeter lead:", error);
      return throwError(() => ({
        success: false,
        error: error.error?.error || error.error?.message || "Erro ao submeter lead"
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
  getLeadIntakeUrl(companyId, boardId) {
    const path = boardId ? `/companies/${encodeURIComponent(companyId)}/boards/${encodeURIComponent(boardId)}` : `/companies/${encodeURIComponent(companyId)}`;
    if (this.subdomainService.isDevelopment()) {
      const port = this.getLocalFunctionsPort();
      return `http://localhost:${port}/kanban-gobuyer/us-central1/leadIntakeHttp${path}`;
    }
    return `https://us-central1-kanban-gobuyer.cloudfunctions.net/leadIntakeHttp${path}`;
  }
  getCompanyApiUrl() {
    const baseUrl = this.subdomainService.getApiUrl();
    return `${baseUrl}/api`;
  }
  getBaseApiUrl() {
    if (this.subdomainService.isDevelopment()) {
      const functionsPort = this.getLocalFunctionsPort();
      return `http://localhost:${functionsPort}/api/v1`;
    }
    return "https://api.taskboard.com.br/v1";
  }
  getLocalFunctionsPort() {
    const storedPort = localStorage.getItem("firebase-functions-port");
    if (storedPort) {
      return parseInt(storedPort, 10);
    }
    try {
      const firebaseConfig = window.__FIREBASE_DEFAULTS__;
      if (firebaseConfig?.emulatorHosts?.functions) {
        const functionsHost = firebaseConfig.emulatorHosts.functions;
        const portMatch = functionsHost.match(/:(\d+)$/);
        if (portMatch) {
          return parseInt(portMatch[1], 10);
        }
      }
    } catch (error) {
    }
    return 5001;
  }
  // Método para permitir ao usuário definir porta customizada
  setCustomFunctionsPort(port) {
    localStorage.setItem("firebase-functions-port", port.toString());
  }
  // Gerar exemplo de código para integração
  getIntegrationExamples(boardId, formFields) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return {};
    }
    const apiUrl = this.getLeadIntakeUrl(company.id || "{COMPANY_ID}", boardId);
    const token = company.apiConfig.token;
    const dynamicFields = this.generateDynamicFieldsExample(formFields);
    const fieldsComment = formFields && formFields.length > 0 ? "    // Campos configurados no formul\xE1rio:\n" + formFields.filter((field) => field.includeInApi !== false).map((f) => `    // "${f.name}": "${f.type}"`).join(",\n") + "\n" : "    // Configure campos personalizados no Visual Form Builder\n";
    const urlComment = boardId ? `// URL inclui o ID do quadro: ${boardId}
` : `// Substitua {BOARD_ID} pelo ID do quadro desejado na URL
`;
    return {
      curl: `${urlComment}${fieldsComment}curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -H "X-Company-Subdomain: ${company.subdomain}" \\
  -d '{
    "companyName": "Nome da Empresa Exemplo",
    "cnpj": "00.000.000/0001-00",
    "contactName": "Nome do Contato",
    "contactEmail": "email@exemplo.com",
    "contactPhone": "(11) 99999-9999"${dynamicFields ? ",\n" + dynamicFields : ""}
  }'`,
      javascript: `${urlComment}${fieldsComment}fetch('${apiUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${token}',
    'X-Company-Subdomain': '${company.subdomain}'
  },
  body: JSON.stringify({
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
${urlComment.replace(/\/\//g, "//")}// ${fieldsComment.replace(/\/\//g, "//")}
$url = '${apiUrl}';
$data = [
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

${urlComment.replace(/\/\//g, "#")}# ${fieldsComment.replace(/\/\//g, "#")}
url = '${apiUrl}'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${token}',
    'X-Company-Subdomain': '${company.subdomain}'
}
data = {
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
__name(_ApiService, "ApiService");
__publicField(_ApiService, "\u0275fac", /* @__PURE__ */ __name(function ApiService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ApiService)();
}, "ApiService_Factory"));
__publicField(_ApiService, "\u0275prov", /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiService, factory: _ApiService.\u0275fac, providedIn: "root" }));
var ApiService = _ApiService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApiService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ApiService
};
//# sourceMappingURL=chunk-SOAGHE74.js.map
