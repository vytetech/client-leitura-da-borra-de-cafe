import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { readingRequests } from "@db/schema";

export const readingRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        preferredDate: z.string().optional(),
        preferredTime: z.string().optional(),
        participants: z.string().optional(),
        readingType: z.string().min(1),
        readingId: z.string().optional(),
        fullName: z.string().min(1),
        email: z.string().email(),
        message: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [row] = await db.insert(readingRequests).values({
        userId: input.userId ?? null,
        preferredDate: input.preferredDate ?? null,
        preferredTime: input.preferredTime ?? null,
        participants: input.participants ?? null,
        readingType: input.readingType,
        readingId: input.readingId ?? null,
        fullName: input.fullName,
        email: input.email,
        message: input.message ?? null,
      }).returning({ id: readingRequests.id });
      return { id: row.id, success: true };
    }),
});
