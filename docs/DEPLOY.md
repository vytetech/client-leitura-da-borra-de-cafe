# Deploy no Render

Guia completo para colocar o site no ar e mantê-lo funcionando.

---

## Pré-requisitos

- Repositório no GitHub: `vytetech/client-leitura-da-borra-de-cafe`, branch `main`.
- Conta no [Render](https://render.com) com acesso ao repositório (se ele for privado, é
  preciso autorizar o Render na organização `vytetech`).
- Um banco **PostgreSQL** — criado pelo próprio Render, conforme o blueprint.

> **Atenção ao Root Directory:** o projeto está na **raiz** do repositório. O campo
> *Root Directory* do Render deve ficar **em branco**. Preenchê-lo com `app` faz o build
> falhar com "package.json not found", porque essa pasta não existe.

---

## Caminho recomendado: Blueprint

O arquivo `render.yaml` na raiz já descreve os dois recursos, então o Render monta tudo
sozinho.

1. No painel do Render: **New +** → **Blueprint**.
2. Conecte o GitHub e escolha o repositório, branch `main`.
3. O Render lê o `render.yaml` e mostra o que vai criar:
   - Web Service `leitura-borra-cafe` (plano free, região Oregon)
   - PostgreSQL `leitura-borra-cafe-db` (plano free, região Oregon)
4. Aparece um campo pedindo **`ADMIN_PASS`** — é a única variável marcada como
   `sync: false`. Digite ali a senha do administrador principal.
5. **Apply**.

O Render cria o banco primeiro, injeta a `DATABASE_URL` no Web Service e só então roda o
build. A primeira subida leva de 5 a 10 minutos.

Ao terminar, o site fica em `https://leitura-borra-cafe.onrender.com`.

---

## Configuração manual (sem blueprint)

Se preferir criar o serviço na mão, use exatamente estes valores:

| Campo | Valor |
| --- | --- |
| Root Directory | *(deixe em branco)* |
| Environment | Node |
| Region | **a mesma do banco** (o blueprint usa Oregon) |
| Branch | `main` |
| Build Command | `npm install --include=dev && npm run build && npm run db:push` |
| Start Command | `npm run start` |
| Health Check Path | `/` |

> O `render.yaml` usa `npm ci` em vez de `npm install`. O `ci` é mais rápido e reprodutível,
> mas exige que o `package-lock.json` esteja em sincronia com o `package.json` — se estiver
> defasado, ele falha em vez de corrigir. O `install` é mais tolerante. Qualquer um dos dois
> funciona, desde que **`--include=dev` esteja presente**.

**A região do Web Service precisa ser a mesma do banco.** Em regiões diferentes o Render não
oferece a URL interna, e a conexão passa pela internet pública — mais lenta e sujeita a
bloqueio.

---

## Variáveis de ambiente

| Variável | Obrigatória | Como definir | Descrição |
| --- | --- | --- | --- |
| `NODE_ENV` | sim | `production` (fixo no blueprint) | Ativa o modo produção: o Hono passa a servir os estáticos e as variáveis obrigatórias passam a ser exigidas. |
| `APP_SECRET` | **sim** | gerado pelo Render (`generateValue: true`) | Chave que assina o JWT de sessão (HS256). Trocá-la desloga todo mundo na hora. |
| `DATABASE_URL` | **sim** | vem do banco (`fromDatabase`) | String de conexão do PostgreSQL. |
| `ADMIN_PASS` | **sim** | **manual, no painel** (`sync: false`) | Senha do administrador principal. Nunca fica no repositório. |
| `ADMIN_USER` | não | `dandan` (padrão) | Nome do administrador principal. Em branco, assume `dandan`. |
| `APP_ID` | não | vazio | Herança do OAuth. Vai como `clientId` dentro do JWT; nada depende do valor. |
| `KIMI_AUTH_URL` | não | vazio | **Não usado.** Login OAuth desativado. |
| `KIMI_OPEN_URL` | não | vazio | **Não usado.** Login OAuth desativado. |
| `OWNER_UNION_ID` | não | vazio | **Não usado.** Só teria efeito no fluxo OAuth. |
| `PORT` | não | injetada pelo Render | Porta do servidor. Sem ela, `3000`. |

As três marcadas como obrigatórias são verificadas no boot **apenas quando
`NODE_ENV=production`**. Em desenvolvimento, a ausência delas não derruba o processo.

---

## O que acontece em cada deploy

1. `npm ci --include=dev` — instala dependências, inclusive as de build.
2. `npm run build` — Vite gera `dist/public`; esbuild empacota a API em `dist/boot.js`.
3. `npm run db:push` — compara o `db/schema.ts` com o banco e aplica a diferença.
   Na primeira vez, cria as quatro tabelas.
