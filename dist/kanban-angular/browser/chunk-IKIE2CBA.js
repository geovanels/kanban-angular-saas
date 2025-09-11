import{b as y}from"./chunk-B5HRYFFL.js";import{F as C,I as h}from"./chunk-OLUPAUWW.js";import{C as g,M as u,a as c,ba as b,ga as l,h as d,p as m,z as s}from"./chunk-6OXV7EHC.js";var v=class p{http=l(y);subdomainService=l(C);companyService=l(h);brandingSubject=new m({});branding$=this.brandingSubject.asObservable();constructor(){this.initializeBranding();try{this.subdomainService.currentCompany$.subscribe(r=>{r&&this.applyCompanyBranding(r)})}catch{}setTimeout(()=>{this.applyStoredBranding()},100)}initializeBranding(){let r=this.subdomainService.getCurrentCompany();r&&this.updateBranding({logoUrl:r.logoUrl,primaryColor:r.brandingConfig?.primaryColor||r.primaryColor,secondaryColor:r.brandingConfig?.secondaryColor||r.secondaryColor})}applyStoredBranding(){let r=this.subdomainService.getCurrentCompany();r&&r.brandingConfig&&r.brandingConfig.primaryColor&&this.applyColors({primaryColor:r.brandingConfig.primaryColor,secondaryColor:r.brandingConfig.secondaryColor})}uploadLogo(r){let o=this.subdomainService.getCurrentCompany();if(!o)return s(()=>new Error("Empresa n\xE3o encontrada"));let e=this.validateImageFile(r);if(e)return s(()=>new Error(e));let n=new FormData;n.append("logo",r),n.append("companyId",o.id);let a=`${this.subdomainService.getApiUrl()}/upload/logo`;return this.http.post(a,n).pipe(g(t=>(t.success&&t.logoUrl&&this.updateCompanyLogo(t.logoUrl),t)),u(t=>(console.error("Erro ao fazer upload do logo:",t),s(()=>({success:!1,error:t.error?.message||"Erro ao fazer upload do logo"})))))}uploadFavicon(r){let o=this.subdomainService.getCurrentCompany();if(!o)return s(()=>new Error("Empresa n\xE3o encontrada"));let e=this.validateFaviconFile(r);if(e)return s(()=>new Error(e));let n=new FormData;n.append("favicon",r),n.append("companyId",o.id);let a=`${this.subdomainService.getApiUrl()}/upload/favicon`;return this.http.post(a,n).pipe(g(t=>(t.success&&t.logoUrl&&this.applyFavicon(t.logoUrl),t)),u(t=>(console.error("Erro ao fazer upload do favicon:",t),s(()=>t))))}updateColors(r){return d(this,null,function*(){let o=this.subdomainService.getCurrentCompany();if(!o)throw new Error("Empresa n\xE3o encontrada");try{yield this.companyService.updateCompany(o.id,r),Object.assign(o,r),this.subdomainService.setCurrentCompany(o),this.applyColors(r),this.updateBranding(r)}catch(e){throw console.error("Erro ao atualizar cores:",e),e}})}applyCustomCss(r){if(this.removeCustomCss(),r.trim()){let o=document.createElement("style");o.id="company-custom-css",o.textContent=r,document.head.appendChild(o)}}removeCustomCss(){let r=document.getElementById("company-custom-css");r&&r.remove()}applyCompanyBranding(r){console.log("\u{1F3A8} Aplicando branding para empresa:",r.name),console.log("\u{1F3A8} Cores da empresa:",{primaryColor:r.primaryColor,secondaryColor:r.secondaryColor,brandingConfig:r.brandingConfig});let o=r.brandingConfig?.primaryColor||r.primaryColor,e=r.brandingConfig?.secondaryColor||r.secondaryColor,n={logoUrl:r.logoUrl,primaryColor:o,secondaryColor:e};this.updateBranding(n),o||e?(console.log("\u{1F3A8} Aplicando cores:",{primaryColor:o,secondaryColor:e}),this.applyColors({primaryColor:o,secondaryColor:e})):console.log("\u26A0\uFE0F Nenhuma cor encontrada para aplicar"),this.updatePageTitle(r.name)}generateColorPalette(r){let o=r.replace("#",""),e=parseInt(o.substr(0,2),16),n=parseInt(o.substr(2,2),16),a=parseInt(o.substr(4,2),16);return{primary:r,primaryLight:this.lightenColor(r,20),primaryDark:this.darkenColor(r,20),secondary:this.adjustHue(r,30),accent:this.adjustHue(r,-30),success:"#28a745",warning:"#ffc107",danger:"#dc3545",info:"#17a2b8"}}validateImageFile(r){return r.size>5242880?"Arquivo muito grande. Tamanho m\xE1ximo: 5MB":["image/jpeg","image/jpg","image/png","image/svg+xml"].includes(r.type)?null:"Tipo de arquivo n\xE3o suportado. Use JPEG, PNG ou SVG"}validateFaviconFile(r){return r.size>1048576?"Arquivo muito grande. Tamanho m\xE1ximo: 1MB":["image/x-icon","image/vnd.microsoft.icon","image/png"].includes(r.type)?null:"Tipo de arquivo n\xE3o suportado. Use ICO ou PNG"}updateCompanyLogo(r){return d(this,null,function*(){let o=this.subdomainService.getCurrentCompany();o&&(o.logoUrl=r,this.subdomainService.setCurrentCompany(o),yield this.companyService.updateCompany(o.id,{logoUrl:r}),this.updateBranding({logoUrl:r}))})}applyColors(r){let o=document.documentElement;if(r.primaryColor){let e=this.generateColorPalette(r.primaryColor);Object.entries(e).forEach(([n,a])=>{o.style.setProperty(`--color-${n}`,a)}),o.style.setProperty("--bs-primary",r.primaryColor),o.style.setProperty("--primary-color",r.primaryColor),o.style.setProperty("--tw-ring-color",r.primaryColor+"66")}r.secondaryColor&&(o.style.setProperty("--color-secondary",r.secondaryColor),o.style.setProperty("--bs-secondary",r.secondaryColor),o.style.setProperty("--secondary-color",r.secondaryColor)),r.accentColor&&o.style.setProperty("--color-accent",r.accentColor),this.applyDynamicStyles(r)}applyDynamicStyles(r){if(console.log("\u{1F3A8} Aplicando estilos din\xE2micos:",r),!r.primaryColor){console.log("\u26A0\uFE0F Nenhuma cor prim\xE1ria fornecida");return}let o=document.getElementById("dynamic-branding-styles");o&&(o.remove(),console.log("\u{1F5D1}\uFE0F Removeu estilos din\xE2micos anteriores"));let e=document.createElement("style");e.id="dynamic-branding-styles",e.textContent=`
      /* Primary buttons - Override all blue/green variations with very specific selectors */
      .bg-blue-500, .bg-green-500,
      button.bg-blue-500, button.bg-green-500,
      .bg-blue-500.hover\\:bg-blue-600, .bg-green-500.hover\\:bg-green-600,
      [class*="bg-blue-500"], [class*="bg-green-500"],
      button[class*="bg-blue-500"], button[class*="bg-green-500"],
      .text-white.px-4.py-2.rounded-lg,
      .text-white.px-6.py-2.rounded-lg,
      .text-white.px-4.py-2.rounded-md {
        background-color: ${r.primaryColor} !important;
      }
      
      .hover\\:bg-blue-600:hover, .hover\\:bg-green-600:hover,
      button.bg-blue-500:hover, button.bg-green-500:hover,
      button.hover\\:bg-blue-600:hover, button.hover\\:bg-green-600:hover,
      [class*="hover:bg-blue-600"]:hover, [class*="hover:bg-green-600"]:hover,
      button[class*="bg-blue-500"]:hover, button[class*="bg-green-500"]:hover,
      .text-white.px-4.py-2.rounded-lg:hover,
      .text-white.px-6.py-2.rounded-lg:hover,
      .text-white.px-4.py-2.rounded-md:hover {
        background-color: ${this.darkenColor(r.primaryColor,10)} !important;
      }
      
      /* Very specific selectors for common button patterns */
      .px-4.py-2.bg-blue-500,
      .px-6.py-2.bg-blue-500,
      .px-6.py-3.bg-blue-500,
      .px-4.py-2.bg-green-500,
      button.px-4.py-2.bg-blue-500,
      button.px-6.py-2.bg-blue-500,
      button.px-6.py-3.bg-blue-500 {
        background-color: ${r.primaryColor} !important;
      }
      
      .px-4.py-2.bg-blue-500:hover,
      .px-6.py-2.bg-blue-500:hover,
      .px-6.py-3.bg-blue-500:hover,
      button.px-4.py-2.bg-blue-500:hover,
      button.px-6.py-2.bg-blue-500:hover,
      button.px-6.py-3.bg-blue-500:hover {
        background-color: ${this.darkenColor(r.primaryColor,10)} !important;
      }
      
      /* All buttons with white text and blue/green backgrounds */
      button[style*="background-color"],
      .bg-blue-500,
      .bg-green-500 {
        background-color: ${r.primaryColor} !important;
      }
      
      /* Focus states */
      .focus\\:ring-blue-500:focus {
        --tw-ring-color: ${r.primaryColor}66 !important;
      }
      
      .focus\\:border-blue-500:focus {
        border-color: ${r.primaryColor} !important;
      }
      
      /* Text colors */
      .text-blue-500 {
        color: ${r.primaryColor} !important;
      }
      
      .hover\\:text-blue-600:hover, .hover\\:text-blue-800:hover {
        color: ${this.darkenColor(r.primaryColor,15)} !important;
      }
      
      .text-blue-600 {
        color: ${this.darkenColor(r.primaryColor,5)} !important;
      }
      
      .text-blue-800 {
        color: ${this.darkenColor(r.primaryColor,20)} !important;
      }
      
      /* Borders */
      .border-blue-500 {
        border-color: ${r.primaryColor} !important;
      }
      
      .border-blue-200 {
        border-color: ${r.primaryColor}33 !important;
      }
      
      /* Backgrounds with opacity */
      .bg-blue-100 {
        background-color: ${r.primaryColor}1A !important;
      }
      
      .bg-blue-50 {
        background-color: ${r.primaryColor}0D !important;
      }
      
      /* Toggle switches */
      .peer-checked\\:bg-blue-600 {
        background-color: ${r.primaryColor} !important;
      }
      
      /* Company header logo background */
      .config-header-logo-bg, .h-8.w-8.bg-blue-500,
      .h-10.w-10.bg-blue-500 {
        background-color: ${r.primaryColor} !important;
      }
      
      /* User avatar backgrounds */
      .h-10.w-10.rounded-full.bg-blue-500 {
        background-color: ${r.primaryColor} !important;
      }
      
      /* Specific button classes */
      .btn-primary {
        background-color: ${r.primaryColor} !important;
        border-color: ${r.primaryColor} !important;
      }
      
      .btn-primary:hover {
        background-color: ${this.darkenColor(r.primaryColor,10)} !important;
        border-color: ${this.darkenColor(r.primaryColor,10)} !important;
      }
      
      /* Canvas style override - for buttons with inline styles */
      button[style*="background-color: rgb(59, 130, 246)"],
      button[style*="background-color: rgb(34, 197, 94)"],
      [style*="background-color: #3B82F6"],
      [style*="background-color: #22C55E"] {
        background-color: ${r.primaryColor} !important;
      }
    `,r.secondaryColor&&(e.textContent+=`
        /* Secondary color applications */
        .text-gray-500 {
          color: ${r.secondaryColor} !important;
        }
        
        .bg-gray-500 {
          background-color: ${r.secondaryColor} !important;
        }
        
        .hover\\:bg-gray-600:hover {
          background-color: ${this.darkenColor(r.secondaryColor,10)} !important;
        }
        
        .text-gray-600 {
          color: ${this.darkenColor(r.secondaryColor,5)} !important;
        }
        
        .text-gray-700 {
          color: ${this.darkenColor(r.secondaryColor,10)} !important;
        }
      `),document.head.appendChild(e),console.log("\u2705 Estilos din\xE2micos aplicados com sucesso!"),console.log("\u{1F3A8} Cor prim\xE1ria aplicada:",r.primaryColor)}applyFavicon(r){let o=document.querySelector('link[rel*="icon"]');o&&o.remove();let e=document.createElement("link");e.rel="icon",e.href=r,document.head.appendChild(e)}updatePageTitle(r){document.title=`${r} - Sistema Kanban`}updateBranding(r){let o=this.brandingSubject.value,e=c(c({},o),r);this.brandingSubject.next(e)}lightenColor(r,o){let e=parseInt(r.replace("#",""),16),n=Math.round(2.55*o),a=(e>>16)+n,t=(e>>8&255)+n,i=(e&255)+n;return"#"+(16777216+(a<255?a<1?0:a:255)*65536+(t<255?t<1?0:t:255)*256+(i<255?i<1?0:i:255)).toString(16).slice(1)}darkenColor(r,o){let e=parseInt(r.replace("#",""),16),n=Math.round(2.55*o),a=(e>>16)-n,t=(e>>8&255)-n,i=(e&255)-n;return"#"+(16777216+(a>255?255:a<0?0:a)*65536+(t>255?255:t<0?0:t)*256+(i>255?255:i<0?0:i)).toString(16).slice(1)}adjustHue(r,o){return r}getCurrentBranding(){return this.brandingSubject.value}resetToDefault(){this.removeCustomCss();let r=document.documentElement;r.style.removeProperty("--color-primary"),r.style.removeProperty("--color-secondary"),r.style.removeProperty("--bs-primary"),r.style.removeProperty("--bs-secondary"),this.updateBranding({logoUrl:void 0,primaryColor:void 0,secondaryColor:void 0,customCss:void 0})}static \u0275fac=function(o){return new(o||p)};static \u0275prov=b({token:p,factory:p.\u0275fac,providedIn:"root"})};export{v as a};
