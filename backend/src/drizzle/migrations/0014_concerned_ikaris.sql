ALTER TABLE messages DROP COLUMN chat_id;

ALTER TABLE messages ADD COLUMN chat_id UUID DEFAULT gen_random_uuid();
