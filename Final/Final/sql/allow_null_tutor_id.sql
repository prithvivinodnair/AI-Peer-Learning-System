-- Allow tutor_id to be NULL in requests table
-- This allows students to create requests before a tutor is assigned

ALTER TABLE requests 
MODIFY COLUMN tutor_id INT NULL;
