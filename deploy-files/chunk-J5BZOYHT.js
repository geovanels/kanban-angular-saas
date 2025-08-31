import{a as h,b}from"./chunk-KJIKDUO6.js";import{a as y}from"./chunk-OQZFYMYT.js";import{J as s,_ as g,a as m,b as d,da as l,w as a,z as i}from"./chunk-CM3JQ4U2.js";var f=class u{http=l(b);subdomainService=l(y);submitLead(e,o){let t=this.subdomainService.getCurrentCompany();if(!t)return a(()=>new Error("Empresa n\xE3o encontrada"));let n=this.getLeadIntakeUrl(),r=this.getApiHeaders(t.apiConfig.token);o&&r.set("X-Captcha-Token",o);let p=d(m({},e),{companyId:t.id,subdomain:t.subdomain,timestamp:new Date().toISOString()});return this.http.post(n,p,{headers:r}).pipe(i(c=>d(m({},c),{success:!0})),s(c=>(console.error("Erro ao submeter lead:",c),a(()=>({success:!1,error:c.error?.message||"Erro ao submeter lead"})))))}sendWebhook(e,o){let t=new h({"Content-Type":"application/json","User-Agent":"TaskBoard-Webhooks/1.0"});return this.http.post(e,o,{headers:t}).pipe(s(n=>(console.error("Erro ao enviar webhook:",n),a(()=>n))))}getCompanyInfo(e){let o=`${this.getBaseApiUrl()}/companies/${e}/info`;return this.http.get(o).pipe(s(t=>(console.error("Erro ao obter informa\xE7\xF5es da empresa:",t),a(()=>t))))}getPublicFormConfig(){let e=this.subdomainService.getCurrentCompany();if(!e)return a(()=>new Error("Empresa n\xE3o encontrada"));let o=`${this.getCompanyApiUrl()}/form-config`,t=this.getApiHeaders(e.apiConfig.token);return this.http.get(o,{headers:t}).pipe(s(n=>(console.error("Erro ao obter configura\xE7\xE3o do formul\xE1rio:",n),a(()=>n))))}validateApiToken(e){if(!this.subdomainService.getCurrentCompany())return a(()=>new Error("Empresa n\xE3o encontrada"));let t=`${this.getCompanyApiUrl()}/validate-token`,n=this.getApiHeaders(e);return this.http.post(t,{},{headers:n}).pipe(i(r=>r.valid),s(r=>(console.error("Erro ao validar token:",r),a(()=>!1))))}regenerateApiToken(){let e=this.subdomainService.getCurrentCompany();if(!e)return a(()=>new Error("Empresa n\xE3o encontrada"));let o=`${this.getCompanyApiUrl()}/regenerate-token`,t=this.getApiHeaders(e.apiConfig.token);return this.http.post(o,{},{headers:t}).pipe(i(n=>(e&&(e.apiConfig.token=n.token,this.subdomainService.setCurrentCompany(e)),n)),s(n=>(console.error("Erro ao regenerar token:",n),a(()=>n))))}getApiStats(e="24h"){let o=this.subdomainService.getCurrentCompany();if(!o)return a(()=>new Error("Empresa n\xE3o encontrada"));let t=`${this.getCompanyApiUrl()}/stats?period=${e}`,n=this.getApiHeaders(o.apiConfig.token);return this.http.get(t,{headers:n}).pipe(s(r=>(console.error("Erro ao obter estat\xEDsticas da API:",r),a(()=>r))))}getApiLogs(e=100,o=0){let t=this.subdomainService.getCurrentCompany();if(!t)return a(()=>new Error("Empresa n\xE3o encontrada"));let n=`${this.getCompanyApiUrl()}/logs?limit=${e}&offset=${o}`,r=this.getApiHeaders(t.apiConfig.token);return this.http.get(n,{headers:r}).pipe(s(p=>(console.error("Erro ao obter logs da API:",p),a(()=>p))))}testApiEndpoint(){let e={companyName:"Empresa Teste",contactName:"Teste API",contactEmail:"teste@api.com",contactPhone:"(11) 99999-9999",source:"api-test"};return this.submitLead(e).pipe(i(o=>d(m({},o),{testMode:!0,timestamp:new Date().toISOString()})))}getLeadIntakeUrl(){let e=this.subdomainService.getCurrentCompany();if(!e)throw new Error("Empresa n\xE3o encontrada");return e.apiConfig.endpoint?e.apiConfig.endpoint:this.subdomainService.isDevelopment()?"http://localhost:5000/api/v1/lead-intake":`https://${e.subdomain}.taskboard.com.br/api/v1/lead-intake`}getCompanyApiUrl(){return`${this.subdomainService.getApiUrl()}/api`}getBaseApiUrl(){return this.subdomainService.isDevelopment()?"http://localhost:5000/api/v1":"https://api.taskboard.com.br/v1"}getIntegrationExamples(){let e=this.subdomainService.getCurrentCompany();if(!e)return{};let o=this.getLeadIntakeUrl(),t=e.apiConfig.token;return{curl:`curl -X POST "${o}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${t}" \\
  -H "X-Company-Subdomain: ${e.subdomain}" \\
  -d '{
    "companyName": "Nome da Empresa Exemplo",
    "cnpj": "00.000.000/0001-00",
    "contactName": "Nome do Contato",
    "contactEmail": "email@exemplo.com",
    "contactPhone": "(11) 99999-9999",
    "phaseId": "(Opcional) ID da fase"
  }'`,javascript:`fetch('${o}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${t}',
    'X-Company-Subdomain': '${e.subdomain}'
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
.then(data => console.log(data));`,php:`<?php
$url = '${o}';
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
            'Authorization: Bearer ${t}',
            'X-Company-Subdomain: ${e.subdomain}'
        ],
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>`,python:`import requests
import json

url = '${o}'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${t}',
    'X-Company-Subdomain': '${e.subdomain}'
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
print(response.json())`}}getApiHeaders(e){let o=this.subdomainService.getCurrentCompany(),t=new h({"Content-Type":"application/json",Authorization:`Bearer ${e}`});return o&&(t=t.set("X-Company-Subdomain",o.subdomain)),t}static \u0275fac=function(o){return new(o||u)};static \u0275prov=g({token:u,factory:u.\u0275fac,providedIn:"root"})};export{f as a};
