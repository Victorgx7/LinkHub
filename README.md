# LinkHub — Plataforma de Perfis e Links Inteligentes

Plataforma Web Full Stack inspirada no conceito do Linktree, com identidade visual SaaS, perfis públicos, links, métricas e autenticação segura.

## Stack

- Next.js (App Router), React e JavaScript (ESM)
- Tailwind CSS e PostCSS
- MySQL 8.0, Prisma ORM e Prisma Migrate
- Sessões com cookies HTTP-Only e senhas protegidas com Argon2id
- Resend para envio de e-mails
- Vitest, React Testing Library, ESLint e Prettier

## Estrutura

```text
src/
├── app/                  # Rotas, páginas e endpoints da aplicação
├── componentes/          # Componentes reutilizáveis
├── contextos/            # Estado global
├── estilos/              # CSS global e tokens Tailwind
├── hooks/                # Hooks personalizados
├── idiomas/              # Dicionários de tradução
├── lib/                  # Infraestrutura e utilitários
└── servicos/             # Regras de negócio
```

## Execução local

### Pré-requisitos

- Node.js 20 ou superior
- MySQL 8.0 em execução

### Configuração

Copie `.env.example` para `.env` e preencha os valores locais. Nunca publique o arquivo `.env`.

```bash
copy .env.example .env
npm install
```

As variáveis principais são:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/linkhub_db"
SESSAO_SECRETO="gere-um-segredo-aleatorio-forte"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@exemplo.com"
ADMIN_PASSWORD="defina-uma-senha-forte"
```

`ADMIN_EMAIL` e `ADMIN_PASSWORD` são usados pelo seed para criar o administrador inicial. Use credenciais exclusivas e fortes, especialmente em produção.

### Banco de dados

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Testes e validações

```bash
npm test
npm run lint
npm run build
npm audit
```

## Produção

Configure todas as variáveis de ambiente no provedor de hospedagem, incluindo `DATABASE_URL`, `SESSAO_SECRETO`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESEND_API_KEY` e `EMAIL_REMETENTE`.

Use `prisma migrate deploy` no deploy, nunca `prisma migrate dev`. Não faça commit de `.env`, credenciais, tokens ou dumps de banco.
