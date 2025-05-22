ALTER TABLE "jobs" ALTER COLUMN "budget" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "budget" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "deadline" DROP NOT NULL;