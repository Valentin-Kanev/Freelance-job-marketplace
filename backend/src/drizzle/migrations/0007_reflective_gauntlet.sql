ALTER TABLE "chatRooms" RENAME TO "chat_rooms";--> statement-breakpoint
ALTER TABLE "chat_rooms" DROP CONSTRAINT "chatRooms_user_1_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatRoom_id_chatRooms_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_user_1_id_users_id_fk" FOREIGN KEY ("user_1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chatRoom_id_chat_rooms_id_fk" FOREIGN KEY ("chatRoom_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
