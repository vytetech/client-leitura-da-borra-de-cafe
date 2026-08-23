import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  appId: optional("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  // Kimi/OAuth is optional — the app runs with username/password login when blank.
  kimiAuthUrl: optional("KIMI_AUTH_URL"),
  kimiOpenUrl: optional("KIMI_OPEN_URL"),
  ownerUnionId: optional("OWNER_UNION_ID"),
  adminUser: optional("ADMIN_USER", "dandan"),
  adminPass: required("ADMIN_PASS"),
};

/** True when Kimi OAuth is configured; otherwise only local login is available. */
export const kimiEnabled = Boolean(env.kimiAuthUrl && env.kimiOpenUrl);
