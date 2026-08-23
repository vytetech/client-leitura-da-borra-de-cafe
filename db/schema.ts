import {
  pgTable,
  pgEnum,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const readingStatusEnum = pgEnum("reading_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const readingRequests = pgTable("reading_requests", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  preferredDate: varchar("preferredDate", { length: 64 }),
  preferredTime: varchar("preferredTime", { length: 64 }),
  participants: varchar("participants", { length: 32 }),
  readingType: varchar("readingType", { length: 128 }).notNull(),
  readingId: varchar("readingId", { length: 32 }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message"),
  status: readingStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReadingRequest = typeof readingRequests.$inferSelect;
export type InsertReadingRequest = typeof readingRequests.$inferInsert;

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  contentKey: varchar("contentKey", { length: 128 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SiteContent = typeof siteContent.$inferSelect;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here.
//
// Example:
// export const posts = pgTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use integer("columnName").
