DO $$ BEGIN
 CREATE TYPE "public"."userRole" AS ENUM('FREELANCER', 'CLIENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "userRole" "userRole" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");