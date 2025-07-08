import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const client = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(client, { schema, logger: false });
