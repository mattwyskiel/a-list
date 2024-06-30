import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./core/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres.diikpazixhiuctfgfjtq:Zb7EwXqF5Ak4ygWo@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  },
});
