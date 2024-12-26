"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = exports.Application = exports.Job = exports.Profile = exports.User = exports.UserRole = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.UserRole = (0, pg_core_1.pgEnum)("userRole", ["freelancer", "client"]);
const bytea = (0, pg_core_1.customType)({
    dataType() {
        return "bytea";
    },
});
exports.User = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    username: (0, pg_core_1.varchar)("username", { length: 100 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 150 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    user_type: (0, exports.UserRole)("user_type").notNull(),
});
exports.Profile = (0, pg_core_1.pgTable)("profiles", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    user_id: (0, pg_core_1.uuid)("user_id")
        .references(() => exports.User.id)
        .notNull(),
    skills: (0, pg_core_1.varchar)("skills", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    hourly_rate: (0, pg_core_1.numeric)("hourly_rate", { precision: 10, scale: 2 }).notNull(),
});
exports.Job = (0, pg_core_1.pgTable)("jobs", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    client_id: (0, pg_core_1.uuid)("client_id")
        .references(() => exports.User.id)
        .notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 150 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    budget: (0, pg_core_1.numeric)("budget", { precision: 12, scale: 2 }).notNull(),
    deadline: (0, pg_core_1.timestamp)("deadline").notNull(),
});
exports.Application = (0, pg_core_1.pgTable)("applications", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    job_id: (0, pg_core_1.uuid)("job_id")
        .references(() => exports.Job.id, { onDelete: "cascade" })
        .notNull(),
    freelancer_id: (0, pg_core_1.uuid)("freelancer_id")
        .references(() => exports.User.id)
        .notNull(),
    cover_letter: (0, pg_core_1.text)("cover_letter").notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow().notNull(),
});
exports.Review = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    freelancer_id: (0, pg_core_1.uuid)("freelancer_id")
        .references(() => exports.User.id)
        .notNull(),
    client_id: (0, pg_core_1.uuid)("client_id")
        .references(() => exports.User.id)
        .notNull(),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    review_text: (0, pg_core_1.text)("review_text").notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow().notNull(),
});
