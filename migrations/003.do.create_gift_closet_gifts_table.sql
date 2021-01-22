CREATE TABLE gift_closet_gifts (
    id SERIAL PRIMARY KEY,
    gift_name TEXT NOT NULL,
    gift_cost DECIMAL(16, 2),
    gift_description TEXT,
    gift_url TEXT,
    user_id INTEGER 
        REFERENCES gift_closet_users(id) ON DELETE CASCADE NOT NULL,
    tag_id INTEGER 
        REFERENCES gift_closet_tags(id) ON DELETE SET NULL
);