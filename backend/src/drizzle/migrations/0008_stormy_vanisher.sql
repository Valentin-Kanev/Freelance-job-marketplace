ALTER TABLE "applications" RENAME COLUMN "applicationId" TO "application_id";--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_applicationId_unique";--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_application_id_unique" UNIQUE("application_id");