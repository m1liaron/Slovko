CREATE TABLE examples
(
    id SERIAL PRIMARY KEY,
    sense_id INT REFERENCES senses(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    translation TEXT
);