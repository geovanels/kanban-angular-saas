import{a as b,b as E}from"./chunk-C6QB7HLZ.js";import{F as v}from"./chunk-4NYDEC32.js";import{K as i,a as g,aa as C,b as h,d as $,fa as y,w as r,z as l}from"./chunk-JXP376XN.js";var I=class d{http=y(E);subdomainService=y(v);submitLead(t,e){let n=this.subdomainService.getCurrentCompany();if(!n)return r(()=>new Error("Empresa n\xE3o encontrada"));if(!n.id)return r(()=>new Error("ID da empresa n\xE3o encontrado"));let o=t.boardId,a=n.id,s=this.getLeadIntakeUrl(a,o),p=this.getApiHeaders(n.apiConfig.token);e&&(p=p.set("X-Captcha-Token",e));let f=t,{boardId:m}=f,c=$(f,["boardId"]),k={leadData:c.fields?c:{fields:c}};return this.http.post(s,k,{headers:p}).pipe(l(u=>h(g({},u),{success:!0})),i(u=>(console.error("Erro ao submeter lead:",u),r(()=>({success:!1,error:u.error?.error||u.error?.message||"Erro ao submeter lead"})))))}sendWebhook(t,e){let n=new b({"Content-Type":"application/json","User-Agent":"TaskBoard-Webhooks/1.0"});return this.http.post(t,e,{headers:n}).pipe(i(o=>(console.error("Erro ao enviar webhook:",o),r(()=>o))))}getCompanyInfo(t){let e=`${this.getBaseApiUrl()}/companies/${t}/info`;return this.http.get(e).pipe(i(n=>(console.error("Erro ao obter informa\xE7\xF5es da empresa:",n),r(()=>n))))}getPublicFormConfig(){let t=this.subdomainService.getCurrentCompany();if(!t)return r(()=>new Error("Empresa n\xE3o encontrada"));let e=`${this.getCompanyApiUrl()}/form-config`,n=this.getApiHeaders(t.apiConfig.token);return this.http.get(e,{headers:n}).pipe(i(o=>(console.error("Erro ao obter configura\xE7\xE3o do formul\xE1rio:",o),r(()=>o))))}validateApiToken(t){if(!this.subdomainService.getCurrentCompany())return r(()=>new Error("Empresa n\xE3o encontrada"));let n=`${this.getCompanyApiUrl()}/validate-token`,o=this.getApiHeaders(t);return this.http.post(n,{},{headers:o}).pipe(l(a=>a.valid),i(a=>(console.error("Erro ao validar token:",a),r(()=>!1))))}regenerateApiToken(){let t=this.subdomainService.getCurrentCompany();if(!t)return r(()=>new Error("Empresa n\xE3o encontrada"));let e=`${this.getCompanyApiUrl()}/regenerate-token`,n=this.getApiHeaders(t.apiConfig.token);return this.http.post(e,{},{headers:n}).pipe(l(o=>(t&&(t.apiConfig.token=o.token,this.subdomainService.setCurrentCompany(t)),o)),i(o=>(console.error("Erro ao regenerar token:",o),r(()=>o))))}getApiStats(t="24h"){let e=this.subdomainService.getCurrentCompany();if(!e)return r(()=>new Error("Empresa n\xE3o encontrada"));let n=`${this.getCompanyApiUrl()}/stats?period=${t}`,o=this.getApiHeaders(e.apiConfig.token);return this.http.get(n,{headers:o}).pipe(i(a=>(console.error("Erro ao obter estat\xEDsticas da API:",a),r(()=>a))))}getApiLogs(t=100,e=0){let n=this.subdomainService.getCurrentCompany();if(!n)return r(()=>new Error("Empresa n\xE3o encontrada"));let o=`${this.getCompanyApiUrl()}/logs?limit=${t}&offset=${e}`,a=this.getApiHeaders(n.apiConfig.token);return this.http.get(o,{headers:a}).pipe(i(s=>(console.error("Erro ao obter logs da API:",s),r(()=>s))))}testApiEndpoint(t){let e={boardId:t||void 0,companyName:"Empresa Teste",contactName:"Teste API",contactEmail:"teste@api.com",contactPhone:"(11) 99999-9999",source:"api-test",customFields:{testField:"Valor de teste",timestamp:new Date().toISOString()}};return this.submitLead(e).pipe(l(n=>h(g({},n),{testMode:!0,timestamp:new Date().toISOString()})))}getLeadIntakeUrl(t,e){let n=e?`/companies/${encodeURIComponent(t)}/boards/${encodeURIComponent(e)}`:`/companies/${encodeURIComponent(t)}`;return this.subdomainService.isDevelopment()?`http://localhost:${this.getLocalFunctionsPort()}/kanban-gobuyer/us-central1/leadIntakeHttp${n}`:`https://us-central1-kanban-gobuyer.cloudfunctions.net/leadIntakeHttp${n}`}getCompanyApiUrl(){return`${this.subdomainService.getApiUrl()}/api`}getBaseApiUrl(){return this.subdomainService.isDevelopment()?`http://localhost:${this.getLocalFunctionsPort()}/api/v1`:"https://api.taskboard.com.br/v1"}getLocalFunctionsPort(){let t=localStorage.getItem("firebase-functions-port");if(t)return parseInt(t,10);try{let e=window.__FIREBASE_DEFAULTS__;if(e?.emulatorHosts?.functions){let o=e.emulatorHosts.functions.match(/:(\d+)$/);if(o)return parseInt(o[1],10)}}catch{}return 5001}setCustomFunctionsPort(t){localStorage.setItem("firebase-functions-port",t.toString())}getIntegrationExamples(t,e){let n=this.subdomainService.getCurrentCompany();if(!n)return{};let o=this.getLeadIntakeUrl(n.id||"{COMPANY_ID}",t),a=n.apiConfig.token,s=this.generateDynamicFieldsExample(e),p=e&&e.length>0?`    // Campos configurados no formul\xE1rio:
`+e.filter(c=>c.includeInApi!==!1).map(c=>`    // "${c.name}": "${c.type}"`).join(`,
`)+`
`:`    // Configure campos personalizados no Visual Form Builder
`,m=t?`// URL inclui o ID do quadro: ${t}
`:`// Substitua {BOARD_ID} pelo ID do quadro desejado na URL
`;return{curl:`${m}${p}curl -X POST "${o}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${a}" \\
  -H "X-Company-Subdomain: ${n.subdomain}" \\
  -d '{
    "companyName": "Nome da Empresa Exemplo",
    "cnpj": "00.000.000/0001-00",
    "contactName": "Nome do Contato",
    "contactEmail": "email@exemplo.com",
    "contactPhone": "(11) 99999-9999"${s?`,
`+s:""}
  }'`,javascript:`${m}${p}fetch('${o}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${a}',
    'X-Company-Subdomain': '${n.subdomain}'
  },
  body: JSON.stringify({
    companyName: 'Nome da Empresa Exemplo',
    cnpj: '00.000.000/0001-00',
    contactName: 'Nome do Contato',
    contactEmail: 'email@exemplo.com',
    contactPhone: '(11) 99999-9999'${s?`,
    `+s.replace(/    /g,"    "):""}
  })
})
.then(response => response.json())
.then(data => console.log(data));`,php:`<?php
${m.replace(/\/\//g,"//")}// ${p.replace(/\/\//g,"//")}
$url = '${o}';
$data = [
    'companyName' => 'Nome da Empresa Exemplo',
    'cnpj' => '00.000.000/0001-00',
    'contactName' => 'Nome do Contato',
    'contactEmail' => 'email@exemplo.com',
    'contactPhone' => '(11) 99999-9999'${this.generateDynamicFieldsPhp(e)}
];

$options = [
    'http' => [
        'header' => [
            'Content-type: application/json',
            'Authorization: Bearer ${a}',
            'X-Company-Subdomain: ${n.subdomain}'
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

${m.replace(/\/\//g,"#")}# ${p.replace(/\/\//g,"#")}
url = '${o}'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${a}',
    'X-Company-Subdomain': '${n.subdomain}'
}
data = {
    'companyName': 'Nome da Empresa Exemplo',
    'cnpj': '00.000.000/0001-00',
    'contactName': 'Nome do Contato',
    'contactEmail': 'email@exemplo.com',
    'contactPhone': '(11) 99999-9999'${this.generateDynamicFieldsPython(e)}
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}}generateDynamicFieldsExample(t){return!t||t.length===0?"":t.filter(e=>e.includeInApi!==!1).map(e=>{let n=e.apiFieldName||e.name,o=this.getExampleValue(e.type);return`    "${n}": "${o}"`}).join(`,
`)}generateDynamicFieldsPhp(t){return!t||t.length===0?"":`,
`+t.filter(e=>e.includeInApi!==!1).map(e=>{let n=e.apiFieldName||e.name,o=this.getExampleValue(e.type);return`    '${n}' => '${o}'`}).join(`,
`)}generateDynamicFieldsPython(t){return!t||t.length===0?"":`,
`+t.filter(e=>e.includeInApi!==!1).map(e=>{let n=e.apiFieldName||e.name,o=this.getExampleValue(e.type);return`    '${n}': '${o}'`}).join(`,
`)}getExampleValue(t){switch(t){case"email":return"exemplo@email.com";case"tel":return"(11) 99999-9999";case"number":return"123";case"cnpj":return"00.000.000/0001-00";case"cpf":return"000.000.000-00";case"date":return"2024-01-01";case"time":return"14:30";case"temperatura":return"Quente";case"textarea":return"Texto de exemplo";case"select":case"radio":return"Op\xE7\xE3o 1";case"checkbox":return"true";default:return"Valor exemplo"}}getApiHeaders(t){let e=this.subdomainService.getCurrentCompany(),n=new b({"Content-Type":"application/json",Authorization:`Bearer ${t}`});return e&&(n=n.set("X-Company-Subdomain",e.subdomain)),n}static \u0275fac=function(e){return new(e||d)};static \u0275prov=C({token:d,factory:d.\u0275fac,providedIn:"root"})};export{I as a};
