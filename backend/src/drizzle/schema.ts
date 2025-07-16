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
import { timestamp as pgTimestamp } from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["freelancer", "client"]);

export const User = pgTable("users", {
  userId: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  password: varchar("password", { length: 60 }).notNull().unique(),
  email: varchar("email", { length: 25 }).notNull().unique(),
  userType: UserRole("user_type").notNull(),
});

export const Profile = pgTable(
  "profiles",
  {
    profileId: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => User.userId)
      .notNull(),
    skills: varchar("skills", { length: 200 }).notNull(),
    description: varchar("description", { length: 800 }).notNull(),
    hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  },
  (profile) => ({
    hourlyRateConstraint: sql`CHECK (${User.userType} = 'freelancer' OR ${profile.hourlyRate} IS NULL)`,
  })
);

export const Job = pgTable("jobs", {
  jobId: serial("job_id").primaryKey().notNull().unique(),
  clientId: uuid("client_id")
    .references(() => User.userId)
    .notNull(),
  title: varchar("title", { length: 90 }).notNull().unique(),
  description: text("description").notNull().unique(),
  budget: numeric("budget", { precision: 10, scale: 2 }).$type<number>(),
  deadline: date("deadline").$type<Date>(),
  deletedAt: timestamp("deleted_at"),
});

export const Application = pgTable("applications", {
  applicationId: serial("application_id").primaryKey().notNull().unique(),
  jobId: serial("job_id").notNull(),
  freelancerId: uuid("freelancer_id")
    .references(() => User.userId)
    .notNull(),
  coverLetter: text("cover_letter").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const Review = pgTable("reviews", {
  reviewId: serial("review_id").primaryKey().notNull().unique(),
  freelancerId: uuid("freelancer_id")
    .references(() => User.userId)
    .notNull(),
  clientId: uuid("client_id")
    .references(() => User.userId)
    .notNull(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const ChatRoom = pgTable(
  "chat_rooms",
  {
    chatRoomId: uuid("id").primaryKey().defaultRandom(),
    userOneId: uuid("user_1_id")
      .references(() => User.userId)
      .notNull(),
    userTwoId: uuid("user_2_id")
      .references(() => User.userId)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (room) => ({
    uniqueUsers: unique("unique_users").on(room.userOneId, room.userTwoId),
  })
);

export const Message = pgTable("messages", {
  messageId: serial("message_id").primaryKey().notNull().unique(),
  chatRoomId: uuid("chatRoom_id")
    .references(() => ChatRoom.chatRoomId, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => User.userId)
    .notNull(),
  content: text("content").notNull(),
  createdAt: pgTimestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
