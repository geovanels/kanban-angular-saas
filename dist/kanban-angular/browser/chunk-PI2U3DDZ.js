import{a as C,e as g}from"./chunk-WXHR6PAO.js";import{a as b,c as h}from"./chunk-HPS6D6FL.js";import{J as m,_ as u,a,b as l,da as p,u as f,w as i,z as d}from"./chunk-WVXLNUB3.js";var y=class c{http=p(b);subdomainService=p(h);functions=p(C);sendEmail(t){let o=this.subdomainService.getCurrentCompany();if(!o)return console.error("\u274C Contexto da empresa n\xE3o inicializado"),i(()=>new Error("Contexto da empresa n\xE3o inicializado"));if(!this.validateSmtpConfig(o))return console.error("\u274C Configura\xE7\xE3o SMTP da empresa est\xE1 incompleta:",o.smtpConfig),i(()=>new Error("Configura\xE7\xE3o SMTP da empresa est\xE1 incompleta"));console.log("\u{1F4E7} Preparando envio de email via Firebase Functions:",{to:t.to,subject:t.subject,fromEmail:o.smtpConfig.fromEmail,fromName:o.smtpConfig.fromName});let r=g(this.functions,"sendEmail"),e={emailData:{to:t.to,subject:t.subject,html:t.html,text:t.text,cc:t.cc,bcc:t.bcc},smtpConfig:{host:o.smtpConfig.host,port:o.smtpConfig.port,secure:o.smtpConfig.secure,user:o.smtpConfig.user,password:o.smtpConfig.password,fromName:o.smtpConfig.fromName,fromEmail:o.smtpConfig.fromEmail}};return console.log("\u{1F4E4} Enviando para Firebase Functions:",l(a({},e),{smtpConfig:l(a({},e.smtpConfig),{password:e.smtpConfig.password.substring(0,10)+"..."})})),f(r(e)).pipe(d(s=>(console.log("\u2705 Email enviado com sucesso via Firebase Functions:",s.data),{success:s.data.success||!0,messageId:s.data.messageId||"sent"})),m(s=>{console.error("\u274C Erro detalhado ao enviar email via Firebase Functions:",s);let n="Erro desconhecido ao enviar email";return s.code==="unauthenticated"?n="Usu\xE1rio n\xE3o autenticado. Fa\xE7a login novamente.":s.code==="permission-denied"?n="Acesso negado. Verifique as permiss\xF5es.":s.message&&(n=s.message),i(()=>({success:!1,error:n,details:s}))}))}sendTemplateEmail(t,o,r,e){return this.sendEmail({to:o,subject:e||"Email autom\xE1tico",templateId:t,templateData:r})}sendNotificationEmail(t,o,r,e=!1){let s={to:t,subject:o,[e?"html":"text"]:r};return this.sendEmail(s)}sendNewLeadNotification(t,o,r){let e=this.subdomainService.getCurrentCompany();if(!e)return i(()=>new Error("Empresa n\xE3o encontrada"));let s=`Novo Registro: ${t.fields.contactName||t.fields.companyName||"Registro sem nome"}`,n=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${e.primaryColor||"#007bff"}; color: white; padding: 20px; text-align: center;">
          <h1>${e.name}</h1>
          <h2>Novo Registro Recebido</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <h3>Detalhes do Registro:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Quadro:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${o}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Fase:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${r}</td>
            </tr>
            ${t.fields.companyName?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Empresa:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.fields.companyName}</td>
            </tr>
            `:""}
            ${t.fields.contactName?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Contato:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.fields.contactName}</td>
            </tr>
            `:""}
            ${t.fields.contactEmail?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.fields.contactEmail}</td>
            </tr>
            `:""}
            ${t.fields.contactPhone?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.fields.contactPhone}</td>
            </tr>
            `:""}
          </table>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666;">
          <p>
            <a href="${this.subdomainService.getCompanyUrl(e.subdomain)}" 
               style="background-color: ${e.primaryColor||"#007bff"}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Ver no Sistema
            </a>
          </p>
        </div>
      </div>
    `;return this.sendEmail({to:e.ownerEmail,subject:s,html:n})}testSmtpConfiguration(){let t=this.subdomainService.getCurrentCompany();if(!t)return i(()=>new Error("Empresa n\xE3o encontrada"));if(!this.validateSmtpConfig(t))return i(()=>new Error("Configura\xE7\xE3o SMTP da empresa est\xE1 incompleta"));console.log("\u{1F9EA} Testando configura\xE7\xE3o SMTP via Firebase Functions");let o=g(this.functions,"testSmtpConfig"),r={smtpConfig:{host:t.smtpConfig.host,port:t.smtpConfig.port,secure:t.smtpConfig.secure,user:t.smtpConfig.user,password:t.smtpConfig.password,fromName:t.smtpConfig.fromName,fromEmail:t.smtpConfig.fromEmail},testEmail:t.ownerEmail};return f(o(r)).pipe(d(e=>(console.log("\u2705 Teste SMTP realizado com sucesso:",e.data),{success:e.data.success||!0,messageId:e.data.messageId||"test-sent",message:e.data.message||"Teste realizado com sucesso"})),m(e=>{console.error("\u274C Erro ao testar configura\xE7\xE3o SMTP:",e);let s="Erro ao testar configura\xE7\xE3o SMTP";return e.message&&(s=e.message),i(()=>({success:!1,error:s,details:e}))}))}validateSmtpConfig(t){let o=t.smtpConfig;return!!(o&&o.host&&o.port&&o.user&&o.password&&o.fromName&&o.fromEmail)}getCurrentEmailConfig(){let t=this.subdomainService.getCurrentCompany();return t?{fromName:t.smtpConfig.fromName,fromEmail:t.smtpConfig.fromEmail,isConfigured:this.validateSmtpConfig(t),host:t.smtpConfig.host,port:t.smtpConfig.port,secure:t.smtpConfig.secure}:null}updateSmtpConfig(t){let o=this.subdomainService.getCurrentCompany();if(!o)return i(()=>new Error("Empresa n\xE3o encontrada"));let r=`${this.subdomainService.getApiUrl()}/smtp-config`;return this.http.put(r,t).pipe(d(e=>(o&&(o.smtpConfig=a({},t),this.subdomainService.setCurrentCompany(o)),e)),m(e=>(console.error("Erro ao atualizar configura\xE7\xE3o SMTP:",e),i(()=>e))))}static \u0275fac=function(o){return new(o||c)};static \u0275prov=u({token:c,factory:c.\u0275fac,providedIn:"root"})};export{y as a};
