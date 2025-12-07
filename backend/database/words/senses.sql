CREATE TYPE part_of_speech AS ENUM
(
    'noun', 'verb', 'adjective', 'adverb',
    'pronoun', 'preposition', 'conjunction',
    'interjection', 'article'
);

CREATE TABLE senses
(
    id SERIAL PRIMARY KEY,
    headword_id INT REFERENCES headwords(id) ON DELETE CASCADE,
    pos part_of_speech NOT NULL,
    definition TEXT NOT NULL,
    etymology TEXT,
    notes TEXT
);
