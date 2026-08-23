# Arquitetura

Visão técnica do sistema: como um request atravessa a aplicação, o que cada router tRPC
expõe, como os dados são modelados e como a autenticação funciona.

---

## Visão geral

Front-end e back-end rodam no **mesmo processo Node**. Não há dois serviços, nem CORS entre
eles: o Hono serve os arquivos estáticos e responde à API na mesma porta.

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVEGADOR                                                      │
│                                                                 │
│  React 19 + React Router                                        │
│    /            → Site (Hero, Sobre, Galeria, Agendamento…)     │
│    /login       → Tela de login                                 │
│    /admin       → Painel (6 abas)                               │
│                                                                 │
│  Cliente tRPC (@trpc/react-query + superjson)                   │
│  Cookie de sessão: kimi_sid (httpOnly, enviado automaticamente) │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP  POST /api/trpc/<procedure>
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVIDOR NODE  (api/boot.ts)                                   │
│                                                                 │
│  Hono                                                           │
│   ├── bodyLimit 50 MB          (uploads em base64)              │
│   ├── GET /api/oauth/callback  (herdado, inativo)               │
│   ├── /api/trpc/*  → fetchRequestHandler                        │
│   ├── /api/*       → 404 JSON                                   │
│   └── *            → estáticos de dist/public (só em produção)  │
│                                                                 │
│  createContext (api/context.ts)                                 │
│   └── lê o cookie → verifica o JWT → resolve ctx.user           │
│                                                                 │
│  Middlewares (api/middleware.ts)                                │
│   publicQuery ─── sem exigência                                 │
│   authedQuery ─── exige ctx.user                                │
│   adminQuery  ─── exige ctx.user.role === "admin"               │
│                                                                 │
│  Routers: auth · reading · content · upload · adminUsers        │
└───────────────────────────┬─────────────────────────────────────┘
                            │  Drizzle ORM
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  PostgreSQL                                                     │
│  users · reading_requests · site_content · admin_users          │
│  Conexão: postgres-js, TLS obrigatório, pool de 5               │
└─────────────────────────────────────────────────────────────────┘
```

Em **desenvolvimento** o Vite assume o papel do servidor HTTP e monta a API através do
`@hono/vite-dev-server` (configurado em `vite.config.ts`), com HMR no front. O bloco que serve
os estáticos em `api/boot.ts` só roda quando `NODE_ENV=production`.

---

## Routers tRPC

Todos ficam sob `/api/trpc`. O router raiz está em `api/router.ts`.

### Níveis de proteção

| Procedure base | Exigência |
| --- | --- |
| `publicQuery` | nenhuma |
| `authedQuery` | sessão válida (`ctx.user` presente) |
| `adminQuery` | sessão válida **e** `role === "admin"` |

### `ping` — pública

`ping` (query) → `{ ok: true, ts }`. Verificação simples de que a API responde.

### `auth` (`api/auth-router.ts`)

| Procedure | Tipo | Acesso | O que faz |
| --- | --- | --- | --- |
| `me` | query | autenticado | Devolve o usuário da sessão. |
| `adminLogin` | mutation | **pública** | Valida usuário/senha e emite o cookie de sessão. |
| `logout` | mutation | autenticado | Zera o cookie (`maxAge: 0`). |

O `adminLogin` recebe `{ username, password }` e tenta duas fontes, nesta ordem:

1. **Administrador do ambiente** — compara com `ADMIN_USER`/`ADMIN_PASS` usando comparação em
   tempo constante. Esse caminho **não consulta o banco**, então continua funcionando mesmo
   com o PostgreSQL fora do ar.
2. **Administradores do banco** — busca em `admin_users` pelo `username` e valida com
   `bcrypt.compare`.

Falha em qualquer um dos dois devolve sempre a mesma mensagem
(`"Usuário ou senha incorretos."`), sem revelar se o usuário existe.

### `reading` (`api/reading-router.ts`)

| Procedure | Tipo | Acesso | O que faz |
| --- | --- | --- | --- |
| `create` | mutation | **pública** | Grava um pedido de agendamento vindo do formulário do site. |

Recebe data e horário preferidos, número de participantes, tipo de leitura, nome, e-mail e
mensagem. Devolve `{ id, success }`.

> Hoje **não existe procedure para listar os agendamentos** — o painel não tem tela de
> pedidos. Os registros ficam em `reading_requests` e só podem ser consultados direto no banco.

### `content` (`api/content-router.ts`)

É o coração do painel: um armazenamento chave/valor que sobrepõe os textos e as configurações
padrão do site.

| Procedure | Tipo | Acesso | O que faz |
| --- | --- | --- | --- |
| `list` | query | **pública** | Devolve todos os pares chave/valor como um objeto. |
| `upsert` | mutation | admin | Cria ou atualiza uma chave. |
| `remove` | mutation | admin | Apaga uma chave (o site volta ao valor padrão). |
| `seed` | mutation | admin | Insere várias chaves de uma vez, sem sobrescrever as existentes. |

O `list` é público de propósito: é ele que entrega ao site os textos personalizados. Nada
sensível trafega por aqui.

**Formato das chaves:**

| Padrão | Exemplo | Significado |
| --- | --- | --- |
| `<chave-i18n>.<idioma>` | `hero.title.pt` | Texto sobrescrito num idioma |
| `img.<nome>` | `img.logo` | URL de uma imagem do site |
| `gallery.photo.<n>` | `gallery.photo.3` | Foto da galeria (1 a 9) |
| `events.photo.<n>` | `events.photo.2` | Foto de eventos (1 a 6) |
| `style.color.<nome>` | `style.color.gold` | Cor do tema |
| `style.font.<prop>` | `style.font.base` | Fonte ou tamanho |
| `section.<id>.visible` | `section.faq.visible` | `"0"` esconde a seção |

### `upload` (`api/upload-router.ts`)

| Procedure | Tipo | Acesso | O que faz |
| --- | --- | --- | --- |
| `upload` | mutation | admin | Recebe o arquivo em base64 e grava em disco. |
| `list` | query | admin | Lista os arquivos já enviados, do mais recente ao mais antigo. |
| `deleteFile` | mutation | admin | Apaga um arquivo. |

Formatos aceitos: JPG, PNG, GIF, WebP, SVG, MP4, WebM e MOV. Limite de **20 MB** por arquivo.
O nome é normalizado (sem acentos, sem espaços) e recebe um prefixo temporal, evitando colisão.

Os arquivos vão para `dist/public/uploads` e são servidos em `/uploads/<arquivo>`.

> ⚠️ **Esse diretório é efêmero no Render.** A cada deploy o container é recriado e os uploads
> se perdem. Detalhes em [DEPLOY.md](DEPLOY.md#️-uploads-são-perdidos-a-cada-deploy).

### `adminUsers` (`api/admin-users-router.ts`)

Todas exigem admin.

| Procedure | Tipo | O que faz |
| --- | --- | --- |
| `list` | query | Lista `{ id, username, createdAt }`. **Nunca** devolve o hash. |
| `create` | mutation | Cria um admin. `username` 3–64, `password` mínimo 8. |
| `update` | mutation | Altera nome e/ou senha. Ambos opcionais. |
| `remove` | mutation | Apaga um admin. |

Regras aplicadas:

- O `username` não pode colidir com outro registro nem com `ADMIN_USER` (comparação
  ignorando maiúsculas) → `CONFLICT`.
- No `update`, a checagem de colisão exclui a própria linha, então renomear para o mesmo nome
  não dá erro.
- `update` sem nenhum campo → `BAD_REQUEST` (`"Nada para atualizar."`).
- A senha é sempre hasheada com **bcrypt, custo 12**.

---

## Modelo de dados

Detalhes completos em [DATABASE.md](DATABASE.md). Resumo:

| Tabela | Propósito | Situação |
| --- | --- | --- |
| `admin_users` | Administradores criados pelo painel | Em uso |
| `site_content` | Textos, imagens, cores e visibilidade editáveis | Em uso |
| `reading_requests` | Pedidos de agendamento vindos do site | Em uso (grava; não há tela de leitura) |
| `users` | Usuários do OAuth | **Sem uso** — só era escrita pelo fluxo Kimi, hoje desativado |

---

## Autenticação

### Como a sessão é montada

1. `adminLogin` valida as credenciais.
2. Um **JWT HS256** é assinado com `APP_SECRET` (`api/kimi/session.ts`), com validade de
   **1 ano**. O payload carrega `{ unionId, clientId }`.
3. O token vai para o cookie **`kimi_sid`** — nome herdado do template, sem relação com o
   login atual.

Atributos do cookie (`api/lib/cookies.ts`):

| Atributo | Em `localhost` | Em produção |
| --- | --- | --- |
| `httpOnly` | `true` | `true` |
| `path` | `/` | `/` |
| `sameSite` | `Lax` | `None` |
| `secure` | `false` | `true` |
| `maxAge` | 1 ano | 1 ano |

Sendo `httpOnly`, o JavaScript da página não lê o token — o que fecha a porta para roubo de
sessão por XSS.

### Como cada request é identificado

`createContext` roda antes de toda procedure: lê o cookie, verifica a assinatura do JWT e
resolve o usuário via `authenticateRequest` (`api/kimi/auth.ts`). **Se a verificação falha, o
erro é engolido e `ctx.user` fica indefinido** — o request segue como anônimo, e são os
middlewares que barram o que precisa de permissão.

O `unionId` do token determina quem é quem:

| Formato do `unionId` | Quem é | Como é resolvido |
| --- | --- | --- |
| `local-admin-dandan` | Administrador do ambiente | Objeto sintético, `role: "admin"`. Sem consulta ao banco. |
| `db-admin:<id>` | Administrador do painel | Busca em `admin_users`; se a linha sumiu, devolve 403. |
| qualquer outro | Usuário do OAuth | Busca em `users` (caminho inativo hoje). |

Nenhum dos dois tipos de administrador precisa de registro na tabela `users`.

**Apagar um administrador derruba a sessão dele imediatamente**, porque a linha é consultada a
cada request. Sem isso, um admin removido continuaria usando o painel até o cookie expirar.

### Senhas

| Origem | Armazenamento | Verificação |
| --- | --- | --- |
| Admin do ambiente | Variável `ADMIN_PASS`, em texto puro no painel do Render | Comparação em tempo constante |
| Admins do painel | Coluna `passwordHash`, bcrypt custo 12 | `bcrypt.compare` |

A comparação em tempo constante para o admin do ambiente evita que o tempo de resposta revele
quantos caracteres da senha estavam certos.

> **Limitação conhecida:** trocar a senha de um administrador **não invalida** as sessões já
> abertas dele. O `unionId` é `db-admin:<id>` e o `id` não muda, então o cookie antigo continua
> válido até expirar. Para revogar acesso de imediato, o caminho hoje é remover o
> administrador. Resolver isso exigiria versionar a sessão na tabela.

### O que sobrou do OAuth

O template original usava OAuth do Kimi. O login por OAuth **foi removido da interface**, mas o
código continua no repositório (`api/kimi/`), e a rota `GET /api/oauth/callback` segue
registrada em `api/boot.ts`.

Com `KIMI_AUTH_URL` e `KIMI_OPEN_URL` vazias, esse caminho está inerte: o JWKS é construído sob
demanda e lança erro claro se alguém tentar usá-lo — de propósito, porque construí-lo no
carregamento do módulo derrubava o servidor no boot quando as variáveis estavam em branco.

O módulo `api/kimi/session.ts` **não** é herança morta: é ele que assina e verifica o JWT do
login atual.
