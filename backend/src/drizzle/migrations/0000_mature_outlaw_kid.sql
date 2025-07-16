DO $$ BEGIN
 CREATE TYPE "public"."userRole" AS ENUM('freelancer', 'client');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applications" (
	"applicationId" serial PRIMARY KEY NOT NULL,
	"jobId" serial NOT NULL,
	"freelancerId" uuid NOT NULL,
	"coverLetter" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "applications_application_id_unique" UNIQUE("applicationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chatRooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userOneId" uuid NOT NULL,
	"userTwoId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uniqueUsers" UNIQUE("userOneId","userTwoId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"jobId" serial PRIMARY KEY NOT NULL,
	"clientId" uuid NOT NULL,
	"title" varchar(90) NOT NULL,
	"description" text NOT NULL,
	"budget" numeric(12, 2) NOT NULL,
	"deadline" date NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "jobs_job_id_unique" UNIQUE("jobId"),
	CONSTRAINT "jobs_title_unique" UNIQUE("title"),
	CONSTRAINT "jobs_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"messageId" serial PRIMARY KEY NOT NULL,
	"chatRoomId" uuid NOT NULL,
	"senderId" uuid NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "messages_message_id_unique" UNIQUE("messageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"skills" varchar(30) NOT NULL,
	"description" varchar(800) NOT NULL,
	"hourlyRate" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"reviewId" serial PRIMARY KEY NOT NULL,
	"freelancerId" uuid NOT NULL,
	"clientId" uuid NOT NULL,
	"rating" integer NOT NULL,
	"reviewText" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_review_id_unique" UNIQUE("reviewId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(20) NOT NULL,
	"password" varchar(60) NOT NULL,
	"email" varchar(25) NOT NULL,
	"userType" "userRole" NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_password_unique" UNIQUE("password"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_freelancer_id_users_id_fk" FOREIGN KEY ("freelancerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_user_1_id_users_id_fk" FOREIGN KEY ("userOneId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_user_2_id_users_id_fk" FOREIGN KEY ("userTwoId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_client_id_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chatRoom_id_chatRooms_id_fk" FOREIGN KEY ("chatRoomId") REFERENCES "public"."chatRooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_freelancer_id_users_id_fk" FOREIGN KEY ("freelancerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_id_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
