CREATE TABLE headwords
(
    id SERIAL PRIMARY KEY,
    language_id INT REFERENCES languages(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    UNIQUE (language_id, text)
);
