# A Leitura da Borra de Café — Ahmad K. Taha

Site institucional e sistema de agendamento de **Ahmad K. Taha**, leitor de borra de café
(cafeomancia / tasseografia árabe) em Ilhabela, SP.

O site é uma landing page de página única, disponível em **quatro idiomas** (português,
espanhol, inglês e árabe, este último com layout RTL), acompanhada de um **painel
administrativo** onde o próprio cliente edita textos, preços, fotos, cores, quais seções
aparecem no site e quem tem acesso ao painel — tudo sem mexer em código.

Desenvolvido por **VyteTech**.

---

## Tech stack

| Camada | Tecnologia |
| --- | --- |
| Front-end | React 19 + TypeScript, Vite 7 |
| Estilo | Tailwind CSS 3 + shadcn/ui (Radix), CSS-in-JS inline nas seções |
| Rotas | React Router 7 |
| API | tRPC 11 sobre Hono 4 |
| Banco | Drizzle ORM 0.45 + PostgreSQL (driver `postgres`) |
| Sessão | JWT HS256 via `jose`, em cookie httpOnly |
| Senhas | bcryptjs (custo 12) |
| Validação | Zod 4 |
| Animação | GSAP, three.js (fundo estrelado) |
| Serialização | superjson |
| Deploy | Render (Web Service + PostgreSQL) |

O front-end e a API vivem no **mesmo processo**: em produção o Hono serve os arquivos
estáticos de `dist/public` e responde `/api/trpc/*` no mesmo servidor Node.

---

## Estrutura de pastas

```
.
├── api/                      # Back-end (Hono + tRPC)
│   ├── boot.ts               # Entrada: monta o Hono, tRPC e, em produção, serve os estáticos
│   ├── router.ts             # Router raiz do tRPC — junta todos os sub-routers
│   ├── middleware.ts         # publicQuery / authedQuery / adminQuery
│   ├── context.ts            # Cria o contexto de cada request (lê o cookie de sessão)
│   ├── auth-router.ts        # Login por usuário/senha, logout, "me"
│   ├── admin-users-router.ts # CRUD de administradores (hash bcrypt)
│   ├── content-router.ts     # Textos/imagens/cores editáveis pelo painel
│   ├── reading-router.ts     # Recebe os pedidos de agendamento do site
│   ├── upload-router.ts      # Upload/listagem/remoção de imagens e vídeos
│   ├── kimi/                 # Herança do template: OAuth (desativado) + sessão JWT
│   │   ├── auth.ts           # authenticateRequest, identidades de admin
│   │   └── session.ts        # Assina e verifica o JWT de sessão
│   └── lib/                  # env, cookies, http, servir estáticos
│
├── db/
│   ├── schema.ts             # Tabelas Drizzle (pg-core)
│   ├── relations.ts          # Relações Drizzle (hoje vazio)
│   ├── seed.ts               # Stub de seed
│   └── migrations/           # SQL gerado pelo drizzle-kit
│
├── contracts/                # Tipos e constantes compartilhados entre front e back
│
├── src/
│   ├── App.tsx               # Rotas: /login, /admin e o site
│   ├── i18n.tsx              # Dicionário dos 4 idiomas + overrides vindos do banco
│   ├── pages/
│   │   ├── Login.tsx         # Tela de login (usuário e senha)
│   │   └── Admin.tsx         # Painel completo, com as seis abas
│   ├── sections/             # Seções do site (Hero, Sobre, Galeria, Rodapé…)
│   ├── components/
│   │   ├── atoms.tsx         # theme, ornamentos, fundo estrelado, constantes
│   │   └── ui/               # shadcn/ui
│   ├── hooks/useAuth.ts      # Estado de autenticação no front
│   └── providers/trpc.tsx    # Cliente tRPC + React Query
│
├── public/                   # Estáticos servidos como estão (imagens, áudio, favicons)
├── docs/                     # Esta documentação
├── render.yaml               # Blueprint de deploy (Web Service + Postgres)
└── drizzle.config.ts         # Configuração do drizzle-kit (dialect postgresql)
```

> **Nota:** o projeto fica na **raiz do repositório**. Não existe pasta `app/`.

---

## Quick start local

Pré-requisitos: **Node 20+** e um **PostgreSQL** acessível (local ou remoto).

```bash
# 1. Dependências
npm install

# 2. Variáveis de ambiente
cp .env.example .env
```

Edite o `.env`:

```env
APP_SECRET=<uma string longa e aleatória>
DATABASE_URL=postgresql://usuario:senha@localhost:5432/leitura_borra_cafe
ADMIN_USER=dandan
ADMIN_PASS=<a senha que você quiser usar localmente>
```

Para gerar um `APP_SECRET` decente:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

```bash
# 3. Criar as tabelas
npm run db:push

# 4. Subir em modo desenvolvimento
npm run dev
```

O site fica em `http://localhost:3000`, o painel em `http://localhost:3000/admin`.
O Vite serve o front com HMR e encaminha `/api/*` para o Hono no mesmo processo.

> O `.env` está no `.gitignore` e **nunca** deve ser commitado.

---

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite + Hono, porta 3000, com HMR) |
| `npm run build` | Compila o front para `dist/public` e empacota a API em `dist/boot.js` |
| `npm run start` | Roda o build de produção (`NODE_ENV=production node dist/boot.js`) |
| `npm run check` | Checagem de tipos (`tsc -b`), sem emitir arquivos |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (hoje não há arquivos de teste no projeto) |
| `npm run format` | Prettier em todo o projeto |
| `npm run db:generate` | Gera um arquivo SQL de migration a partir do `db/schema.ts` |
| `npm run db:migrate` | Aplica as migrations pendentes |
| `npm run db:push` | Sincroniza o schema direto no banco, sem passar por migration |

### `db:push` vs `db:migrate`

O `db:push` compara o `schema.ts` com o banco e aplica a diferença na hora — prático, e é
o que o deploy usa. O `db:migrate` aplica os arquivos versionados de `db/migrations/`, o que
dá histórico e reversibilidade. Veja [docs/DATABASE.md](docs/DATABASE.md).

---

## Build e execução em produção

```bash
npm install --include=dev   # as ferramentas de build são devDependencies
npm run build
npm run db:push             # cria/atualiza as tabelas
npm run start
```

O servidor sobe na porta indicada por `PORT` (padrão `3000`) e serve tudo — site e API.

Em produção são obrigatórias: `APP_SECRET`, `DATABASE_URL` e `ADMIN_PASS`. Se qualquer uma
faltar, o processo aborta no boot com `Missing required environment variable`.

Para o deploy no Render, veja [docs/DEPLOY.md](docs/DEPLOY.md).

---

## Documentação

| Documento | Para quem |
| --- | --- |
| [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) | **Manual do cliente** — como usar o painel, sem termos técnicos |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Como colocar e manter o site no ar no Render |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Visão técnica: fluxo, routers tRPC, autenticação |
| [docs/DATABASE.md](docs/DATABASE.md) | Tabelas, colunas e como rodar migrations |

---

## Licença e propriedade

Projeto proprietário, desenvolvido pela **VyteTech** para Ahmad K. Taha.
