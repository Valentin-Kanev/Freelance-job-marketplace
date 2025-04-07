import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";
import { logger } from "../middleware/logger";

dotenv.config({ path: "./config/.env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set in environment variables.");
}

const migrationClient = postgres(process.env.DATABASE_URL, {
  max: 1,
});

async function main() {
  try {
    logger.info("Starting migration...");

    await migrate(drizzle(migrationClient), {
      migrationsFolder: "./src/drizzle/migrations",
    });
  } catch (err) {
    logger.error("Migration failed:", err);
  } finally {
    await migrationClient.end();
    logger.info("Database connection closed.");
  }
}

main();
