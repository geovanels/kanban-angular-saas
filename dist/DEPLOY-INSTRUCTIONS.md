# 🚀 Instruções de Deploy - Sistema Kanban Multi-Empresa

## 📁 Arquivos para Upload

Upload todos os arquivos da pasta `dist/kanban-angular/` para o diretório raiz do seu hosting.

## 🌐 Configuração DNS (IP: 82.25.73.171)

Configure os seguintes registros DNS no Hostinger:

### 1. Domínio Principal
- **Tipo:** A
- **Nome:** apps
- **Valor:** 82.25.73.171
- **TTL:** 14400

### 2. Wildcard para Subdomínios
- **Tipo:** A  
- **Nome:** *.apps
- **Valor:** 82.25.73.171
- **TTL:** 14400

## 🔧 Configuração do Servidor

### Apache (.htaccess já incluído)
O arquivo `.htaccess` já está configurado com:
- Redirecionamento HTTPS
- Compressão GZIP
- Cache para assets
- Suporte a SPA (Single Page Application)
- Headers de segurança

### Nginx (se necessário)
```nginx
server {
    listen 80;
    server_name apps.taskboard.com.br *.apps.taskboard.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name apps.taskboard.com.br *.apps.taskboard.com.br;
    
    root /path/to/dist/kanban-angular;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

## 🔐 Configuração Firebase

Certifique-se de que as configurações do Firebase em `main-*.js` estão corretas:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

## 🏢 Empresas Configuradas

### Desenvolvimento Local
- **Subdomínio:** gobuyer
- **URL:** http://localhost:4201
- **Empresa:** Gobuyer Digital

### Produção
- **Subdomínio:** gobuyer
- **URL:** https://gobuyer.apps.taskboard.com.br
- **Empresa:** Gobuyer Digital

### Usuários Padrão da Gobuyer
- `geovane.lopes@gobuyer.com.br` (Admin - Proprietário)
- `admin@gobuyer.com.br` (Admin)
- `rafael@gobuyer.com.br` (Manager)
- `thiago@gobuyer.com.br` (User)

## 🌍 URLs do Sistema

### Domínio Principal
- **Login/Registro:** https://apps.taskboard.com.br

### Subdomínios das Empresas
- **Dashboard:** https://[subdomain].apps.taskboard.com.br/dashboard
- **Usuários:** https://[subdomain].apps.taskboard.com.br/usuarios
- **Kanban:** https://[subdomain].apps.taskboard.com.br/kanban/[boardId]
- **Formulário Público:** https://[subdomain].apps.taskboard.com.br/form

### APIs
- **Lead Intake:** https://[subdomain].apps.taskboard.com.br/api/v1/lead-intake
- **API Geral:** https://api.apps.taskboard.com.br/v1

## ✅ Verificação Pós-Deploy

1. **Teste de Acesso:**
   - https://apps.taskboard.com.br (deve carregar a tela de login)
   - https://gobuyer.apps.taskboard.com.br (deve carregar a empresa Gobuyer)

2. **Teste de Funcionalidades:**
   - Login com usuário existente
   - Criação de nova empresa
   - Gerenciamento de usuários
   - Criação de quadros Kanban

3. **Teste de Subdomínios:**
   - Acesso a diferentes subdomínios
   - Isolamento de dados entre empresas

## 🐛 Troubleshooting

### Tela em Branco
- Verificar console do navegador (F12)
- Verificar se todos os arquivos foram uploadados
- Verificar configuração do Firebase

### Erro 404 em Rotas
- Verificar se o arquivo `.htaccess` foi uploadado
- Para Nginx, configurar `try_files`

### Problemas de Subdomínio
- Verificar configuração DNS
- Aguardar propagação DNS (até 24h)
- Testar com `nslookup subdomain.apps.taskboard.com.br`

### Problemas de HTTPS
- Verificar certificado SSL no Hostinger
- Força redirecionamento HTTPS está no `.htaccess`

## 📞 Suporte

Para problemas técnicos, verificar:
1. Console do navegador (erros JavaScript)
2. Network tab (erros de carregamento)
3. Logs do servidor web
4. Configuração DNS no painel do Hostinger

---

**Versão:** 1.0.0  
**Data:** $(date)  
**Build:** Produção  