-- Add threads to channels
ALTER TABLE channels
ADD COLUMN parent_channel_id VARCHAR(255) DEFAULT NULL, -- if this is set, it's a thread
ADD COLUMN thread_id VARCHAR(255) DEFAULT NULL, 
ADD COLUMN thread_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN creator_id VARCHAR(255) DEFAULT NULL, 
ADD COLUMN creator_username VARCHAR(255) DEFAULT NULL,
ADD COLUMN is_archived BOOLEAN DEFAULT FALSE,
ADD COLUMN is_closed BOOLEAN DEFAULT FALSE,
ADD COLUMN duration_days INT DEFAULT 7; -- defaulting to 7 days as requested

-- hook up messages to threads
ALTER TABLE messages
ADD COLUMN thread_id VARCHAR(255) DEFAULT NULL,
ADD COLUMN thread_name VARCHAR(255) DEFAULT NULL;

-- 3. Create indices for faster lookup of thread messages
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_channels_parent_channel_id ON channels(parent_channel_id);

-- Note: In the backend API, when querying for messages inside a thread,
-- the query should look like:
-- SELECT * FROM messages WHERE channel_id = ? AND thread_id = ? ORDER BY timestamp ASC;
