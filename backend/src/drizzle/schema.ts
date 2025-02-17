import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["freelancer", "client"]);

export const User = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  password: varchar("password", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 25 }).notNull().unique(),
  user_type: UserRole("user_type").notNull(),
});

export const Profile = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => User.id)
    .notNull(),
  skills: varchar("skills", { length: 30 }).notNull(),
  description: varchar("description", { length: 800 }).notNull(),
  hourly_rate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
});

export const Job = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  client_id: uuid("client_id")
    .references(() => User.id)
    .notNull(),
  title: varchar("title", { length: 90 }).notNull().unique(),
  description: text("description").notNull().unique(),
  budget: numeric("budget", { precision: 12, scale: 2 }).notNull(),
  deadline: timestamp("deadline").notNull(),
});

export const Application = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  job_id: uuid("job_id")
    .references(() => Job.id, { onDelete: "cascade" })
    .notNull(),
  freelancer_id: uuid("freelancer_id")
    .references(() => User.id)
    .notNull(),
  cover_letter: text("cover_letter").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

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

export const ChatRoom = pgTable(
  "chat_rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_1_id: uuid("user_1_id")
      .references(() => User.id)
      .notNull(),
    user_2_id: uuid("user_2_id")
      .references(() => User.id)
      .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (room) => ({
    uniqueUsers: unique("unique_users").on(room.user_1_id, room.user_2_id),
  })
);

export const Message = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chat_room_id: uuid("chat_room_id")
    .references(() => ChatRoom.id, { onDelete: "cascade" })
    .notNull(),
  sender_id: uuid("sender_id")
    .references(() => User.id)
    .notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
