CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,  -- "en", "de", "uk", etc.
    name VARCHAR(100) NOT NULL
);