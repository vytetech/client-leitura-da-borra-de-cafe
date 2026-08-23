import { authRouter } from "./auth-router";
import { readingRouter } from "./reading-router";
import { contentRouter } from "./content-router";
import { uploadRouter } from "./upload-router";
import { adminUsersRouter } from "./admin-users-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  reading: readingRouter,
  content: contentRouter,
  upload: uploadRouter,
  adminUsers: adminUsersRouter,
});

export type AppRouter = typeof appRouter;
