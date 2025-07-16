ALTER TABLE "chat_rooms" DROP CONSTRAINT "unique_users";--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD COLUMN "user_2_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_user_2_id_users_id_fk" FOREIGN KEY ("user_2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "unique_users" UNIQUE("user_1_id","user_2_id");