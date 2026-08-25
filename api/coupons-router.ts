import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { coupons, type InsertCoupon } from "@db/schema";
import { createRouter, adminQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  MAX_DISCOUNT_PERCENT,
  MIN_DISCOUNT_PERCENT,
  formatDateInput,
  getCouponValidationResult,
  getCouponStatus,
  isDateRangeValid,
  localDateEnd,
  localDateStart,
  normalizeCouponCode,
} from "./coupons";

const couponInput = z
  .object({
    code: z.string().trim().min(1, "Código obrigatório.").max(64),
    discountPercent: z
      .number()
      .int()
      .min(MIN_DISCOUNT_PERCENT)
      .max(MAX_DISCOUNT_PERCENT),
    startDate: z.string().min(1, "Data inicial obrigatória."),
    endDate: z.string().min(1, "Data final obrigatória."),
    isActive: z.boolean().default(true),
  })
  .superRefine((input, ctx) => {
    try {
      if (!isDateRangeValid(input.startDate, input.endDate)) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "A data de término deve ser igual ou posterior à data de início.",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Data inválida.";
      ctx.addIssue({ code: "custom", path: ["startDate"], message });
    }
  });

function serializeCoupon(coupon: typeof coupons.$inferSelect) {
  return {
    ...coupon,
    startDate: formatDateInput(coupon.startsAt),
    endDate: formatDateInput(coupon.expiresAt),
    status: getCouponStatus(coupon),
  };
}

export const couponsRouter = createRouter({
  list: adminQuery.query(async () => {
    const rows = await getDb().select().from(coupons).orderBy(asc(coupons.createdAt));
    return rows.map(serializeCoupon);
  }),

  create: adminQuery.input(couponInput).mutation(async ({ input }) => {
    const code = normalizeCouponCode(input.code);
    const startsAt = localDateStart(input.startDate);
    const expiresAt = localDateEnd(input.endDate);

    const [existing] = await getDb()
      .select({ id: coupons.id })
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);
    if (existing) {
      throw new TRPCError({ code: "CONFLICT", message: "Já existe um cupom com esse código." });
    }

    const [row] = await getDb()
      .insert(coupons)
      .values({
        code,
        discountPercent: input.discountPercent,
        startsAt,
        expiresAt,
        isActive: input.isActive,
      })
      .returning();
    return serializeCoupon(row);
  }),

  update: adminQuery
    .input(couponInput.extend({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const code = normalizeCouponCode(input.code);

      const [target] = await db
        .select({ id: coupons.id })
        .from(coupons)
        .where(eq(coupons.id, input.id))
        .limit(1);
      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cupom não encontrado." });
      }

      const [sameCode] = await db
        .select({ id: coupons.id })
        .from(coupons)
        .where(eq(coupons.code, code))
        .limit(1);
      if (sameCode && sameCode.id !== input.id) {
        throw new TRPCError({ code: "CONFLICT", message: "Já existe um cupom com esse código." });
      }

      const patch: Partial<InsertCoupon> = {
        code,
        discountPercent: input.discountPercent,
        startsAt: localDateStart(input.startDate),
        expiresAt: localDateEnd(input.endDate),
        isActive: input.isActive,
      };

      const [row] = await db.update(coupons).set(patch).where(eq(coupons.id, input.id)).returning();
      return serializeCoupon(row);
    }),

  remove: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const deleted = await getDb().delete(coupons).where(eq(coupons.id, input.id)).returning({ id: coupons.id });
      if (deleted.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cupom não encontrado." });
      }
      return { success: true };
    }),

  validate: publicQuery
    .input(z.object({ code: z.string().trim().min(1).max(64) }))
    .mutation(async ({ input }) => {
      const [coupon] = await getDb()
        .select()
        .from(coupons)
        .where(eq(coupons.code, normalizeCouponCode(input.code)))
        .limit(1);

      return getCouponValidationResult(coupon);
    }),
});
