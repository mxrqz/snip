# 🔗 Snip - Encurtador de Links Inteligente

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

Um encurtador de links moderno com analytics avançados, interface elegante e sistema de autenticação robusto.

## ✨ Funcionalidades Atuais

### 🚀 Core Features
- [x] **Encurtamento de URLs** - Sistema otimizado com códigos únicos
- [x] **Dashboard Completo** - Interface moderna para gerenciamento
- [x] **Autenticação Segura** - Integração com Clerk + Firebase
- [x] **QR Code Generator** - Geração automática para cada link
- [x] **Sistema de Busca** - Busca fuzzy com atalhos (Ctrl+Shift+F)
- [x] **Floating Dock** - Navegação rápida e intuitiva
- [x] **Tema Dark** - Interface escura como padrão
- [x] **Responsivo** - Otimizado para mobile e desktop

### 🔒 Proteção de Links (Recém Implementado)
- [x] **Links com Senha** - Proteção por senha para usuários logados
- [x] **Data de Expiração** - Links com tempo de vida limitado
- [x] **Dashboard de Proteção** - Visualização de status de proteção
- [x] **Autenticação de Links** - Página de verificação de senha
- [x] **Toast Notifications** - Feedback visual para ações
- [x] **Show/Hide Password** - Visualização controlada de senhas no dashboard

### 📊 Analytics (Implementado Quase Completo)
- [x] **Tracking Básico** - Contagem de cliques por link
- [x] **Stats Dashboard** - Métricas básicas no dashboard  
- [x] **Analytics Avançados** - Sistema completo com métricas detalhadas
- [x] **Dashboard Individual** - Analytics por link (`/analytics/[shortCode]`)
- [x] **Métricas Geográficas** - Rastreamento de país, região e cidade
- [x] **Tracking de Dispositivos** - Browser, OS, mobile/desktop
- [x] **Análise Temporal** - Horários e padrões de acesso
- [x] **Charts Interativos** - Visualização com componentes modernos
- [ ] **Export de Dados** - CSV/JSON (planejado para futuro)

## 🚀 Como Executar

### Pré-requisitos
- **Bun** (runtime recomendado)
- Node.js 18+
- Conta Firebase
- Conta Clerk

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd snip

# Instale as dependências
bun install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### Configuração de Ambiente
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Executar em Desenvolvimento
```bash
bun dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🏗️ Arquitetura

### Stack Tecnológico
- **Runtime**: Bun (ultra-fast JavaScript runtime)
- **Framework**: Next.js 15.5.2 (App Router)
- **Frontend**: React 19.1.0 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Firebase Firestore
- **Auth**: Clerk + Firebase Admin
- **Deployment**: Vercel

### Estrutura do Projeto
```
src/
├── app/
│   ├── api/              # API Routes (Next.js App Router)
│   │   ├── analytics/    # Endpoints de analytics
│   │   ├── dashboard/    # APIs do dashboard
│   │   └── encurtar/     # Core shortening API
│   ├── components/       # Componentes React
│   │   ├── analytics/    # Componentes de métricas
│   │   ├── dashboard/    # Interface do dashboard
│   │   └── landing/      # Landing page
│   ├── services/         # Camada de serviços
│   ├── hooks/           # Custom React hooks
│   ├── types/           # Definições TypeScript
│   └── utils/           # Utilitários e helpers
```

## 📋 Roadmap - Features Pendentes

### 🎯 **Próximas Prioridades**
- [ ] **Planos Premium & Monetização**
  - [ ] Sistema de planos (Free/Premium)
  - [ ] Links customizados (custom slugs) - Premium
  - [ ] Limite de links para usuários Free
  - [ ] Dashboard de billing e subscriptions

- [ ] **API Pública** 
  - [ ] Documentação completa da API
  - [ ] Rate limiting implementado
  - [ ] API keys para desenvolvedores
  - [ ] SDK/Libraries para linguagens populares

### 🚀 **Funcionalidades Futuras**
- [ ] **Bulk Operations**
  - [ ] Bulk URL shortening
  - [ ] Bulk deletion de links
  - [ ] Import/Export via CSV
  - [ ] Batch operations no dashboard

- [ ] **Performance & Produção** (Futuro)
  - [ ] Redis cache para alta performance
  - [ ] CDN para assets estáticos  
  - [ ] Monitoring avançado
  - [ ] Error boundaries globais
  - [ ] SEO optimization completo

- [ ] **Browser Extension**
  - [ ] Chrome extension
  - [ ] Firefox add-on
  - [ ] One-click shortening
  - [ ] Context menu integration

### 🔮 **Features Avançadas** (Longo Prazo)
- [ ] **Integração e APIs**
  - [ ] Webhooks para eventos
  - [ ] Mobile app (React Native)
  - [ ] Zapier integration
  - [ ] Teams e colaboração

- [ ] **Social Features**
  - [ ] Link sharing via redes sociais
  - [ ] Public link directories
  - [ ] Link collections/folders
  - [ ] Community features

### 💡 Prioridade Baixa
- [ ] **Features Avançadas**
  - [ ] A/B testing para links
  - [ ] Geolocation-based redirects
  - [ ] Device-specific redirects
  - [ ] Link retargeting pixels
  - [ ] Advanced URL validation

- [ ] **Admin & Moderation**
  - [ ] Admin dashboard
  - [ ] Content moderation
  - [ ] Spam detection
  - [ ] User management system

- [ ] **Monetização**
  - [ ] Premium features
  - [ ] Usage-based pricing
  - [ ] White-label solution
  - [ ] Analytics API subscription

## 🛠️ Desenvolvimento

### Scripts Disponíveis
```bash
bun dev          # Desenvolvimento
bun build        # Build de produção
bun start        # Executar build
bun lint         # Linting
```

### Comandos Úteis
```bash
# Adicionar componente shadcn/ui
bunx shadcn-ui@latest add button

# Instalar nova dependência
bun add package-name

# Análise de bundle
bun build --analyze
```

### Padrões de Código
- **SOLID Principles** - Arquitetura limpa
- **Clean Code** - Código legível e maintível
- **TypeScript** - Type safety completo
- **Component Composition** - Reutilização de componentes
- **Server Components** - Performance otimizada

## 📊 Métricas do Projeto

### Funcionalidades Implementadas
- ✅ **Core Features** (8/8) - 100%
- ✅ **Proteção de Links** (6/6) - 100%
- ✅ **Analytics Avançados** (7/8) - 87.5%
- ⚠️ **API Pública** (0/4) - 0% (Próxima prioridade)
- ❌ **Planos Premium** (0/4) - 0% (Próxima prioridade)

### Status Geral: **🟢 Funcional e Estável**
*Sistema principal completo com todas as funcionalidades core implementadas*

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔧 Troubleshooting

### Problemas Comuns

**Erro de build com Firebase Admin**
```bash
# Certifique-se de que as variáveis de ambiente estão configuradas
echo $FIREBASE_SERVICE_ACCOUNT_KEY
```

**Problemas com Clerk**
```bash
# Verifique as chaves no dashboard do Clerk
# Confirme que as URLs de callback estão corretas
```

**Erro de TypeScript**
```bash
# Limpe o cache e rebuilde
bun run build --clean
```

---

<div align="center">
  <p>Feito com ❤️ usando as melhores tecnologias modernas</p>
  <p><strong>Bun</strong> • <strong>Next.js</strong> • <strong>React</strong> • <strong>TypeScript</strong> • <strong>Tailwind CSS</strong> • <strong>Firebase</strong> • <strong>Clerk</strong></p>
</div>