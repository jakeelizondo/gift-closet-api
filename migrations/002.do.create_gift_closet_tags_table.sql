CREATE TABLE gift_closet_tags (
    id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);