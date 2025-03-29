ALTER TABLE "applications" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "title" SET DATA TYPE varchar(90);--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "skills" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "description" SET DATA TYPE varchar(800);--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_description_unique" UNIQUE("description");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_password_unique" UNIQUE("password");