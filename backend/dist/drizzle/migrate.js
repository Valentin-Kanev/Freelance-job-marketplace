"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = __importDefault(require("postgres"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config/.env" });
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set in environment variables.");
}
const migrationClient = (0, postgres_1.default)(process.env.DATABASE_URL, {
    max: 1,
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Starting migration...");
            yield (0, migrator_1.migrate)((0, postgres_js_1.drizzle)(migrationClient), {
                migrationsFolder: "./src/drizzle/migrations",
            });
        }
        catch (err) {
            console.error("Migration failed:", err);
        }
        finally {
            yield migrationClient.end();
            console.log("Database connection closed.");
        }
    });
}
main();
