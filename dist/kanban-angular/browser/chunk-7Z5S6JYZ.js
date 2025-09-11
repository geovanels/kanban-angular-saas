import{a as b,e as h}from"./chunk-NJBRRST5.js";import{b as u}from"./chunk-B5HRYFFL.js";import{F as C,G as y,I as v}from"./chunk-OLUPAUWW.js";import{C as a,M as m,Y as f,a as p,ba as g,ga as n,h as c,x as l,z as i}from"./chunk-6OXV7EHC.js";var E=class d{http=n(u);subdomainService=n(C);functions=n(b);companyService=n(v);authService=n(y);resolveCompanyWithSmtp(){return c(this,null,function*(){let e=this.subdomainService.getCurrentCompany();if(e?.smtpConfig&&this.validateSmtpConfig(e))return e;try{let t=this.companyService.getCompanySubdomain();if(t){let o=yield this.companyService.getCompanyBySubdomain(t);if(o?.id&&(this.subdomainService.setCurrentCompany(o),e=o,e?.smtpConfig&&this.validateSmtpConfig(e)))return e}}catch{}try{let t=this.authService.getCurrentUser();if(t?.email){let o=yield this.companyService.getCompanyByUserEmail(t.email);if(o?.id&&(this.subdomainService.setCurrentCompany(o),e=o,e?.smtpConfig&&this.validateSmtpConfig(e)))return e}}catch{}return e||null})}sendEmail(e){return l(this.resolveCompanyWithSmtp()).pipe(f(t=>{if(!t)return console.error("\u274C Contexto da empresa n\xE3o inicializado"),i(()=>new Error("Contexto da empresa n\xE3o inicializado"));console.log("\u{1F4E7} Preparando envio de email via HTTP Firebase Functions:",{to:e.to,subject:e.subject,fromEmail:t.smtpConfig?.fromEmail,fromName:t.smtpConfig?.fromName});let o="https://us-central1-kanban-gobuyer.cloudfunctions.net/sendEmailHttp",r={emailData:{to:e.to,subject:e.subject,html:e.html,text:e.text,cc:e.cc,bcc:e.bcc},companyId:t.id,smtpConfig:{host:t.smtpConfig?.host,port:t.smtpConfig?.port,secure:t.smtpConfig?.secure,user:t.smtpConfig?.user,password:t.smtpConfig?.password,fromName:t.smtpConfig?.fromName,fromEmail:t.smtpConfig?.fromEmail}};return console.log("\u{1F4E4} Enviando para HTTP Firebase Function:",{url:o,payload:p({},r)}),this.http.post(o,r)}),a(t=>(console.log("\u2705 Email enviado com sucesso via HTTP Function:",t),{success:t.success||!0,messageId:t.messageId||"sent",message:t.message})),m(t=>{console.error("\u274C Erro detalhado ao enviar email via HTTP Function:",t);let o="Erro desconhecido ao enviar email";return t.status===400?o=t.error?.error||"Dados inv\xE1lidos para envio de email":t.status===404?o="Empresa n\xE3o encontrada":t.status===500?o=t.error?.error||"Erro interno do servidor":t.error?.error?o=t.error.error:t.message&&(o=t.message),i(()=>({success:!1,error:o,details:t}))}))}sendTemplateEmail(e,t,o,r){return this.sendEmail({to:t,subject:r||"Email autom\xE1tico",templateId:e,templateData:o})}sendNotificationEmail(e,t,o,r=!1){let s={to:e,subject:t,[r?"html":"text"]:o};return this.sendEmail(s)}sendNewLeadNotification(e,t,o){let r=this.subdomainService.getCurrentCompany();if(!r)return i(()=>new Error("Empresa n\xE3o encontrada"));let s=`Novo Registro: ${e.fields.contactName||e.fields.companyName||"Registro sem nome"}`,S=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${r.primaryColor||"#007bff"}; color: white; padding: 20px; text-align: center;">
          <h1>${r.name}</h1>
          <h2>Novo Registro Recebido</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <h3>Detalhes do Registro:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Quadro:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Fase:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${o}</td>
            </tr>
            ${e.fields.companyName?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Empresa:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${e.fields.companyName}</td>
            </tr>
            `:""}
            ${e.fields.contactName?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Contato:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${e.fields.contactName}</td>
            </tr>
            `:""}
            ${e.fields.contactEmail?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${e.fields.contactEmail}</td>
            </tr>
            `:""}
            ${e.fields.contactPhone?`
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${e.fields.contactPhone}</td>
            </tr>
            `:""}
          </table>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666;">
          <p>
            <a href="${this.subdomainService.getCompanyUrl(r.subdomain)}" 
               style="background-color: ${r.primaryColor||"#007bff"}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Ver no Sistema
            </a>
          </p>
        </div>
      </div>
    `;return this.sendEmail({to:r.ownerEmail,subject:s,html:S})}testSmtpConfiguration(){let e=this.subdomainService.getCurrentCompany();if(!e)return i(()=>new Error("Empresa n\xE3o encontrada"));if(!this.validateSmtpConfig(e)){let r=this.getSmtpValidationErrors(e);return i(()=>new Error(`Configura\xE7\xE3o SMTP incompleta. Campos faltantes: ${r.join(", ")}`))}console.log("\u{1F9EA} Testando configura\xE7\xE3o SMTP via Firebase Functions");let t=h(this.functions,"testSmtpConfig"),o={smtpConfig:{host:e.smtpConfig.host,port:e.smtpConfig.port,secure:e.smtpConfig.secure,user:e.smtpConfig.user,password:e.smtpConfig.password,fromName:e.smtpConfig.fromName,fromEmail:e.smtpConfig.fromEmail},testEmail:e.ownerEmail};return l(t(o)).pipe(a(r=>(console.log("\u2705 Teste SMTP realizado com sucesso:",r.data),{success:r.data.success||!0,messageId:r.data.messageId||"test-sent",message:r.data.message||"Teste realizado com sucesso"})),m(r=>{console.error("\u274C Erro ao testar configura\xE7\xE3o SMTP:",r);let s="Erro ao testar configura\xE7\xE3o SMTP";return r.message&&(s=r.message),i(()=>({success:!1,error:s,details:r}))}))}validateSmtpConfig(e){let t=e.smtpConfig;return!!(t&&t.host&&t.port&&t.user&&t.password&&t.fromName&&t.fromEmail)}getSmtpValidationErrors(e){let t=e.smtpConfig,o=[];return t?(t.host||o.push("Servidor SMTP (host)"),t.port||o.push("Porta SMTP"),t.user||o.push("Usu\xE1rio SMTP"),t.password||o.push("Senha SMTP"),t.fromName||o.push("Nome do remetente"),t.fromEmail||o.push("Email do remetente"),o):(o.push("Configura\xE7\xE3o SMTP n\xE3o encontrada"),o)}getCurrentEmailConfig(){let e=this.subdomainService.getCurrentCompany();return e?{fromName:e.smtpConfig.fromName,fromEmail:e.smtpConfig.fromEmail,isConfigured:this.validateSmtpConfig(e),host:e.smtpConfig.host,port:e.smtpConfig.port,secure:e.smtpConfig.secure}:null}updateSmtpConfig(e){let t=this.subdomainService.getCurrentCompany();if(!t)return i(()=>new Error("Empresa n\xE3o encontrada"));let o=`${this.subdomainService.getApiUrl()}/smtp-config`;return this.http.put(o,e).pipe(a(r=>(t&&(t.smtpConfig=p({},e),this.subdomainService.setCurrentCompany(t)),r)),m(r=>(console.error("Erro ao atualizar configura\xE7\xE3o SMTP:",r),i(()=>r))))}static \u0275fac=function(t){return new(t||d)};static \u0275prov=g({token:d,factory:d.\u0275fac,providedIn:"root"})};export{E as a};
