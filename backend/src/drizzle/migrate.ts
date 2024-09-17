import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set in environment variables.");
}

const migrationClient = postgres(process.env.DATABASE_URL, {
  max: 1,
});

async function main() {
  try {
    console.log("Starting migration...");

    await migrate(drizzle(migrationClient), {
      migrationsFolder: "./src/drizzle/migrations",
    });
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await migrationClient.end();
    console.log("Database connection closed.");
  }
}

main();
