import * as cookie from "cookie";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { LOCAL_ADMIN_UNION_ID, dbAdminUnionId } from "./kimi/auth";
import { getDb } from "./queries/connection";
import { adminUsers } from "@db/schema";
import { env } from "./lib/env";

/** Constant-time string compare, so a wrong password can't be probed by timing. */
function safeEqual(a: string, b: string) {
  const bufA = new TextEncoder().encode(a);
  const bufB = new TextEncoder().encode(b);
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) diff |= bufA[i] ^ bufB[i];
  return diff === 0;
}

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  /** Local admin login with username + password */
  adminLogin: publicQuery
    .input(z.object({ username: z.string().min(1).max(64), password: z.string().min(1).max(128) }))
    .mutation(async ({ input, ctx }) => {
      const unauthorized = new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário ou senha incorretos.",
      });

      // 1) The env-based owner admin — unchanged behaviour.
      const envUserOk = safeEqual(input.username, env.adminUser);
      const envPassOk = safeEqual(input.password, env.adminPass);
      const isEnvAdmin = Boolean(env.adminPass) && envUserOk && envPassOk;

      let unionId: string;
      if (isEnvAdmin) {
        unionId = LOCAL_ADMIN_UNION_ID;
      } else {
        // 2) Otherwise fall back to the admins created in the panel.
        const [row] = await getDb()
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.username, input.username))
          .limit(1);
        if (!row) throw unauthorized;
        const ok = await bcrypt.compare(input.password, row.passwordHash);
        if (!ok) throw unauthorized;
        unionId = dbAdminUnionId(row.id);
      }

      const token = await signSessionToken({
        unionId,
        clientId: env.appId,
      });
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true };
    }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
