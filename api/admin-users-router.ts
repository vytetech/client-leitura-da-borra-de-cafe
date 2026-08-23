import { z } from "zod";
import bcrypt from "bcryptjs";
import { asc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { adminUsers } from "@db/schema";
import { env } from "./lib/env";

const BCRYPT_ROUNDS = 12;

export const adminUsersRouter = createRouter({
  /** Every panel-created admin. The password hash is never selected. */
  list: adminQuery.query(async () => {
    return getDb()
      .select({
        id: adminUsers.id,
        username: adminUsers.username,
        createdAt: adminUsers.createdAt,
      })
      .from(adminUsers)
      .orderBy(asc(adminUsers.createdAt));
  }),

  create: adminQuery
    .input(
      z.object({
        username: z.string().trim().min(3).max(64),
        password: z.string().min(8).max(128),
      }),
    )
    .mutation(async ({ input }) => {
      // The env admin owns the panel; its name must stay unique to it.
      if (input.username.toLowerCase() === env.adminUser.toLowerCase()) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Esse nome é do administrador principal. Escolha outro.",
        });
      }

      const [existing] = await getDb()
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .where(eq(adminUsers.username, input.username))
        .limit(1);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe um administrador com esse usuário.",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
      const [row] = await getDb()
        .insert(adminUsers)
        .values({ username: input.username, passwordHash })
        .returning({
          id: adminUsers.id,
          username: adminUsers.username,
          createdAt: adminUsers.createdAt,
        });
      return row;
    }),

  remove: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const deleted = await getDb()
        .delete(adminUsers)
        .where(eq(adminUsers.id, input.id))
        .returning({ id: adminUsers.id });
      if (deleted.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Administrador não encontrado.",
        });
      }
      return { success: true };
    }),
});
