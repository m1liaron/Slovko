CREATE TABLE compounds
(
    id SERIAL PRIMARY KEY,
    headword_id INT REFERENCES headwords(id) ON DELETE CASCADE,
    compound TEXT NOT NULL
);
