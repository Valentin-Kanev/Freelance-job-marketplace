-- Step 1: Drop Foreign Key Constraints Before Modifying ID Columns
ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS applications_job_id_fkey;
ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS applications_freelancer_id_fkey;
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS reviews_freelancer_id_fkey;
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS reviews_client_id_fkey;
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS messages_chat_room_id_fkey;
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS jobs_client_id_fkey;

-- Step 2: Add New Integer Columns
ALTER TABLE "applications" ADD COLUMN "new_id" SERIAL PRIMARY KEY;
ALTER TABLE "jobs" ADD COLUMN "new_id" SERIAL PRIMARY KEY;
ALTER TABLE "messages" ADD COLUMN "new_id" SERIAL PRIMARY KEY;
ALTER TABLE "reviews" ADD COLUMN "new_id" SERIAL PRIMARY KEY;

-- Step 3: Drop the Old UUID Columns
ALTER TABLE "applications" DROP COLUMN "id";
ALTER TABLE "jobs" DROP COLUMN "id";
ALTER TABLE "messages" DROP COLUMN "id";
ALTER TABLE "reviews" DROP COLUMN "id";

-- Step 4: Rename the New Integer Columns
ALTER TABLE "applications" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "jobs" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "messages" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "reviews" RENAME COLUMN "new_id" TO "id";

-- Step 5: Recreate Foreign Key Constraints
ALTER TABLE "applications" ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT applications_freelancer_id_fkey FOREIGN KEY ("freelancer_id") REFERENCES "users"("user_id");
ALTER TABLE "reviews" ADD CONSTRAINT reviews_freelancer_id_fkey FOREIGN KEY ("freelancer_id") REFERENCES "users"("user_id");
ALTER TABLE "reviews" ADD CONSTRAINT reviews_client_id_fkey FOREIGN KEY ("client_id") REFERENCES "users"("user_id");
ALTER TABLE "messages" ADD CONSTRAINT messages_chat_room_id_fkey FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY ("sender_id") REFERENCES "users"("user_id");
ALTER TABLE "jobs" ADD CONSTRAINT jobs_client_id_fkey FOREIGN KEY ("client_id") REFERENCES "users"("user_id");

-- Step 6: Recreate Unique Constraints
ALTER TABLE "applications" ADD CONSTRAINT "applications_id_unique" UNIQUE("id");
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_id_unique" UNIQUE("id");
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_unique" UNIQUE("id");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_unique" UNIQUE("id");
