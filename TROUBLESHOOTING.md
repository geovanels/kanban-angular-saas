# 🛠️ Troubleshooting - Deploy taskboard.com.br

## ❌ Problema: Site não carrega após deploy

### **Soluções por Ordem de Prioridade:**

## 1. **Verificar Estrutura de Arquivos**
Certifique-se de que TODOS os arquivos estão na pasta correta:

```
/public_html/
├── .htaccess              ← CRÍTICO: arquivo deve existir
├── index.html             ← CRÍTICO: ponto de entrada
├── favicon.ico
├── styles-ZV3IGJCX.css   ← CRÍTICO: arquivo CSS
├── main-6AEPUYGZ.js      ← CRÍTICO: arquivo principal JS
├── polyfills-5CFQRCPP.js ← CRÍTICO: polyfills JS
└── chunk-*.js            ← CRÍTICOS: todos os chunks
```

**❗ IMPORTANTE:** Copie o arquivo `.htaccess` que acabei de criar também!

## 2. **Configurar DNS Corretamente**
No painel da Hostinger, configure:

```
Tipo: A
Nome: @
Valor: 82.25.73.171

Tipo: A  
Nome: *
Valor: 82.25.73.171

Tipo: A
Nome: apps
Valor: 82.25.73.171

Tipo: CNAME
Nome: www
Valor: taskboard.com.br
```

## 3. **Ativar SSL/HTTPS**
No painel da Hostinger:
- ✅ **SSL Certificate** → Ativar Let's Encrypt
- ✅ **Force HTTPS** → Ativar
- ⏱️ **Aguardar** 5-10 minutos para ativação

## 4. **Verificar Permissões dos Arquivos**
Via File Manager ou FTP, definir permissões:
- **Pasta public_html/**: `755`
- **Arquivos .html, .js, .css**: `644`
- **Arquivo .htaccess**: `644`

## 5. **Testar URLs Específicas**

### **URLs para Testar:**
1. `https://taskboard.com.br` → Deve carregar
2. `https://www.taskboard.com.br` → Deve redirecionar
3. `https://apps.taskboard.com.br` → Deve carregar
4. `https://gobuyer.taskboard.com.br` → Deve carregar

### **Como Testar:**
```bash
# Via curl (se tiver acesso)
curl -I https://taskboard.com.br
curl -I https://apps.taskboard.com.br

# Via navegador: F12 → Network tab
```

## 6. **Verificar Console de Erros**
Abra F12 → Console e procure por:
- ❌ `Failed to load resource`
- ❌ `CORS error`
- ❌ `404 Not Found`
- ❌ `Mixed Content`

### **Soluções por Tipo de Erro:**

**404 nos recursos (JS/CSS):**
```
Problema: Arquivos não encontrados
Solução: Verificar se todos os chunks foram copiados
```

**CORS Error:**
```
Problema: Firebase não autoriza o domínio
Solução: Adicionar taskboard.com.br no Firebase Authentication
```

**Mixed Content:**
```
Problema: HTTP resources em página HTTPS
Solução: Verificar se SSL está ativo
```

## 7. **Configuração Firebase para Produção**

### **Domínios Autorizados (Firebase Console):**
Vá em Authentication → Settings → Authorized domains:

```
taskboard.com.br
*.taskboard.com.br
apps.taskboard.com.br
gobuyer.taskboard.com.br
www.taskboard.com.br
```

## 8. **Verificar Configuração do Angular**

Se ainda não funcionar, pode ser necessário configurar o `base href`:

**Opção A: Recompilar com base href correto**
```bash
ng build --base-href="https://taskboard.com.br/"
```

**Opção B: Editar index.html manualmente**
Alterar no arquivo `public_html/index.html`:
```html
<!-- De: -->
<base href="/">

<!-- Para: -->
<base href="https://taskboard.com.br/">
```

## 9. **Backup e Rollback**
Se nada funcionar:

1. **Backup** dos arquivos atuais
2. **Limpar** public_html completamente
3. **Reenviar** todos os arquivos novamente
4. **Verificar** se .htaccess foi copiado

## 10. **Logs de Erro**
No painel da Hostinger, verificar:
- **Error Logs** → Verificar erros 500/404
- **Access Logs** → Verificar se recursos estão sendo acessados

## 🚨 **Checklist Final:**

- [ ] Todos os arquivos foram copiados?
- [ ] Arquivo .htaccess está presente?
- [ ] SSL/HTTPS está ativo?
- [ ] DNS está configurado (aguardar até 24h)?
- [ ] Domínios foram adicionados no Firebase?
- [ ] Permissões dos arquivos estão corretas?
- [ ] Console do navegador mostra erros?

## 📞 **Se Ainda Não Funcionar:**

1. **Compartilhe** o link atual que você está tentando acessar
2. **Envie** uma captura da tela do erro
3. **Copie** os erros do Console (F12)
4. **Verifique** se o domínio taskboard.com.br está mesmo apontando para seu servidor

**Teste rápido:** Crie um arquivo `test.html` simples:
```html
<!DOCTYPE html>
<html>
<head><title>Teste</title></head>
<body><h1>Servidor funcionando!</h1></body>
</html>
```

Acesse `https://taskboard.com.br/test.html` - se aparecer, o problema é com o Angular.