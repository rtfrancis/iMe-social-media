DROP TABLE IF EXISTS photos;

CREATE TABLE photos(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    image VARCHAR (200) NOT NULL
);
