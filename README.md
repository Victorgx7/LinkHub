# LinkHub — Plataforma de Perfis e Links Inteligentes

Plataforma web full-stack inspirada no conceito do Linktree. O objetivo é permitir que empresas, profissionais e pessoas reúnam seus principais canais de contato em páginas públicas personalizadas.

> **Status atual: Fase 4 de 10 — desenvolvimento em andamento.**
> As fases anteriores foram realizadas e o projeto está pausado na Fase 4 para revisão e validação. Os recursos das próximas fases são planejados e não devem ser considerados concluídos.

## Objetivos do projeto

- Criar páginas públicas de perfil com endereço personalizado.
- Reunir links de redes sociais, contato e outros sites em um só lugar.
- Permitir a administração de perfis e permissões de acesso.
- Oferecer personalização visual das páginas.
- Disponibilizar métricas de visualizações e cliques.

Os objetivos descrevem a proposta geral do produto. A disponibilidade de cada funcionalidade depende da fase de implementação indicada neste README.

## Tecnologias

- **Next.js 15** — aplicação full-stack com App Router.
- **React 19** — construção da interface.
- **JavaScript (ES Modules)** — linguagem principal.
- **Tailwind CSS 3** e **PostCSS** — estilização.
- **MySQL 8.0** — banco de dados relacional.
- **Prisma ORM 6** e Prisma Migrate — acesso e migração do banco.
- **Argon2** — proteção de senhas.
- **Resend** — integração para envio de e-mails.
- **Vitest** e **React Testing Library** — testes.
- **ESLint** e **Prettier** — qualidade e padronização do código.

## Progresso do desenvolvimento

| Fase | Etapa | Status |
|---|---|---|
| 1 | Planejamento e arquitetura | Realizada |
| 2 | Estrutura inicial do projeto | Realizada |
| 3 | Banco de dados e autenticação | Implementada na etapa atual |
| 4 | Páginas públicas | Em desenvolvimento / validação |
| 5 | Painel administrativo | Planejada |
| 6 | Editor visual de perfis e links | Planejada |
| 7 | QR Code e estatísticas | Planejada |
| 8 | SEO, PWA, internacionalização, e-mail e backups | Planejada |
| 9 | Testes, segurança e desempenho | Planejada |
| 10 | Documentação final | Planejada |

**O projeto está atualmente na Fase 4.** A próxima fase só será iniciada após a revisão e validação da etapa atual.

## Estrutura do projeto

```text
prisma/
  schema.prisma
  seed.js
src/
  app/          # Rotas, páginas e endpoints da aplicação
  componentes/  # Componentes reutilizáveis
  contextos/    # Estado global
  estilos/      # CSS global e tokens Tailwind
  hooks/        # Hooks personalizados
  idiomas/      # Dicionários de tradução
  lib/          # Infraestrutura e utilitários
  servicos/     # Regras de negócio
tests/          # Testes automatizados
```

A estrutura poderá mudar conforme as próximas fases forem implementadas.

## Como executar localmente

### Pré-requisitos

- Node.js 20 ou superior.
- npm.
- MySQL 8.0 em execução.

### 1. Clonar o repositório

```bash
git clone https://github.com/Victorgx7/LinkHub.git
cd LinkHub
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo .env.example para .env e preencha os valores do seu ambiente local.

No Windows (Prompt de Comando):

```cmd
copy .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

As variáveis utilizadas pela aplicação incluem:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/linkhub_db"
SESSAO_SECRETO="gere-um-segredo-aleatorio-forte"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@exemplo.com"
ADMIN_PASSWORD="defina-uma-senha-forte"
```

ADMIN_EMAIL e ADMIN_PASSWORD são utilizados pelo seed para criar o administrador inicial. Utilize credenciais próprias e fortes. Nunca publique valores reais, tokens ou senhas.

### 4. Preparar o banco de dados

Com o MySQL em execução e DATABASE_URL configurada:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Iniciar a aplicação

```bash
npm run dev
```

Acesse http://localhost:3000.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| npm run dev | Inicia o servidor de desenvolvimento |
| npm run build | Gera a versão de produção |
| npm run start | Inicia o servidor de produção |
| npm run lint | Executa a verificação de código configurada |
| npm run format | Formata arquivos do projeto |
| npm run prisma:generate | Gera o Prisma Client |
| npm run prisma:migrate | Executa migrações em ambiente de desenvolvimento |
| npm run prisma:studio | Abre o Prisma Studio |
| npm run prisma:seed | Executa a carga inicial do banco |
| npm test | Executa os testes com Vitest |
| npm run test:watch | Executa os testes em modo de observação |

## Banco de dados

O projeto utiliza MySQL com Prisma ORM. O schema está em prisma/schema.prisma e define entidades para usuários, perfis, permissões, links, sessões, convites, eventos de acesso e registros de auditoria.

Para visualizar os dados durante o desenvolvimento:

```bash
npm run prisma:studio
```

## Segurança

- Não faça commit do arquivo .env.
- Não publique senhas, tokens, chaves de API ou dados reais de acesso.
- Utilize o .env.example apenas como modelo, sem credenciais válidas.
- Em produção, configure os segredos diretamente nas variáveis de ambiente do provedor de hospedagem.
- Para deploy, utilize uma estratégia de migração apropriada ao ambiente de produção; não execute prisma migrate dev em produção.

## Próximas etapas

Após a revisão e validação da Fase 4, o desenvolvimento poderá avançar para o painel administrativo (Fase 5), seguindo o planejamento até a conclusão do projeto.

## Repositório

[github.com/Victorgx7/LinkHub](https://github.com/Victorgx7/LinkHub)

---

Projeto pessoal em desenvolvimento.