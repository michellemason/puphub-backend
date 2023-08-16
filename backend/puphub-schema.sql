CREATE TABLE users (
    id SERIAL,
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE dogs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age TEXT NOT NULL,
    breed TEXT NOT NULL,
    gender TEXT NOT NULL,
    image TEXT,
    user_id VARCHAR(25)
        REFERENCES users ON DELETE CASCADE
);
 
CREATE TABLE bookings(
    id SERIAL NOT NULL,
    start_date DATE NOT NULL,
    username VARCHAR(25),
    end_date DATE NOT NULL,
    dog_id VARCHAR(25),
    PRIMARY KEY(id),
    CONSTRAINT bookings_user_id_fkey FOREIGN KEY(username) 
        REFERENCES users(username)
);


-- CREATE TABLE bookings (
--     id SERIAL PRIMARY KEY,
--     date DATE NOT NULL,
--     dog_id INTEGER 
--         REFERENCES dogs ON DELETE CASCADE,
--     user_id VARCHAR(25)
--         REFERENCES users ON DELETE CASCADE
-- );

-- SELECT COUNT * WHERE date = $1 --- how many bookings