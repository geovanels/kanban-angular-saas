# 🔐 **Guia Completo - SSL para Subdomínios no Hostinger**

## 📋 **Verificações do Seu Plano**

### **1. Identificar seu Plano:**
No painel do Hostinger, verifique qual plano você tem:
- **Premium** - Suporta SSL para subdomínios
- **Business** - Suporta SSL wildcard
- **Compartilhado básico** - Pode ter limitações

### **2. Tipos de SSL Disponíveis:**

#### **SSL Grátis (Let's Encrypt):**
- ✅ Cobre domínio principal: `taskboard.com.br`
- ❌ **NÃO cobre subdomínios** automaticamente
- Precisa adicionar cada subdomínio manualmente

#### **SSL Wildcard (Pago):**
- ✅ Cobre domínio principal: `taskboard.com.br`
- ✅ Cobre todos os subdomínios: `*.taskboard.com.br`
- Disponível apenas em planos Business+

## 🔧 **Configuração Passo a Passo**

### **Método 1: Adicionar Subdomínio Manualmente (SSL Grátis)**

#### **Passo 1: Criar o Subdomínio**
1. **Painel Hostinger** → **Domínios** → **taskboard.com.br**
2. **Gerenciar** → **Subdomínios**
3. **Criar Subdomínio:**
   - Nome: `gobuyer`
   - Diretório: `/public_html` (mesmo diretório do site principal)
4. **Criar Subdomínio**

#### **Passo 2: Configurar SSL para o Subdomínio**
1. **SSL/TLS** → **Gerenciar SSL**
2. **Adicionar SSL** → **Let's Encrypt (Grátis)**
3. **Domínio:** `gobuyer.taskboard.com.br`
4. **Ativar SSL**

#### **Passo 3: Aguardar Propagação**
- Tempo: 5-15 minutos
- Verificar: `https://gobuyer.taskboard.com.br`

### **Método 2: SSL Wildcard (Recomendado)**

#### **Verificar se está Disponível:**
1. **SSL/TLS** → **Certificados SSL**
2. Procurar opção **"Wildcard"** ou **"*.taskboard.com.br"**
3. Se disponível, selecionar e ativar

#### **Se NÃO estiver disponível:**
- Seu plano pode não suportar SSL wildcard
- Considere upgrade do plano
- Use Método 1 (adicionar cada subdomínio)

## 🔍 **Como Verificar se Funcionou**

### **Testes no Navegador:**
```
✅ https://taskboard.com.br (deve funcionar)
✅ https://gobuyer.taskboard.com.br (deve funcionar após configuração)
❌ ERR_SSL_PROTOCOL_ERROR (SSL não configurado)
❌ "This Page Does Not Exist" (DNS não configurado)
```

### **Verificar Certificado:**
1. **Acesse:** `https://gobuyer.taskboard.com.br`
2. **Clique no cadeado** no navegador
3. **Ver certificado**
4. **Verificar se cobre** `*.taskboard.com.br` ou `gobuyer.taskboard.com.br`

## 🛠️ **Configurações DNS Necessárias**

### **Registros DNS:**
```
Tipo: A
Nome: gobuyer
Valor: [IP do seu servidor Hostinger]
TTL: 3600
```

### **Como Encontrar o IP:**
1. **Painel Hostinger** → **Hosting** → **Gerenciar**
2. **Informações da Conta** → **IP do Servidor**

## ⚠️ **Problemas Comuns e Soluções**

### **Problema 1: "Esta página não existe"**
- ✅ **Solução:** Verificar se subdomínio foi criado
- ✅ **Solução:** Verificar DNS (pode levar até 24h)

### **Problema 2: ERR_SSL_PROTOCOL_ERROR**
- ✅ **Solução:** Configurar SSL para o subdomínio
- ✅ **Solução:** Aguardar propagação do SSL

### **Problema 3: SSL não disponível para subdomínios**
- ✅ **Solução:** Upgrade do plano
- ✅ **Solução:** Usar solução alternativa com parâmetros

## 📞 **Se Nada Funcionar**

### **Contatar Suporte Hostinger:**
1. **Chat/Ticket** no painel
2. **Perguntar especificamente:**
   - "Meu plano suporta SSL para subdomínios?"
   - "Como ativar SSL wildcard para *.taskboard.com.br?"
   - "Preciso fazer upgrade de plano?"

### **Informações para Fornecer:**
- Domínio: `taskboard.com.br`
- Subdomínio desejado: `gobuyer.taskboard.com.br`
- Erro atual: `ERR_SSL_PROTOCOL_ERROR`

## 🎯 **Próximos Passos:**

1. **Tente o Método 1** (criar subdomínio + SSL individual)
2. **Se não funcionar**, entre em contato com suporte
3. **Se seu plano não suportar**, considere upgrade ou use solução alternativa

**Depois de configurar o SSL, faremos novo deploy com as configurações corretas!** 🚀