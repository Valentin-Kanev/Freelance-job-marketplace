ALTER TABLE "applications" DROP CONSTRAINT "applications_application_id_unique";--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_job_id_unique";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_message_id_unique";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_review_id_unique";--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_freelancer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "chatRooms_user_1_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "chatRooms_user_2_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_client_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatRoom_id_chatRooms_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_freelancer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_client_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_freelancerId_users_id_fk" FOREIGN KEY ("freelancerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_userOneId_users_id_fk" FOREIGN KEY ("userOneId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_userTwoId_users_id_fk" FOREIGN KEY ("userTwoId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_clientId_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chatRoomId_chatRooms_id_fk" FOREIGN KEY ("chatRoomId") REFERENCES "public"."chatRooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_freelancerId_users_id_fk" FOREIGN KEY ("freelancerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_clientId_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicationId_unique" UNIQUE("applicationId");--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_jobId_unique" UNIQUE("jobId");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_messageId_unique" UNIQUE("messageId");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewId_unique" UNIQUE("reviewId");