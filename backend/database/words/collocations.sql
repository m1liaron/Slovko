CREATE TABLE collocations
(
    id SERIAL PRIMARY KEY,
    sense_id INT REFERENCES senses(id) ON DELETE CASCADE,
    collocation TEXT NOT NULL,
    type VARCHAR(50),
    frequency INT
);
