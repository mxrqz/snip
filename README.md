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

### 📊 Analytics (Implementado Parcialmente)
- [x] **Tracking Básico** - Contagem de cliques por link
- [x] **Stats Dashboard** - Métricas básicas no dashboard
- [ ] **Analytics Avançados** - Sistema completo (ver roadmap)

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

### 🔥 Prioridade Alta
- [ ] **Sistema de Analytics Completo**
  - [ ] Dashboard de analytics por link individual (`/analytics/[shortCode]`)
  - [ ] Métricas geográficas (país, região, cidade)
  - [ ] Tracking de dispositivos (browser, OS, mobile/desktop)
  - [ ] Análise temporal (horários de pico, dias da semana)
  - [ ] Fontes de tráfego e referrers
  - [ ] UTM parameters tracking
  - [ ] Charts interativos com Recharts
  - [ ] Export de dados (CSV, JSON)

- [ ] **Melhorias de Performance**
  - [ ] Implementar Redis para cache
  - [ ] Otimização de queries do Firestore
  - [ ] Lazy loading de componentes
  - [ ] Image optimization

- [ ] **Features de Produção**
  - [ ] Rate limiting para APIs
  - [ ] Monitoring e logging
  - [ ] Error boundaries
  - [ ] SEO optimization

### 🚀 Prioridade Média
- [ ] **Customização Avançada**
  - [ ] Links customizados (custom slugs)
  - [ ] Bulk URL shortening
  - [ ] Link expiration dates
  - [ ] Password protected links
  - [ ] Link preview cards

- [ ] **Integração e APIs**
  - [ ] API pública para desenvolvedores
  - [ ] Webhooks para eventos
  - [ ] Browser extension
  - [ ] Mobile app (React Native)

- [ ] **Social Features**
  - [ ] Link sharing via redes sociais
  - [ ] Public link directories
  - [ ] Teams e colaboração
  - [ ] Link collections/folders

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
- ✅ Core (8/8) - 100%
- ⚠️ Analytics (2/8) - 25%
- ❌ Advanced Features (0/15) - 0%

### Status Geral: **🟡 Desenvolviment Ativo**

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