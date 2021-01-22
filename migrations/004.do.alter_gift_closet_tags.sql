ALTER TABLE gift_closet_tags
    ADD COLUMN 
        user_id INTEGER REFERENCES gift_closet_users(id)
        ON DELETE CASCADE NOT NULL;