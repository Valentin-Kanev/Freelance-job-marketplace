import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

// Enum for user roles
export const UserRole = pgEnum("userRole", ["FREELANCER", "CLIENT"]);

// Users table
export const User = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  user_type: UserRole("user_type").notNull(),
});

// Profiles table
export const Profile = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => User.id)
    .notNull(),
  skills: varchar("skills", { length: 255 }).notNull(),
  description: text("description").notNull(),
  hourly_rate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
});

// Jobs table
export const Job = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  client_id: uuid("client_id")
    .references(() => User.id)
    .notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  budget: numeric("budget", { precision: 12, scale: 2 }).notNull(),
  deadline: timestamp("deadline").notNull(),
});

// Applications table
export const Application = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  job_id: uuid("job_id")
    .references(() => Job.id)
    .notNull(),
  freelancer_id: uuid("freelancer_id")
    .references(() => User.id)
    .notNull(),
  cover_letter: text("cover_letter").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Reviews table
export const Review = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  freelancer_id: uuid("freelancer_id")
    .references(() => User.id)
    .notNull(),
  client_id: uuid("client_id")
    .references(() => User.id)
    .notNull(),
  rating: integer("rating").notNull(),
  review_text: text("review_text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
