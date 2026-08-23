CREATE TABLE "admin_users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" varchar(64) NOT NULL,
	"passwordHash" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
