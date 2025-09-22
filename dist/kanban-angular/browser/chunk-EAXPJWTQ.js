import{a as y,e as b}from"./chunk-N44IPWVR.js";import{b as u}from"./chunk-ZBJHR7UR.js";import{F as h,G as C,I as v}from"./chunk-77VQYYTZ.js";import{K as m,X as f,a as l,aa as g,f as c,fa as a,u as p,w as r,z as n}from"./chunk-HM7IHYI7.js";var E=class d{http=a(u);subdomainService=a(h);functions=a(y);companyService=a(v);authService=a(C);resolveCompanyWithSmtp(){return c(this,null,function*(){let t=this.subdomainService.getCurrentCompany();if(t?.smtpConfig&&this.validateSmtpConfig(t))return t;try{let e=this.companyService.getCompanySubdomain();if(e){let o=yield this.companyService.getCompanyBySubdomain(e);if(o?.id&&(this.subdomainService.setCurrentCompany(o),t=o,t?.smtpConfig&&this.validateSmtpConfig(t)))return t}}catch{}try{let e=this.authService.getCurrentUser();if(e?.email){let o=yield this.companyService.getCompanyByUserEmail(e.email);if(o?.id&&(this.subdomainService.setCurrentCompany(o),t=o,t?.smtpConfig&&this.validateSmtpConfig(t)))return t}}catch{}return t||null})}sendEmail(t){return p(this.resolveCompanyWithSmtp()).pipe(f(e=>{if(!e)return console.error("\u274C Contexto da empresa n\xE3o inicializado"),r(()=>new Error("Contexto da empresa n\xE3o inicializado"));let o="https://us-central1-kanban-gobuyer.cloudfunctions.net/sendEmailHttp",s={emailData:{to:t.to,subject:t.subject,html:t.html,text:t.text,cc:t.cc,bcc:t.bcc},companyId:e.id,smtpConfig:{host:e.smtpConfig?.host,port:e.smtpConfig?.port,secure:e.smtpConfig?.secure,user:e.smtpConfig?.user,password:e.smtpConfig?.password,fromName:e.smtpConfig?.fromName,fromEmail:e.smtpConfig?.fromEmail}};return this.http.post(o,s)}),n(e=>({success:e.success||!0,messageId:e.messageId||"sent",message:e.message})),m(e=>{console.error("\u274C Erro detalhado ao enviar email via HTTP Function:",e);let o="Erro desconhecido ao enviar email";return e.status===400?o=e.error?.error||"Dados inv\xE1lidos para envio de email":e.status===404?o="Empresa n\xE3o encontrada":e.status===500?o=e.error?.error||"Erro interno do servidor":e.error?.error?o=e.error.error:e.message&&(o=e.message),r(()=>({success:!1,error:o,details:e}))}))}sendTemplateEmail(t,e,o,s){return this.sendEmail({to:e,subject:s||"Email autom\xE1tico",templateId:t,templateData:o})}sendNotificationEmail(t,e,o,s=!1){let i={to:t,subject:e,[s?"html":"text"]:o};return this.sendEmail(i)}sendNewLeadNotification(t,e,o){let s=this.subdomainService.getCurrentCompany();if(!s)return r(()=>new Error("Empresa n\xE3o encontrada"));let i=`Novo Registro: ${t.fields.contactName||t.fields.companyName||"Registro sem nome"}`,S=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${s.primaryColor||"#007bff"}; color: white; padding: 20px; text-align: center;">
          <h1>${s.name}</h1>
          <h2>Novo Registro Recebido</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <h3>Detalhes do Registro:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Quadro:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${e}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Fase:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${o}</td>
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
            <a href="${this.subdomainService.getCompanyUrl(s.subdomain)}" 
               style="background-color: ${s.primaryColor||"#007bff"}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Ver no Sistema
            </a>
          </p>
        </div>
      </div>
    `;return this.sendEmail({to:s.ownerEmail,subject:i,html:S})}testSmtpConfiguration(){let t=this.subdomainService.getCurrentCompany();if(!t)return r(()=>new Error("Empresa n\xE3o encontrada"));if(!this.validateSmtpConfig(t)){let s=this.getSmtpValidationErrors(t);return r(()=>new Error(`Configura\xE7\xE3o SMTP incompleta. Campos faltantes: ${s.join(", ")}`))}let e=b(this.functions,"testSmtpConfig"),o={smtpConfig:{host:t.smtpConfig.host,port:t.smtpConfig.port,secure:t.smtpConfig.secure,user:t.smtpConfig.user,password:t.smtpConfig.password,fromName:t.smtpConfig.fromName,fromEmail:t.smtpConfig.fromEmail},testEmail:t.ownerEmail};return p(e(o)).pipe(n(s=>({success:s.data.success||!0,messageId:s.data.messageId||"test-sent",message:s.data.message||"Teste realizado com sucesso"})),m(s=>{console.error("\u274C Erro ao testar configura\xE7\xE3o SMTP:",s);let i="Erro ao testar configura\xE7\xE3o SMTP";return s.message&&(i=s.message),r(()=>({success:!1,error:i,details:s}))}))}validateSmtpConfig(t){let e=t.smtpConfig;return!!(e&&e.host&&e.port&&e.user&&e.password&&e.fromName&&e.fromEmail)}getSmtpValidationErrors(t){let e=t.smtpConfig,o=[];return e?(e.host||o.push("Servidor SMTP (host)"),e.port||o.push("Porta SMTP"),e.user||o.push("Usu\xE1rio SMTP"),e.password||o.push("Senha SMTP"),e.fromName||o.push("Nome do remetente"),e.fromEmail||o.push("Email do remetente"),o):(o.push("Configura\xE7\xE3o SMTP n\xE3o encontrada"),o)}getCurrentEmailConfig(){let t=this.subdomainService.getCurrentCompany();return t?{fromName:t.smtpConfig.fromName,fromEmail:t.smtpConfig.fromEmail,isConfigured:this.validateSmtpConfig(t),host:t.smtpConfig.host,port:t.smtpConfig.port,secure:t.smtpConfig.secure}:null}updateSmtpConfig(t){let e=this.subdomainService.getCurrentCompany();if(!e)return r(()=>new Error("Empresa n\xE3o encontrada"));let o=`${this.subdomainService.getApiUrl()}/smtp-config`;return this.http.put(o,t).pipe(n(s=>(e&&(e.smtpConfig=l({},t),this.subdomainService.setCurrentCompany(e)),s)),m(s=>(console.error("Erro ao atualizar configura\xE7\xE3o SMTP:",s),r(()=>s))))}static \u0275fac=function(e){return new(e||d)};static \u0275prov=g({token:d,factory:d.\u0275fac,providedIn:"root"})};export{E as a};
