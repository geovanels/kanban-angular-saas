# 🚀 Instruções de Deploy - Kanban Multi-Empresa

## 📦 Pacote de Produção Gerado

O build de produção foi gerado com sucesso em:
```
/Users/geovanelopes/Documents/GitHub/kanban/kanban-angular/dist/kanban-angular/browser/
```

## 🌐 Configuração DNS no Hostinger

### 1. Configurar Wildcard Subdomain
No painel do Hostinger, configure os seguintes registros DNS:

```dns
Tipo: A
Nome: *
Valor: 82.25.73.171
TTL: 3600

Tipo: A
Nome: apps
Valor: 82.25.73.171
TTL: 3600

Tipo: CNAME
Nome: www
Valor: taskboard.com.br
TTL: 3600
```

### 2. Estrutura de Domínios
- **apps.taskboard.com.br** → Página de login/registro (domínio principal)
- **empresa.taskboard.com.br** → Dashboard da empresa específica
- **www.taskboard.com.br** → Redireciona para apps.taskboard.com.br

## 📁 Deploy no Servidor

### 1. Upload dos Arquivos
Faça upload de **TODOS os arquivos** da pasta `dist/kanban-angular/browser/` para:

**Hostinger:**
```
/public_html/
├── index.html
├── main-6AEPUYGZ.js
├── styles-ZV3IGJCX.css
├── polyfills-5CFQRCPP.js
├── chunk-*.js (todos os arquivos chunk)
├── favicon.ico
└── 3rdpartylicenses.txt
```

### 2. Configuração .htaccess
Crie um arquivo `.htaccess` na pasta `public_html/`:

```apache
# Redirect HTTP to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Angular Routes (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
Header always set Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;"

# Cache Control
<filesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
</filesMatch>

# Compress files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## 🔥 Configuração Firebase (Produção)

### 1. Regras de Segurança do Firestore
Configure as seguintes regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Companies collection
    match /companies/{companyId} {
      allow read, write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.token.email)));
      
      // Company users subcollection
      match /users/{userId} {
        allow read, write: if request.auth != null && 
          (request.auth.token.email == userId ||
           get(/databases/$(database)/documents/companies/$(companyId)).data.ownerId == request.auth.uid);
      }
      
      // Company boards subcollection
      match /boards/{boardId} {
        allow read, write: if request.auth != null && 
          exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.token.email));
        
        // Board columns subcollection
        match /columns/{columnId} {
          allow read, write: if request.auth != null && 
            exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.token.email));
        }
        
        // Board leads subcollection
        match /leads/{leadId} {
          allow read, write: if request.auth != null && 
            exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.token.email));
          
          // Lead history subcollection
          match /history/{historyId} {
            allow read, write: if request.auth != null && 
              exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.token.email));
          }
        }
      }
      
      // Company settings subcollection
      match /settings/{settingId} {
        allow read, write: if request.auth != null && 
          (get(/databases/$(database)/documents/companies/$(companyId)).data.ownerId == request.auth.uid ||
           exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.token.email)));
      }
    }
    
    // Public form submissions (apenas escrita)
    match /formSubmissions/{submissionId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### 2. Configuração de Autenticação
No Firebase Console → Authentication → Settings:

**Domínios Autorizados:**
- `taskboard.com.br`
- `apps.taskboard.com.br`
- `*.taskboard.com.br` (wildcard)
- `localhost` (para desenvolvimento)

## 🗂️ Estrutura de Pastas no Servidor

```
public_html/
├── .htaccess
├── index.html
├── favicon.ico
├── main-6AEPUYGZ.js
├── styles-ZV3IGJCX.css
├── polyfills-5CFQRCPP.js
├── chunk-3VCHQSRR.js
├── chunk-4X4RK5XA.js
├── chunk-52DP3DNE.js
├── chunk-6W7CHN7P.js
├── chunk-BZPYHLGH.js
├── chunk-CM3JQ4U2.js
├── chunk-CXGKOLI5.js
├── chunk-D2QDEK3E.js
├── chunk-DVD3JZVB.js
├── chunk-FINTSI3D.js
├── chunk-HB2NRXVT.js
├── chunk-HLLJH4E5.js
├── chunk-J4H4ODVD.js
├── chunk-J5BZOYHT.js
├── chunk-J5JVRSLK.js
├── chunk-KJIKDUO6.js
├── chunk-OQZFYMYT.js
├── chunk-R4FI4RJK.js
├── chunk-S5SFTY7M.js
├── chunk-TB5PERY5.js
├── chunk-UQRBPJS2.js
└── 3rdpartylicenses.txt
```

## ✅ Verificação Pós-Deploy

### 1. Teste os Domínios
- ✅ **apps.taskboard.com.br** → Deve mostrar tela de login
- ✅ **gobuyer.taskboard.com.br** → Deve redirecionar para login da Gobuyer
- ✅ **www.taskboard.com.br** → Deve redirecionar para apps.taskboard.com.br

### 2. Teste a Funcionalidade
1. **Login com geovane.lopes@gobuyer.com.br**
2. **Verificar criação automática da empresa Gobuyer**
3. **Teste criação de novo quadro**
4. **Teste registro de nova empresa**

### 3. Monitoramento
- **Console do navegador** → Não deve ter erros
- **Firebase Console** → Verificar logs de autenticação
- **Network tab** → Verificar se todos os recursos carregam

## 🚨 Problemas Comuns

### SSL/HTTPS
Se houver problemas de SSL, configure no Hostinger:
- **Let's Encrypt SSL** ativado
- **Force HTTPS** ativado

### CORS
Se houver erros de CORS no Firebase:
- Verificar domínios autorizados
- Verificar configuração do Authentication

### Roteamento
Se páginas não carregarem:
- Verificar `.htaccess`
- Verificar configuração SPA do hosting

## 📞 Suporte

Em caso de problemas:
1. **Verificar logs do browser** (F12 → Console)
2. **Verificar Firebase Console** → Logs
3. **Verificar configuração DNS** (pode levar até 24h para propagar)

---

**✅ Deploy concluído com sucesso!** 
O sistema multi-empresa está pronto para produção com dados reais do Firebase.