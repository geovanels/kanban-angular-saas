# Configuração de Subdomínios no Hostinger - TaskBoard

## 🎯 Objetivo
Permitir que qualquer subdomínio (`*.taskboard.com.br`) funcione automaticamente sem criação manual, direcionando todos para o mesmo Angular SPA que detectará a empresa pelo subdomínio.

## 📋 Passo a Passo no Hostinger

### 1. Configuração DNS Wildcard

**No hPanel do Hostinger:**
```
Domínios → Zona DNS → taskboard.com.br
```

**Adicionar registros:**
```
Tipo: A
Nome: *
Valor: [IP do seu servidor Hostinger]
TTL: 14400
```

**OU usar CNAME:**
```
Tipo: CNAME  
Nome: *
Valor: taskboard.com.br
TTL: 14400
```

### 2. Configuração do Domínio Principal

```
Domínios → Gerenciar → taskboard.com.br
└── Apontar para: /public_html
```

### 3. Estrutura de Arquivos

```
/public_html/
├── index.html (Angular build)
├── assets/
├── main.js
├── polyfills.js
├── runtime.js
├── styles.css
└── .htaccess (configuração crucial)
```

### 4. Arquivo .htaccess (CRUCIAL)

Criar `/public_html/.htaccess`:

```apache
RewriteEngine On

# Habilitar CORS para APIs
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET,PUT,POST,DELETE,OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Capturar subdomínio e passar como parâmetro
RewriteCond %{HTTP_HOST} ^([^.]+)\.taskboard\.com\.br$ [NC]
RewriteCond %1 !^(www|mail|ftp|cpanel|whm)$ [NC]
RewriteRule ^(.*)$ /index.html?subdomain=%1&path=$1 [QSA,L]

# Redirecionar www para sem www
RewriteCond %{HTTP_HOST} ^www\.taskboard\.com\.br$ [NC]
RewriteRule ^(.*)$ https://taskboard.com.br/$1 [R=301,L]

# Fallback para SPA (Angular Router)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Segurança - bloquear acesso direto a arquivos sensíveis
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|inc|bak)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Compressão GZIP
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

# Cache para assets estáticos
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### 5. Configuração Angular

**No `SubdomainService` para produção:**

```typescript
getCompanySubdomain(): string | null {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Desenvolvimento
    if (hostname === 'localhost') {
      return localStorage.getItem('dev-subdomain') || 'gobuyer';
    }
    
    // Produção Hostinger
    if (hostname.includes('taskboard.com.br')) {
      const parts = hostname.split('.');
      
      // Se for *.taskboard.com.br
      if (parts.length >= 3 && parts[0] !== 'www') {
        return parts[0]; // Retorna o subdomínio
      }
      
      // Se for taskboard.com.br (sem subdomínio)
      if (parts.length === 3 && parts[0] === 'taskboard') {
        return null; // Portal principal
      }
    }
    
    // Fallback - tentar query parameter
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('subdomain');
  }
  
  return null;
}
```

## 🧪 Como Testar

### 1. Teste de DNS
```bash
# Testar se o wildcard está funcionando
nslookup gobuyer.taskboard.com.br
nslookup cliente2.taskboard.com.br
nslookup qualquercoisa.taskboard.com.br

# Todos devem retornar o mesmo IP
```

### 2. Teste no Navegador
```
https://gobuyer.taskboard.com.br    → Deve carregar o Angular
https://cliente2.taskboard.com.br   → Deve carregar o Angular  
https://teste123.taskboard.com.br   → Deve carregar o Angular

Todos carregam a mesma aplicação, mas o Angular detecta empresas diferentes
```

### 3. Debug no Angular
```typescript
// No console do navegador:
console.log('Hostname:', window.location.hostname);
console.log('Subdomínio detectado:', this.subdomainService.getCompanySubdomain());
console.log('Empresa atual:', this.subdomainService.getCurrentCompany());
```

## ⚠️ Pontos Importantes do Hostinger

### Limitações Conhecidas:
1. **Propagação DNS**: Pode levar até 24h para propagar
2. **SSL Wildcard**: Pode precisar configurar certificado manualmente
3. **Mod_rewrite**: Deve estar habilitado (geralmente está)

### Alternativa se Wildcard não Funcionar:
```
Criar subdomínios principais manualmente:
- gobuyer.taskboard.com.br → /public_html
- apps.taskboard.com.br    → /public_html
- api.taskboard.com.br     → /public_html

E usar .htaccess para detectar outros
```

### Configuração SSL:
```
1. No hPanel: SSL/TLS → Gerenciar SSL
2. Tipo: Let's Encrypt (gratuito)
3. Domínios: taskboard.com.br, *.taskboard.com.br
4. Se não suportar wildcard: criar SSL para cada subdomínio principal
```

## 🚀 Processo Final

1. **DNS Wildcard** → Todos os subdomínios apontam para o servidor
2. **Apache .htaccess** → Captura o subdomínio e redireciona para Angular
3. **Angular SPA** → Detecta empresa pelo subdomínio
4. **Uma única aplicação** → Serve todas as empresas

### Fluxo Completo:
```
usuário digita: gobuyer.taskboard.com.br
         ↓
DNS resolve para IP do Hostinger  
         ↓
Apache recebe requisição
         ↓
.htaccess captura "gobuyer" 
         ↓
Redireciona para /index.html?subdomain=gobuyer
         ↓
Angular carrega e detecta empresa "gobuyer"
         ↓
Aplicação personalizada da Gobuyer Digital
```

## 🔧 Troubleshooting

### Problema: Subdomínio não resolve
```
Solução: Verificar configuração DNS wildcard
Comando: nslookup teste.taskboard.com.br
```

### Problema: .htaccess não funciona
```
Solução: Verificar se mod_rewrite está ativo
Contatar suporte Hostinger se necessário
```

### Problema: SSL inválido
```
Solução: Configurar SSL wildcard ou individual
Let's Encrypt pode não suportar wildcard no plano básico
```

Esta configuração permite que o sistema funcione como SaaS verdadeiro, onde qualquer empresa pode ser criada dinamicamente sem intervenção manual no servidor!