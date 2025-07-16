ALTER TABLE "chatRooms" RENAME COLUMN "user_one_Id" TO "user_1_id";--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "unique_users";--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "chatRooms_user_one_Id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chatRooms" DROP CONSTRAINT "chatRooms_user_Two_Id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_user_1_id_users_id_fk" FOREIGN KEY ("user_1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "chatRooms" DROP COLUMN IF EXISTS "user_Two_Id";--> statement-breakpoint
ALTER TABLE "chatRooms" ADD CONSTRAINT "unique_users" UNIQUE("user_1_id","user_1_id");