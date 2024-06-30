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

export const audioAssets = pgTable("audio_assets", {
  id: bigint("asset_id", { mode: "number" }).primaryKey().notNull(),
  mixId: bigint("mix_id", { mode: "number" }).primaryKey().notNull(),
  key: text("key").notNull(),
  mimeType: text("mime_type").notNull(),
  durationSeconds: bigint("duration_seconds", { mode: "number" }).notNull(),
});
