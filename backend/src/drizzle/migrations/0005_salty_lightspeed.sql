ALTER TABLE "applications" RENAME COLUMN "jobId" TO "job_id";--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "deletedAt" TO "freelancer_id";--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "freelancerId" TO "cover_letter";--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "coverLetter" TO "deleted_at";--> statement-breakpoint
ALTER TABLE "chatRooms" RENAME COLUMN "userOneId" TO "user_one_Id";--> statement-breakpoint
ALTER TABLE "chatRooms" RENAME COLUMN "userTwoId" TO "user_Two_Id";--> statement-breakpoint
ALTER TABLE "chatRooms" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "jobId" TO "job_id";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "clientId" TO "client_id";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "deletedAt" TO "deleted_at";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "messageId" TO "message_id";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "chatRoomId" TO "chatRoom_id";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "senderId" TO "sender_id";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "profiles" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "profiles" RENAME COLUMN "hourlyRate" TO "hourly_rate";--> statement-breakpoint
ALTER TABLE "reviews" RENAME COLUMN "reviewId" TO "review_id";--> statement-breakpoint
ALTER TABLE "reviews" RENAME COLUMN "freelancerId" TO "freelancer_id";--> statement-breakpoint
ALTER TABLE "reviews" RENAME COLUMN "clientId" TO "client_id";--> statement-breakpoint
ALTER TABLE "reviews" RENAME COLUMN "reviewText" TO "review_text";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "userType" TO "user_type";--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "uniqueUsers";--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_jobId_unique";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_messageId_unique";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_reviewId_unique";--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_freelancerId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "chatRooms_userOneId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "chatRooms_userTwoId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_clientId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatRoomId_chatRooms_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_senderId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_freelancerId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_clientId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "cover_letter" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "deleted_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "freelancer_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "freelancer_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_freelancer_id_users_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_user_one_Id_users_id_fk" FOREIGN KEY ("user_one_Id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_user_Two_Id_users_id_fk" FOREIGN KEY ("user_Two_Id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chatRoom_id_chatRooms_id_fk" FOREIGN KEY ("chatRoom_id") REFERENCES "public"."chatRooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_freelancer_id_users_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "chatRooms" ADD CONSTRAINT "unique_users" UNIQUE("user_one_Id","user_Two_Id");--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_job_id_unique" UNIQUE("job_id");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_message_id_unique" UNIQUE("message_id");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_review_id_unique" UNIQUE("review_id");