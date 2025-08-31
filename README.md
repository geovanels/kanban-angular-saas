# Sistema Kanban GoBuyer - Angular

Este é o sistema Kanban da GoBuyer migrado de HTML/JS vanilla para Angular moderno, mantendo a conexão com Firebase.

## Características

- **Angular 20** com standalone components
- **Firebase Integration** (Auth, Firestore, Storage)
- **Tailwind CSS** para estilização
- **Drag & Drop** com Angular CDK
- **Real-time updates** com Firestore
- **Responsive design**
- **TypeScript** para type safety

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── kanban/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── firestore.service.ts
│   │   └── storage.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
```

## Funcionalidades Migradas

### ✅ Completas
- Sistema de autenticação (Email/Password + Google)
- Dashboard com listagem de quadros
- Quadro Kanban com drag & drop
- Conexão real-time com Firebase
- Estrutura de dados mantida (compatível com sistema original)

### 🚧 Em Desenvolvimento
- Modal de edição de leads
- Upload de anexos
- Relatórios e dashboards
- Automações
- Templates de email

## Firebase Functions

As Cloud Functions existentes continuam funcionais:
- `createNewLead` - API para criar leads
- `processEmailQueue` - Processamento de emails
- `onLeadCreated` - Automações na criação
- `onLeadUpdated` - Automações na atualização
- `handleFileUpload` - Upload de arquivos
- `sendReportNow` - Relatórios

## Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar Firebase:**
   - As configurações já estão em `src/environments/environment.ts`
   - Projeto: `kanban-gobuyer`

3. **Executar em desenvolvimento:**
   ```bash
   npm run serve
   ```

4. **Build para produção:**
   ```bash
   npm run build
   ```

## Comparação com Sistema Original

| Funcionalidade | HTML Original | Angular |
|---|---|---|
| Autenticação | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Kanban Board | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ |
| Real-time | ✅ | ✅ |
| Responsivo | ✅ | ✅ |
| Type Safety | ❌ | ✅ |
| Componentização | ❌ | ✅ |
| Roteamento | Básico | ✅ Avançado |
| Guards | ❌ | ✅ |

## Vantagens da Migração

1. **Manutenibilidade**: Código organizado em componentes e serviços
2. **Type Safety**: TypeScript previne erros em tempo de desenvolvimento
3. **Performance**: Otimizações do Angular e lazy loading
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Developer Experience**: Hot reload, debugging tools, etc.
6. **Testing**: Framework de testes integrado

## Próximos Passos

1. Implementar modal de edição de leads
2. Migrar sistema de upload de arquivos
3. Implementar dashboards e relatórios
4. Adicionar testes unitários
5. Configurar CI/CD
6. Otimizar performance com OnPush strategy

## Tecnologias Utilizadas

- Angular 20
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Angular CDK (Drag & Drop)
- RxJS
- Font Awesome