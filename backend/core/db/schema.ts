import { pgTable, bigint, text, timestamp } from "drizzle-orm/pg-core";
export const mixes = pgTable("mixes", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  title: text("title").notNull(),
  publishDate: timestamp("publishDate", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull(),
});
