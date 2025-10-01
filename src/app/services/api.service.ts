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
  private http: HttpClient = inject(HttpClient);
  private subdomainService = inject(SubdomainService);

  // Lead Intake API - via Firebase HTTP Function
  submitLead(leadData: LeadIntakeRequest, captchaToken?: string): Observable<LeadIntakeResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }
    if (!company.id) {
      return throwError(() => new Error('ID da empresa não encontrado'));
    }

    const boardId = leadData.boardId;
    const companyId: string = company.id as string;
    const apiUrl = this.getLeadIntakeUrl(companyId, boardId);
    let headers = this.getApiHeaders(company.apiConfig.token);

    if (captchaToken) {
      headers = headers.set('X-Captcha-Token', captchaToken);
    }

    // Normalizar dados do lead dentro de leadData.fields
    const { boardId: _ignored, ...rest } = leadData;
    const normalized = (rest as any).fields ? (rest as any) : { fields: rest };

    const payload = {
      leadData: normalized
    };

    return this.http.post<LeadIntakeResponse>(apiUrl, payload, { headers }).pipe(
      map((response: any) => ({
        ...(response as object),
        success: true
      })),
      catchError(error => {
        console.error('Erro ao submeter lead:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.error?.message || 'Erro ao submeter lead'
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
      map((response: any) => response.valid),
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
          company.apiConfig.token = (response as any).token;
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
      map((response: any) => ({
        ...(response as object),
        testMode: true,
        timestamp: new Date().toISOString()
      }))
    );
  }

  // URLs e configurações
  getLeadIntakeUrl(companyId: string, boardId?: string): string {
    const path = boardId
      ? `/companies/${encodeURIComponent(companyId)}/boards/${encodeURIComponent(boardId)}`
      : `/companies/${encodeURIComponent(companyId)}`;
    if (this.subdomainService.isDevelopment()) {
      const port = this.getLocalFunctionsPort();
      return `http://localhost:${port}/kanban-gobuyer/us-central1/leadIntakeHttp${path}`;
    }
    return `https://us-central1-kanban-gobuyer.cloudfunctions.net/leadIntakeHttp${path}`;
  }

  getCompanyApiUrl(): string {
    const baseUrl = this.subdomainService.getApiUrl();
    return `${baseUrl}/api`;
  }

  getBaseApiUrl(): string {
    if (this.subdomainService.isDevelopment()) {
      // Detectar porta dinamicamente para Firebase Functions
      const functionsPort = this.getLocalFunctionsPort();
      return `http://localhost:${functionsPort}/api/v1`;
    }
    
    return 'https://api.taskboard.com.br/v1';
  }

  private getLocalFunctionsPort(): number {
    // 1. Verificar localStorage (configuração salva pelo usuário)
    const storedPort = localStorage.getItem('firebase-functions-port');
    if (storedPort) {
      return parseInt(storedPort, 10);
    }
    
    // 2. Tentar detectar pela configuração do Firebase (se disponível)
    try {
      // Verificar se existe alguma configuração global do Firebase
      const firebaseConfig = (window as any).__FIREBASE_DEFAULTS__;
      if (firebaseConfig?.emulatorHosts?.functions) {
        const functionsHost = firebaseConfig.emulatorHosts.functions;
        const portMatch = functionsHost.match(/:(\d+)$/);
        if (portMatch) {
          return parseInt(portMatch[1], 10);
        }
      }
    } catch (error) {
      // Ignorar erro se não conseguir detectar
    }
    
    // 3. Usar porta padrão do emulador do Firebase Functions
    return 5001;
  }

  // Método para permitir ao usuário definir porta customizada
  setCustomFunctionsPort(port: number): void {
    localStorage.setItem('firebase-functions-port', port.toString());
  }

  // Gerar exemplo de código para integração
  getIntegrationExamples(boardId?: string, formFields?: any[]): { [key: string]: string } {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return {};
    }

    // A URL agora inclui companyId e opcionalmente boardId no path
    const apiUrl = this.getLeadIntakeUrl(company.id || '{COMPANY_ID}', boardId);
    const token = company.apiConfig.token;
    
    // Gerar campos dinâmicos baseados no formulário configurado
    const dynamicFields = this.generateDynamicFieldsExample(formFields);
    const fieldsComment = formFields && formFields.length > 0 
      ? '    // Campos configurados no formulário:\n' + formFields
          .filter(field => field.includeInApi !== false)
          .map(f => `    // "${f.name}": "${f.type}"`)
          .join(',\n') + '\n'
      : '    // Configure campos personalizados no Visual Form Builder\n';

    const urlComment = boardId 
      ? `// URL inclui o ID do quadro: ${boardId}\n` 
      : `// Substitua {BOARD_ID} pelo ID do quadro desejado na URL\n`;

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
    "contactPhone": "(11) 99999-9999"${dynamicFields ? ',\n' + dynamicFields : ''}
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
    contactPhone: '(11) 99999-9999'${dynamicFields ? ',\n    ' + dynamicFields.replace(/    /g, '    ') : ''}
  })
})
.then(response => response.json())
.then(data => console.log(data));`,

      php: `<?php
${urlComment.replace(/\/\//g, '//')}// ${fieldsComment.replace(/\/\//g, '//')}
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

${urlComment.replace(/\/\//g, '#')}# ${fieldsComment.replace(/\/\//g, '#')}
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