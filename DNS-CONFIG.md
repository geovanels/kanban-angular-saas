# 🌐 Configuração DNS - Sistema Kanban Multi-Empresa

## IP do Servidor: 82.25.73.171

Configure os seguintes registros DNS no painel do Hostinger:

### 1. Domínio Principal (Login/Registro)
- **Tipo:** A
- **Nome:** apps
- **Valor:** 82.25.73.171
- **TTL:** 14400

### 2. Wildcard para Empresas
- **Tipo:** A
- **Nome:** *
- **Valor:** 82.25.73.171  
- **TTL:** 14400

### 3. Subdomínio API (opcional)
- **Tipo:** A
- **Nome:** api
- **Valor:** 82.25.73.171
- **TTL:** 14400

## 🌍 URLs Finais

### Domínio Principal
- **Login/Registro:** https://apps.taskboard.com.br

### Empresas (Subdomínios)
- **Gobuyer:** https://gobuyer.taskboard.com.br
- **Nova Empresa:** https://[alias].taskboard.com.br

### APIs
- **Geral:** https://api.taskboard.com.br/v1
- **Por Empresa:** https://[alias].taskboard.com.br/api/v1/lead-intake

### Formulários Públicos
- **Por Empresa:** https://[alias].taskboard.com.br/form

## ✅ Teste de Funcionamento

Após configurar o DNS, teste:

1. **https://apps.taskboard.com.br** → Deve carregar tela de login/registro
2. **https://gobuyer.taskboard.com.br** → Deve carregar dashboard da Gobuyer
3. **https://teste.taskboard.com.br** → Deve mostrar "empresa não encontrada"

## ⏰ Tempo de Propagação

- DNS pode levar de 15 minutos a 24 horas para propagar
- Use `nslookup apps.taskboard.com.br` para testar
- Use `nslookup gobuyer.taskboard.com.br` para testar

## 🔧 Troubleshooting

### Se apps.taskboard.com.br não carrega:
1. Verificar se o registro A `apps` está configurado
2. Verificar se os arquivos estão na pasta `public_html`
3. Aguardar propagação DNS

### Se gobuyer.taskboard.com.br não carrega:
1. Verificar se o wildcard `*` está configurado
2. Certificar que aponta para o mesmo IP
3. Testar com `curl -H "Host: gobuyer.taskboard.com.br" 82.25.73.171`

### Debug DNS:
```bash
nslookup apps.taskboard.com.br
nslookup gobuyer.taskboard.com.br
ping apps.taskboard.com.br
```

Todos devem retornar: 82.25.73.171