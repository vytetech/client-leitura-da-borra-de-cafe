import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { siteContent } from "@db/schema";
import { eq } from "drizzle-orm";

export const contentRouter = createRouter({
  list: publicQuery.query(async () => {
    const rows = await getDb().select().from(siteContent);
    const map: Record<string, string> = {};
    for (const r of rows) map[r.contentKey] = r.value;
    return map;
  }),
  upsert: adminQuery
    .input(
      z.object({
        key: z.string().min(1).max(128),
        value: z.string().max(20000),
      })
    )
    .mutation(async ({ input }) => {
      await getDb()
        .insert(siteContent)
        .values({ contentKey: input.key, value: input.value })
        .onConflictDoUpdate({
          target: siteContent.contentKey,
          set: { value: input.value },
        });
      return { success: true };
    }),
  remove: adminQuery
    .input(z.object({ key: z.string().min(1).max(128) }))
    .mutation(async ({ input }) => {
      await getDb().delete(siteContent).where(eq(siteContent.contentKey, input.key));
      return { success: true };
    }),
  seed: adminQuery
    .input(z.record(z.string().min(1).max(128), z.string().max(20000)))
    .mutation(async ({ input }) => {
      const entries = Object.entries(input);
      for (const [key, value] of entries) {
        await getDb()
          .insert(siteContent)
          .values({ contentKey: key, value })
          .onConflictDoNothing({ target: siteContent.contentKey });
      }
      return { success: true, count: entries.length };
    }),
});
