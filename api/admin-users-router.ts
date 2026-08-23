import { z } from "zod";
import bcrypt from "bcryptjs";
import { and, asc, eq, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { adminUsers, type InsertAdminUser } from "@db/schema";
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

  update: adminQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        username: z.string().trim().min(3).max(64).optional(),
        password: z.string().min(8).max(128).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [target] = await db
        .select({ id: adminUsers.id, username: adminUsers.username })
        .from(adminUsers)
        .where(eq(adminUsers.id, input.id))
        .limit(1);
      if (!target) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Administrador não encontrado.",
        });
      }

      const patch: Partial<InsertAdminUser> = {};

      if (input.username !== undefined) {
        if (input.username.toLowerCase() === env.adminUser.toLowerCase()) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Esse nome de usuário já está em uso.",
          });
        }
        // A row colliding with itself is fine — that's a no-op rename.
        const [clash] = await db
          .select({ id: adminUsers.id })
          .from(adminUsers)
          .where(
            and(eq(adminUsers.username, input.username), ne(adminUsers.id, input.id)),
          )
          .limit(1);
        if (clash) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Esse nome de usuário já está em uso.",
          });
        }
        patch.username = input.username;
      }

      if (input.password !== undefined) {
        patch.passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
      }

      if (Object.keys(patch).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nada para atualizar.",
        });
      }

      const [row] = await db
        .update(adminUsers)
        .set(patch)
        .where(eq(adminUsers.id, input.id))
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
