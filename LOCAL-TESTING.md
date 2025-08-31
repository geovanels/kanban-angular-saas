# 🧪 Teste Local - Sistema Kanban Multi-Empresa

## 🔧 Configuração do arquivo hosts

### 1. Editar arquivo hosts

**No Mac/Linux:**
```bash
sudo nano /etc/hosts
```

**No Windows:**
```
C:\Windows\System32\drivers\etc\hosts
```

### 2. Adicionar estas linhas:

```
127.0.0.1    apps.taskboard.local
127.0.0.1    gobuyer.taskboard.local
127.0.0.1    teste.taskboard.local
127.0.0.1    api.taskboard.local
```

### 3. Salvar e reiniciar navegador

## 🚀 Iniciar servidor de desenvolvimento

```bash
ng serve --host 0.0.0.0 --port 4200
```

## 🌍 URLs para teste local

### Domínio Principal (Login/Registro)
- **URL:** http://apps.taskboard.local:4200
- **Deve mostrar:** Tela de login/registro

### Empresa Gobuyer  
- **URL:** http://gobuyer.taskboard.local:4200
- **Deve mostrar:** Dashboard da Gobuyer (criada automaticamente)

### Empresa inexistente
- **URL:** http://teste.taskboard.local:4200
- **Deve mostrar:** Página "empresa não encontrada"

## 📝 Usuários de teste da Gobuyer

- **geovane.lopes@gobuyer.com.br** (Admin - Proprietário)
- **admin@gobuyer.com.br** (Admin)
- **rafael@gobuyer.com.br** (Manager)
- **thiago@gobuyer.com.br** (User)

## ✅ Checklist de testes

### 1. Teste de acesso:
- [ ] apps.taskboard.local:4200 carrega login
- [ ] gobuyer.taskboard.local:4200 carrega dashboard
- [ ] teste.taskboard.local:4200 mostra erro

### 2. Teste de funcionalidades:
- [ ] Login funciona
- [ ] Criação de empresa funciona
- [ ] Redirecionamento para subdomínio funciona
- [ ] Gerenciamento de usuários funciona
- [ ] Criação de quadros funciona

### 3. Console do navegador:
- [ ] Sem erros JavaScript
- [ ] Logs de subdomínio detectado
- [ ] Empresa carregada corretamente

## 🐛 Troubleshooting

### Se não funcionar:

1. **Limpar cache DNS:**
```bash
# Mac
sudo dscacheutil -flushcache

# Windows
ipconfig /flushdns

# Linux
sudo systemctl restart systemd-resolved
```

2. **Verificar hosts:**
```bash
ping apps.taskboard.local
# Deve retornar 127.0.0.1
```

3. **Verificar servidor:**
```bash
curl http://apps.taskboard.local:4200
# Deve retornar HTML
```

4. **Console do navegador (F12):**
   - Verificar erros
   - Ver logs de "Subdomínio detectado"
   - Verificar requests de rede

## 🔄 Resetar dados de desenvolvimento

Se quiser limpar e recriar a empresa Gobuyer:

1. Abrir DevTools (F12)
2. Application > Storage > Clear storage
3. Recarregar página
4. Empresa será recriada automaticamente

## 📱 Alternativa - Parâmetros de URL

Se não quiser editar o hosts, use:

- **Gobuyer:** http://localhost:4200?subdomain=gobuyer
- **Login:** http://localhost:4200 (sem parâmetros)

O sistema detectará o parâmetro e simulará o subdomínio.