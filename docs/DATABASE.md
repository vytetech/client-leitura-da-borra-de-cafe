# Banco de dados

PostgreSQL, acessado com Drizzle ORM. O schema fica em `db/schema.ts` e é a **fonte da
verdade** — as migrations são geradas a partir dele, nunca o contrário.

Conexão em `api/queries/connection.ts`: driver `postgres` (postgres-js), pool de **5 conexões**
(o plano free do Render limita conexões) e `ssl: "require"` para qualquer host que não seja
`localhost`/`127.0.0.1`.

---

## Tabelas

### `admin_users`

Administradores criados pelo painel, na aba **Usuários**.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `bigserial` | PK | Identificador. Aparece na sessão como `db-admin:<id>`. |
| `username` | `varchar(64)` | NOT NULL, UNIQUE | Nome de acesso. |
| `passwordHash` | `text` | NOT NULL | Hash bcrypt (custo 12). **Nunca** a senha em texto. |
| `createdAt` | `timestamp` | NOT NULL, `now()` | Data de criação. |

O administrador principal (`ADMIN_USER`/`ADMIN_PASS`) **não fica aqui**. Ele vive só nas
variáveis de ambiente, e é justamente por isso que não pode ser apagado pelo painel.

Tipos exportados: `AdminUser`, `InsertAdminUser`.

### `site_content`

Armazenamento chave/valor com tudo que o cliente edita no painel. Cada linha sobrepõe um valor
padrão do código.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `serial` | PK | Identificador. |
| `contentKey` | `varchar(128)` | NOT NULL, UNIQUE | Chave (veja os padrões abaixo). |
| `value` | `text` | NOT NULL | Valor. Até 20.000 caracteres, limite imposto pela API. |
| `updatedAt` | `timestamp` | NOT NULL, `now()` | Atualizado a cada escrita. |

Padrões de chave:

| Padrão | Exemplo | Efeito |
| --- | --- | --- |
| `<chave-i18n>.<idioma>` | `hero.title.pt` | Sobrescreve um texto num idioma |
| `img.<nome>` | `img.logo` | Troca uma imagem do site |
| `gallery.photo.<1–9>` | `gallery.photo.3` | Foto da galeria |
| `events.photo.<1–6>` | `events.photo.2` | Foto de eventos |
| `style.color.<nome>` | `style.color.gold` | Cor do tema |
| `style.font.<prop>` | `style.font.base` | Fonte ou tamanho |
| `section.<id>.visible` | `section.faq.visible` | `"0"` esconde, ausente ou `"1"` mostra |

Apagar uma linha faz o site voltar ao valor padrão do código — é assim que o botão "Restaurar"
do painel funciona.

Tipo exportado: `SiteContent`.

### `reading_requests`

Pedidos de agendamento enviados pelo formulário do site.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `serial` | PK | Identificador. |
| `userId` | `integer` | nulo | Referência a `users.id`. **Sempre nulo na prática** — o formulário é público. |
| `preferredDate` | `varchar(64)` | nulo | Data preferida, texto livre. |
| `preferredTime` | `varchar(64)` | nulo | Horário preferido, texto livre. |
| `participants` | `varchar(32)` | nulo | Número de participantes. |
| `readingType` | `varchar(128)` | NOT NULL | Tipo de leitura escolhido. |
| `readingId` | `varchar(32)` | nulo | Identificador do serviço. |
| `fullName` | `varchar(255)` | NOT NULL | Nome de quem pediu. |
| `email` | `varchar(320)` | NOT NULL | E-mail de contato. |
| `message` | `text` | nulo | Mensagem livre. |
| `status` | enum `reading_status` | NOT NULL, `pending` | `pending`, `confirmed` ou `cancelled`. |
| `createdAt` | `timestamp` | NOT NULL, `now()` | Data do pedido. |

> **Duas observações importantes.** A coluna `userId` não tem foreign key declarada — é só um
> `integer`. E o `status`, apesar de existir, **nunca muda**: não há procedure que o atualize.
> Todo pedido fica em `pending` para sempre. Como também não existe tela de listagem, a única
> forma de ver os agendamentos hoje é consultar a tabela direto no banco.

Tipos exportados: `ReadingRequest`, `InsertReadingRequest`.

### `users`

