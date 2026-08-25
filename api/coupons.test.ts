import { describe, expect, it } from "vitest";
import {
  getCouponStatus,
  getCouponValidationResult,
  isCouponApplicable,
  isDateRangeValid,
  localDateEnd,
  localDateStart,
} from "./coupons";

const activeCoupon = {
  isActive: true,
  startsAt: localDateStart("2026-08-25"),
  expiresAt: localDateEnd("2026-08-31"),
};

describe("coupon validity period", () => {
  it("rejects before the start date", () => {
    expect(getCouponStatus(activeCoupon, new Date(2026, 7, 24, 23, 59, 59))).toBe("scheduled");
    expect(isCouponApplicable(activeCoupon, new Date(2026, 7, 24, 23, 59, 59))).toBe(false);
  });

  it("accepts exactly on the start date", () => {
    expect(isCouponApplicable(activeCoupon, new Date(2026, 7, 25, 0, 0, 0))).toBe(true);
  });

  it("accepts between start and end", () => {
    expect(isCouponApplicable(activeCoupon, new Date(2026, 7, 28, 12, 0, 0))).toBe(true);
  });

  it("accepts exactly on the end date until the end of the day", () => {
    expect(isCouponApplicable(activeCoupon, new Date(2026, 7, 31, 23, 59, 59, 999))).toBe(true);
  });

  it("rejects after the end date", () => {
    expect(getCouponStatus(activeCoupon, new Date(2026, 8, 1, 0, 0, 0))).toBe("expired");
    expect(isCouponApplicable(activeCoupon, new Date(2026, 8, 1, 0, 0, 0))).toBe(false);
  });

  it("rejects inactive coupons inside the period", () => {
    expect(getCouponStatus({ ...activeCoupon, isActive: false }, new Date(2026, 7, 28, 12, 0, 0))).toBe("inactive");
  });

  it("accepts active coupons inside the period", () => {
    expect(getCouponStatus(activeCoupon, new Date(2026, 7, 28, 12, 0, 0))).toBe("active");
  });

  it("keeps legacy coupons active from the compatibility start date until expiresAt", () => {
    const legacyCoupon = {
      isActive: true,
      startsAt: localDateStart("1970-01-01"),
      expiresAt: localDateEnd("2026-08-31"),
    };
    expect(isCouponApplicable(legacyCoupon, new Date(2026, 7, 1, 12, 0, 0))).toBe(true);
  });

  it("blocks saving when end date is before start date", () => {
    expect(isDateRangeValid("2026-08-31", "2026-08-25")).toBe(false);
  });

  it("rejects nonexistent coupons", () => {
    expect(getCouponValidationResult(null)).toEqual({
      valid: false,
      message: "Cupom não encontrado.",
    });
  });
});
