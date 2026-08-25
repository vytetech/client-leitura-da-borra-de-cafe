export type CouponStatus = "scheduled" | "active" | "expired" | "inactive";

export const MIN_DISCOUNT_PERCENT = 1;
export const MAX_DISCOUNT_PERCENT = 100;

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export function localDateStart(date: string) {
  const [year, month, day] = parseDateInput(date);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function localDateEnd(date: string) {
  const [year, month, day] = parseDateInput(date);
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

export function formatDateInput(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCouponStatus(coupon: {
  isActive: boolean;
  startsAt: Date | string;
  expiresAt: Date | string;
}, now = new Date()): CouponStatus {
  if (!coupon.isActive) return "inactive";

  const startsAt = coupon.startsAt instanceof Date ? coupon.startsAt : new Date(coupon.startsAt);
  const expiresAt = coupon.expiresAt instanceof Date ? coupon.expiresAt : new Date(coupon.expiresAt);

  if (now < startsAt) return "scheduled";
  if (now > expiresAt) return "expired";
  return "active";
}

export function isCouponApplicable(coupon: {
  isActive: boolean;
  startsAt: Date | string;
  expiresAt: Date | string;
}, now = new Date()) {
  return getCouponStatus(coupon, now) === "active";
}

export function isDateRangeValid(startDate: string, endDate: string) {
  return localDateEnd(endDate) >= localDateStart(startDate);
}

export function getCouponValidationResult(
  coupon: {
    code: string;
    discountPercent: number;
    isActive: boolean;
    startsAt: Date | string;
    expiresAt: Date | string;
  } | null | undefined,
  now = new Date(),
) {
  if (!coupon) {
    return { valid: false as const, message: "Cupom não encontrado." };
  }

  const status = getCouponStatus(coupon, now);
  if (status !== "active") {
    return { valid: false as const, message: couponUnavailableMessage(status), status };
  }

  return {
    valid: true as const,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    message: `Cupom aplicado: ${coupon.discountPercent}% de desconto.`,
    status,
  };
}

function couponUnavailableMessage(status: CouponStatus) {
  if (status === "scheduled") return "Este cupom ainda não está disponível.";
  if (status === "expired") return "Este cupom expirou.";
  if (status === "inactive") return "Este cupom está inativo.";
  return "Cupom inválido.";
}

function parseDateInput(date: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new Error("Data inválida.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    throw new Error("Data inválida.");
  }

  return [year, month, day];
}
