-- Add expertise and bio columns to users table
-- Run this migration if you haven't already added these columns

USE store_db;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS expertise VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Optional: Add credits columns if not already present
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_credits INT DEFAULT 100,
ADD COLUMN IF NOT EXISTS credits_earned INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS credits_spent INT DEFAULT 0;
