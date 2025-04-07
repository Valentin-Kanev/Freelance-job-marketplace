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
  serial,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const UserRole = pgEnum("userRole", ["freelancer", "client"]);

// export const timestamps = {
//   createdAt: timestamp("createdAt", { withTimezone: true })
//     .default(sql`now()`)
//     .notNull(),
//   updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdate(() => new Date()),
//   deletedAt: timestamp("deletedAt", { withTimezone: true }),
// };

export const User = pgTable("users", {
  user_id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  password: varchar("password", { length: 60 }).notNull().unique(),
  email: varchar("email", { length: 25 }).notNull().unique(),
  user_type: UserRole("user_type").notNull(),
});

export const Profile = pgTable("profiles", {
  profile_id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => User.user_id)
    .notNull(),
  skills: varchar("skills", { length: 30 }).notNull(),
  description: varchar("description", { length: 800 }).notNull(),
  hourly_rate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
});

export const Job = pgTable("jobs", {
  job_id: serial("job_id").primaryKey().notNull().unique(),
  client_id: uuid("client_id")
    .references(() => User.user_id)
    .notNull(),
  title: varchar("title", { length: 90 }).notNull().unique(),
  description: text("description").notNull().unique(),
  budget: numeric("budget", { precision: 12, scale: 2 }).notNull(),
  deadline: date("deadline").notNull(),
});

export const Application = pgTable("applications", {
  application_id: serial("application_id").primaryKey().notNull().unique(),
  job_id: serial("job_id")
    .references(() => Job.job_id, { onDelete: "cascade" })
    .notNull(),
  freelancer_id: uuid("freelancer_id")
    .references(() => User.user_id)
    .notNull(),
  cover_letter: text("cover_letter").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const Review = pgTable("reviews", {
  review_id: serial("review_id").primaryKey().notNull().unique(),
  freelancer_id: uuid("freelancer_id")
    .references(() => User.user_id)
    .notNull(),
  client_id: uuid("client_id")
    .references(() => User.user_id)
    .notNull(),
  rating: integer("rating").notNull(),
  review_text: text("review_text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const ChatRoom = pgTable(
  "chat_rooms",
  {
    chatRoom_id: uuid("id").primaryKey().defaultRandom(),
    user_1_id: uuid("user_1_id")
      .references(() => User.user_id)
      .notNull(),
    user_2_id: uuid("user_2_id")
      .references(() => User.user_id)
      .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (room) => ({
    uniqueUsers: unique("unique_users").on(room.user_1_id, room.user_2_id),
  })
);

export const Message = pgTable("messages", {
  message_id: serial("message_id").primaryKey().notNull().unique(),
  chat_room_id: uuid("chat_room_id")
    .references(() => ChatRoom.chatRoom_id, { onDelete: "cascade" })
    .notNull(),
  sender_id: uuid("sender_id")
    .references(() => User.user_id)
    .notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