Usuários vindos do OAuth. **Sem uso hoje.**

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `serial` | PK | Identificador. |
| `unionId` | `varchar(255)` | NOT NULL, UNIQUE | Identificador externo do provedor. |
| `name` | `varchar(255)` | nulo | Nome. |
| `email` | `varchar(320)` | nulo | E-mail. |
| `avatar` | `text` | nulo | URL do avatar. |
| `role` | enum `role` | NOT NULL, `user` | `user` ou `admin`. |
| `createdAt` | `timestamp` | NOT NULL, `now()` | Criação. |
| `updatedAt` | `timestamp` | NOT NULL, `now()` | Atualização (via `$onUpdate`). |
| `lastSignInAt` | `timestamp` | NOT NULL, `now()` | Último login. |

A tabela é criada pelas migrations e o tipo `User` é usado no contexto tRPC, mas **nenhuma
linha é inserida**: a única escrita vinha do callback OAuth, que está desativado. Os dois tipos
de administrador usam objetos sintéticos, sem passar por aqui.

Tipos exportados: `User`, `InsertUser`.

---

## Tipos enum

Ambos são tipos nomeados no PostgreSQL, criados pela migration:

| Enum | Valores | Usado em |
| --- | --- | --- |
| `role` | `user`, `admin` | `users.role` |
| `reading_status` | `pending`, `confirmed`, `cancelled` | `reading_requests.status` |

## Relações

`db/relations.ts` está **vazio**. Não há relações Drizzle declaradas, e nenhuma foreign key no
banco. A ligação conceitual entre `reading_requests.userId` e `users.id` existe só na intenção
— não é imposta pelo PostgreSQL.

---

## Migrations

Os arquivos ficam em `db/migrations/`, junto com a pasta `meta/` que o drizzle-kit usa para
comparar estados.

| Arquivo | Conteúdo |
| --- | --- |
| `0000_orange_marvel_boy.sql` | Cria os enums e as tabelas `users`, `reading_requests`, `site_content` |
| `0001_violet_shen.sql` | Cria `admin_users` |

### Gerar uma migration

Depois de alterar `db/schema.ts`:

```bash
npm run db:generate
```

O drizzle-kit compara o schema com o snapshot anterior e escreve um novo `.sql` em
`db/migrations/`. Não toca no banco — **revise o SQL gerado antes de aplicar**.

### Aplicar

```bash
npm run db:migrate   # aplica os arquivos versionados, em ordem
npm run db:push      # sincroniza o schema direto, sem migration
```

### Qual usar

| | `db:push` | `db:migrate` |
| --- | --- | --- |
| Como funciona | Compara schema e banco, aplica a diferença na hora | Executa os `.sql` versionados em ordem |
| Histórico | Nenhum | Todo alterado fica registrado |
| Reversível | Não | Sim, escrevendo a migration inversa |
| Risco | Pode remover coluna com dados dentro sem avisar | O SQL foi revisado antes |
| Bom para | Desenvolvimento, iteração rápida | Produção |

### No deploy

O Build Command do Render termina com `npm run db:push`. Na primeira subida ele cria as quatro
tabelas e os dois enums; nas seguintes, aplica só o que mudou no schema — normalmente nada.

**Isso é conveniente, mas é a escolha arriscada.** Uma renomeação de coluna pode virar
"remove a antiga, cria a nova" e levar os dados junto, sem confirmação. As migrations já estão
versionadas, então trocar para `npm run db:migrate` no Build Command é uma mudança de uma linha
— recomendada assim que o site entrar em produção paga.

---

## Acessar o banco diretamente

Como não existe tela para os agendamentos, consultá-los exige acesso direto. Pegue a
**External Database URL** no painel do Render e:

```bash
psql "<external-database-url>"
```

```sql
-- Agendamentos mais recentes
SELECT "id", "fullName", "email", "preferredDate", "preferredTime",
       "readingType", "status", "createdAt"
FROM reading_requests
ORDER BY "createdAt" DESC
LIMIT 50;

-- Administradores cadastrados (o hash nunca deve sair daqui)
SELECT "id", "username", "createdAt" FROM admin_users ORDER BY "createdAt";

-- Conteúdo personalizado pelo painel
SELECT "contentKey", LEFT("value", 60) AS previa, "updatedAt"
FROM site_content
ORDER BY "updatedAt" DESC;
```

> Os nomes de coluna estão em **camelCase** e por isso **exigem aspas duplas** no SQL. Sem elas
> o PostgreSQL converte para minúsculas e a coluna "não existe".
