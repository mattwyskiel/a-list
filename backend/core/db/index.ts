import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
import { Secrets } from "../services/secrets";
import { logger } from "../logging";

export const db = async () => {
  const secrets = new Secrets();
  const connectionString = await secrets.get("DATABASE_URL");
  logger.info("Connecting to database");
  const client = postgres(connectionString, { prepare: false });
  logger.info("Connection to database successful");
  return drizzle(client, { schema });
};
