CREATE TABLE user_words
(
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    text VARCHAR(255) NOT NULL,
    translation VARCHAR(255),
    language_id INT REFERENCES languages(id),
    created_at TIMESTAMP DEFAULT NOW()
);
