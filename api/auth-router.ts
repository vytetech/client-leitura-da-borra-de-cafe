import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { LOCAL_ADMIN_UNION_ID } from "./kimi/auth";
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
      const userOk = safeEqual(input.username, env.adminUser);
      const passOk = safeEqual(input.password, env.adminPass);
      if (!env.adminPass || !userOk || !passOk) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário ou senha incorretos.",
        });
      }
      const token = await signSessionToken({
        unionId: LOCAL_ADMIN_UNION_ID,
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
