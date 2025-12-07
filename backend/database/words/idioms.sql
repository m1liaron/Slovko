CREATE TABLE idioms
(
    id SERIAL PRIMARY KEY,
    language_id INT REFERENCES languages(id),
    text TEXT NOT NULL,
    meaning TEXT,
    example TEXT
);
