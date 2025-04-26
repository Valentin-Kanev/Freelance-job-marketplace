ALTER TABLE "messages" RENAME COLUMN "chat_room_id" TO "chatRoom_id";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_room_id_chat_rooms_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chatRoom_id_chat_rooms_id_fk" FOREIGN KEY ("chatRoom_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
