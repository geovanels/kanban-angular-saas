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
  phaseId?: string;
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
  testApiEndpoint(): Observable<any> {
    const testPayload: LeadIntakeRequest = {
      companyName: 'Empresa Teste',
      contactName: 'Teste API',
      contactEmail: 'teste@api.com',
      contactPhone: '(11) 99999-9999',
      source: 'api-test'
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
  getIntegrationExamples(): { [key: string]: string } {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return {};
    }

    const apiUrl = this.getLeadIntakeUrl();
    const token = company.apiConfig.token;

    return {
      curl: `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -H "X-Company-Subdomain: ${company.subdomain}" \\
  -d '{
    "companyName": "Nome da Empresa Exemplo",
    "cnpj": "00.000.000/0001-00",
    "contactName": "Nome do Contato",
    "contactEmail": "email@exemplo.com",
    "contactPhone": "(11) 99999-9999",
    "phaseId": "(Opcional) ID da fase"
  }'`,

      javascript: `fetch('${apiUrl}', {
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
    contactPhone: '(11) 99999-9999',
    phaseId: '(Opcional) ID da fase'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,

      php: `<?php
$url = '${apiUrl}';
$data = [
    'companyName' => 'Nome da Empresa Exemplo',
    'cnpj' => '00.000.000/0001-00',
    'contactName' => 'Nome do Contato',
    'contactEmail' => 'email@exemplo.com',
    'contactPhone' => '(11) 99999-9999',
    'phaseId' => '(Opcional) ID da fase'
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
    'contactPhone': '(11) 99999-9999',
    'phaseId': '(Opcional) ID da fase'
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
    };
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