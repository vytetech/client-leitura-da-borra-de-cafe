CREATE TABLE IF NOT EXISTS "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"discountPercent" integer NOT NULL,
	"startsAt" timestamp DEFAULT '1970-01-01 00:00:00' NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "startsAt" timestamp;
--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true;
--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now();
--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now();
--> statement-breakpoint
UPDATE "coupons" SET "startsAt" = '1970-01-01 00:00:00' WHERE "startsAt" IS NULL;
--> statement-breakpoint
UPDATE "coupons" SET "isActive" = true WHERE "isActive" IS NULL;
--> statement-breakpoint
UPDATE "coupons" SET "createdAt" = now() WHERE "createdAt" IS NULL;
--> statement-breakpoint
UPDATE "coupons" SET "updatedAt" = now() WHERE "updatedAt" IS NULL;
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "startsAt" SET DEFAULT '1970-01-01 00:00:00';
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "startsAt" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "isActive" SET DEFAULT true;
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "isActive" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "createdAt" SET DEFAULT now();
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "createdAt" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "updatedAt" SET DEFAULT now();
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "updatedAt" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "coupons" ADD CONSTRAINT "coupons_code_unique" UNIQUE("code");
EXCEPTION
	WHEN duplicate_table THEN NULL;
	WHEN duplicate_object THEN NULL;
END $$;
