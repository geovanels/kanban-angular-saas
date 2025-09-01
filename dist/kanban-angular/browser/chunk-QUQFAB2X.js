import{M as v,b}from"./chunk-XFXMLSII.js";import{R as C}from"./chunk-4U6ZKXZY.js";import{J as g,_ as y,a as c,da as l,f as d,m as u,w as s,z as m}from"./chunk-O3JLSHCU.js";var h=class p{http=l(b);subdomainService=l(v);companyService=l(C);brandingSubject=new u({});branding$=this.brandingSubject.asObservable();constructor(){this.initializeBranding(),setTimeout(()=>{this.applyStoredBranding()},100)}initializeBranding(){let r=this.subdomainService.getCurrentCompany();r&&this.updateBranding({logoUrl:r.logoUrl,primaryColor:r.brandingConfig?.primaryColor||r.primaryColor,secondaryColor:r.brandingConfig?.secondaryColor||r.secondaryColor})}applyStoredBranding(){let r=this.subdomainService.getCurrentCompany();r&&r.brandingConfig&&r.brandingConfig.primaryColor&&this.applyColors({primaryColor:r.brandingConfig.primaryColor,secondaryColor:r.brandingConfig.secondaryColor})}uploadLogo(r){let o=this.subdomainService.getCurrentCompany();if(!o)return s(()=>new Error("Empresa n\xE3o encontrada"));let e=this.validateImageFile(r);if(e)return s(()=>new Error(e));let n=new FormData;n.append("logo",r),n.append("companyId",o.id);let a=`${this.subdomainService.getApiUrl()}/upload/logo`;return this.http.post(a,n).pipe(m(t=>(t.success&&t.logoUrl&&this.updateCompanyLogo(t.logoUrl),t)),g(t=>(console.error("Erro ao fazer upload do logo:",t),s(()=>({success:!1,error:t.error?.message||"Erro ao fazer upload do logo"})))))}uploadFavicon(r){let o=this.subdomainService.getCurrentCompany();if(!o)return s(()=>new Error("Empresa n\xE3o encontrada"));let e=this.validateFaviconFile(r);if(e)return s(()=>new Error(e));let n=new FormData;n.append("favicon",r),n.append("companyId",o.id);let a=`${this.subdomainService.getApiUrl()}/upload/favicon`;return this.http.post(a,n).pipe(m(t=>(t.success&&t.logoUrl&&this.applyFavicon(t.logoUrl),t)),g(t=>(console.error("Erro ao fazer upload do favicon:",t),s(()=>t))))}updateColors(r){return d(this,null,function*(){let o=this.subdomainService.getCurrentCompany();if(!o)throw new Error("Empresa n\xE3o encontrada");try{yield this.companyService.updateCompany(o.id,r),Object.assign(o,r),this.subdomainService.setCurrentCompany(o),this.applyColors(r),this.updateBranding(r)}catch(e){throw console.error("Erro ao atualizar cores:",e),e}})}applyCustomCss(r){if(this.removeCustomCss(),r.trim()){let o=document.createElement("style");o.id="company-custom-css",o.textContent=r,document.head.appendChild(o)}}removeCustomCss(){let r=document.getElementById("company-custom-css");r&&r.remove()}applyCompanyBranding(r){let o={logoUrl:r.logoUrl,primaryColor:r.primaryColor,secondaryColor:r.secondaryColor};this.updateBranding(o),(r.primaryColor||r.secondaryColor)&&this.applyColors({primaryColor:r.primaryColor,secondaryColor:r.secondaryColor}),this.updatePageTitle(r.name)}generateColorPalette(r){let o=r.replace("#",""),e=parseInt(o.substr(0,2),16),n=parseInt(o.substr(2,2),16),a=parseInt(o.substr(4,2),16);return{primary:r,primaryLight:this.lightenColor(r,20),primaryDark:this.darkenColor(r,20),secondary:this.adjustHue(r,30),accent:this.adjustHue(r,-30),success:"#28a745",warning:"#ffc107",danger:"#dc3545",info:"#17a2b8"}}validateImageFile(r){return r.size>5242880?"Arquivo muito grande. Tamanho m\xE1ximo: 5MB":["image/jpeg","image/jpg","image/png","image/svg+xml"].includes(r.type)?null:"Tipo de arquivo n\xE3o suportado. Use JPEG, PNG ou SVG"}validateFaviconFile(r){return r.size>1048576?"Arquivo muito grande. Tamanho m\xE1ximo: 1MB":["image/x-icon","image/vnd.microsoft.icon","image/png"].includes(r.type)?null:"Tipo de arquivo n\xE3o suportado. Use ICO ou PNG"}updateCompanyLogo(r){return d(this,null,function*(){let o=this.subdomainService.getCurrentCompany();o&&(o.logoUrl=r,this.subdomainService.setCurrentCompany(o),yield this.companyService.updateCompany(o.id,{logoUrl:r}),this.updateBranding({logoUrl:r}))})}applyColors(r){let o=document.documentElement;if(r.primaryColor){let e=this.generateColorPalette(r.primaryColor);Object.entries(e).forEach(([n,a])=>{o.style.setProperty(`--color-${n}`,a)}),o.style.setProperty("--bs-primary",r.primaryColor),o.style.setProperty("--primary-color",r.primaryColor)}r.secondaryColor&&(o.style.setProperty("--color-secondary",r.secondaryColor),o.style.setProperty("--bs-secondary",r.secondaryColor),o.style.setProperty("--secondary-color",r.secondaryColor)),r.accentColor&&o.style.setProperty("--color-accent",r.accentColor),this.applyDynamicStyles(r)}applyDynamicStyles(r){if(!r.primaryColor)return;let o=document.getElementById("dynamic-branding-styles");o&&o.remove();let e=document.createElement("style");e.id="dynamic-branding-styles",e.textContent=`
      /* Primary buttons - Override all blue variations */
      .bg-blue-500, .bg-green-500,
      button.bg-blue-500, button.bg-green-500,
      .bg-blue-500.hover\\:bg-blue-600, .bg-green-500.hover\\:bg-green-600 {
        background-color: ${r.primaryColor} !important;
      }
      
      .hover\\:bg-blue-600:hover, .hover\\:bg-green-600:hover,
      button.bg-blue-500:hover, button.bg-green-500:hover,
      button.hover\\:bg-blue-600:hover, button.hover\\:bg-green-600:hover {
        background-color: ${this.darkenColor(r.primaryColor,10)} !important;
      }
      
      /* Dashboard specific buttons - more specific selectors */
      .bg-blue-500.hover\\:bg-blue-600.text-white,
      button[class*="bg-blue-500"][class*="hover:bg-blue-600"],
      .bg-blue-500.hover\\:bg-blue-600.text-white.px-4.py-2 {
        background-color: ${r.primaryColor} !important;
      }
      
      button[class*="bg-blue-500"][class*="hover:bg-blue-600"]:hover,
      .bg-blue-500.hover\\:bg-blue-600.text-white.px-4.py-2:hover {
        background-color: ${this.darkenColor(r.primaryColor,10)} !important;
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
      `),document.head.appendChild(e)}applyFavicon(r){let o=document.querySelector('link[rel*="icon"]');o&&o.remove();let e=document.createElement("link");e.rel="icon",e.href=r,document.head.appendChild(e)}updatePageTitle(r){document.title=`${r} - Sistema Kanban`}updateBranding(r){let o=this.brandingSubject.value,e=c(c({},o),r);this.brandingSubject.next(e)}lightenColor(r,o){let e=parseInt(r.replace("#",""),16),n=Math.round(2.55*o),a=(e>>16)+n,t=(e>>8&255)+n,i=(e&255)+n;return"#"+(16777216+(a<255?a<1?0:a:255)*65536+(t<255?t<1?0:t:255)*256+(i<255?i<1?0:i:255)).toString(16).slice(1)}darkenColor(r,o){let e=parseInt(r.replace("#",""),16),n=Math.round(2.55*o),a=(e>>16)-n,t=(e>>8&255)-n,i=(e&255)-n;return"#"+(16777216+(a>255?255:a<0?0:a)*65536+(t>255?255:t<0?0:t)*256+(i>255?255:i<0?0:i)).toString(16).slice(1)}adjustHue(r,o){return r}getCurrentBranding(){return this.brandingSubject.value}resetToDefault(){this.removeCustomCss();let r=document.documentElement;r.style.removeProperty("--color-primary"),r.style.removeProperty("--color-secondary"),r.style.removeProperty("--bs-primary"),r.style.removeProperty("--bs-secondary"),this.updateBranding({logoUrl:void 0,primaryColor:void 0,secondaryColor:void 0,customCss:void 0})}static \u0275fac=function(o){return new(o||p)};static \u0275prov=y({token:p,factory:p.\u0275fac,providedIn:"root"})};export{h as a};
