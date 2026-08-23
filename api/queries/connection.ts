import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

function isLocal(url: string) {
  return url.includes("localhost") || url.includes("127.0.0.1");
}

export function getDb() {
  if (!instance) {
    const client = postgres(env.databaseUrl, {
      // Render's managed Postgres requires TLS; a local dev server usually doesn't.
      ssl: isLocal(env.databaseUrl) ? false : "require",
      // The free plan caps connections, so keep the pool small.
      max: 5,
    });
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}