4. `npm run start` — sobe o servidor.

Todo push para `main` dispara esse ciclo automaticamente.

---

## Plano free: o que esperar

**O Web Service dorme após 15 minutos sem tráfego.** O primeiro acesso depois disso demora
cerca de 50 segundos, enquanto o container sobe de novo. Para um site onde a pessoa clica no
WhatsApp e volta depois, costuma ser tolerável.

**O PostgreSQL free expira em cerca de 30 dias** e é apagado. Esse é o risco sério: os
agendamentos (`reading_requests`) e todo o conteúdo editado no painel (`site_content`,
`admin_users`) somem junto. **Anote a data de expiração assim que criar o banco.**

Ficar batendo no site com um cron para evitar o sono funciona, mas consome as 750 h/mês do
plano free — na prática o serviço fica ligado o tempo todo e o benefício se perde.

### Ao migrar para produção paga

Em ordem de prioridade:

1. **PostgreSQL Basic (US$ 6/mês)** — backup diário e retenção. Perder dados é pior que um
   cold start.
2. **Web Service Starter (US$ 7/mês)** — acaba o sono e o cold start.
3. **Domínio próprio** — o Render aceita domínio customizado com TLS automático, sem custo.
4. **Trocar `db:push` por `db:migrate` no Build Command** — o `push` altera o schema direto e
   pode remover uma coluna com dados dentro. As migrations já estão versionadas em
   `db/migrations/`.
5. **Mover os uploads para armazenamento externo** — veja o aviso abaixo.

---

## ⚠️ Uploads são perdidos a cada deploy

As imagens e vídeos enviados pela aba "Fotos e vídeos" são gravados em
`dist/public/uploads`, ou seja, **no disco do container**. O Render recria o container a cada
deploy e sempre que o serviço acorda, então **esses arquivos desaparecem**.

Na prática: uma foto enviada pelo painel some no próximo deploy, e o site volta a mostrar a
imagem padrão de `public/images/ahmad/`.

Resolver isso exige um armazenamento externo (S3, R2 ou o Persistent Disk do Render, que só
existe nos planos pagos). O projeto já traz `@aws-sdk/client-s3` nas dependências, mas
**não há código usando S3 hoje** — a migração ainda precisa ser feita.

Enquanto isso não acontece, o caminho seguro para trocar imagens permanentes é substituir os
arquivos em `public/images/ahmad/` e fazer um commit.

---

## Troubleshooting

### `vite: not found` durante o build

O Render define `NODE_ENV=production`, e nesse modo o npm pula as `devDependencies` — que é
justamente onde estão `vite`, `esbuild` e `drizzle-kit`.

**Solução:** garanta o `--include=dev` no Build Command:

```
npm ci --include=dev && npm run build && npm run db:push
```

O mesmo erro aparece como `esbuild: not found` ou `drizzle-kit: not found`, dependendo de
qual etapa falha primeiro.

### `Missing required environment variable: X`

O processo aborta no boot quando `APP_SECRET`, `DATABASE_URL` ou `ADMIN_PASS` estão vazias e
`NODE_ENV=production`.

**Solução:** confira as três em *Environment* no painel. A mais comum de faltar é a
`ADMIN_PASS`, porque ela é `sync: false` e precisa ser digitada à mão — o blueprint não a
preenche sozinha.

### Erros de SSL na conexão com o banco

O PostgreSQL do Render exige TLS. A aplicação já cuida disso: em
`api/queries/connection.ts`, o driver usa `ssl: "require"` para qualquer host que não seja
`localhost` ou `127.0.0.1`.

Se ainda assim aparecer `no pg_hba.conf entry ... no encryption` ou
`self signed certificate`:

- Use a **Internal Database URL** do Render, não a externa, quando o serviço estiver na mesma
  região. Ela é mais rápida e não sai da rede do Render.
- Não acrescente `?sslmode=disable` na `DATABASE_URL` — isso entra em conflito com o
  `ssl: "require"` do driver.
- Rodando localmente contra o banco do Render, use a **External Database URL** (a interna só
  resolve dentro da infraestrutura deles).

### O site sobe, mas o login não funciona

O cookie de sessão é `Secure` + `SameSite=None` fora de `localhost`. Ele só é aceito sob
**HTTPS** — o domínio `.onrender.com` já é HTTPS, então isso normalmente não é problema. Se
estiver testando por HTTP em outro host, o navegador descarta o cookie silenciosamente.

### Primeiro acesso demora ~50 segundos

Comportamento normal do plano free (o serviço estava dormindo). Não é erro.
