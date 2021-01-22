BEGIN;

TRUNCATE
    gift_closet_gifts,
    gift_closet_tags,
    gift_closet_users
    RESTART IDENTITY CASCADE;

INSERT INTO gift_closet_users (user_name, first_name, last_name, email, password)
VALUES 
    ('demo_user', 'Demofirst', 'Demolast', 'demo@gmail.com', '$2a$10$idAlfrQAWlU.ZtvYIDmUBurFfpNUxzfsyLIOmas8DZBVOnsduOnzq'),
    ('snoop_dogg', 'Snoop', 'Dogg', 'snoop@gmail.com', '$2a$10$5747ETB4CvEI8hugiKPKKeZvyORoMEu4QdqTsZh9C31mBydg1q5by'),
    ('jack_sparrow', 'Jack', 'Sparrow', 'capnjack@gmail.com', '$2a$10$D/UjQGSVYMcqT5uCdVA/GOawRwcGRusiTBOS6aCoZ.1sRni1omLKW'),
    ('demo_user2', 'Demofirst', 'Demolast', 'demo@gmail.com', '$2a$10$idAlfrQAWlU.ZtvYIDmUBurFfpNUxzfsyLIOmas8DZBVOnsduOnzq');

INSERT INTO gift_closet_tags (tag_name, user_id) 
VALUES 
    ('Christmas', 1),
    ('Christmas', 2),
    ('Valentines Day', 1),
    ('Anniversary', 2),
    ('McGibbs Birthday', 3),
    ('Demo wife birthday', 1),
    ('MTV music awards crew gift', 2);

INSERT INTO gift_closet_gifts (user_id, tag_id, gift_name, gift_cost, gift_description, gift_url)
VALUES
    (1, 3, 'Box of romantic chocolates', NULL, 'Romantic box of chocolates that my demo wife will love', NULL),
    (1, 1, 'Workout equipment', 32.99, 'This will be a good generic gift to use for my demo friends gift exchange', NULL),
    (1, 6, 'Hand warmers', 10, 'These will be good for my demo wife because her hands always get cold', 'https://amazon.com/definitely-real-url'),
    (2, 2, 'Xbox One', 499.99, 'All the dogs in my crew would love this sweet piece of tech yknow dog', 'https://bestbuy.com/xbox-one'),
    (2, 7, 'Flowers', NULL, 'You know my peeps will be diggin these sweet flowers as thanks for their hard work', NULL),
    (2, 4, 'Big ass ring', 10000, 'My wife will go crazy for this rock dog', NULL),
    (3, 5, 'Bottle of rum', 10.50, 'Gibbs will love this rum', NULL),
    (3, 5, 'New shirt', NULL, 'After old Gibbs spiled rum all over his shirt last week he could use a new one', 'https://pirateshirtdepo.com');


COMMIT;


