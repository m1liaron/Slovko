CREATE INDEX idx_headwords_language ON headwords(language_id, text);
CREATE INDEX idx_senses_headword ON senses(headword_id);
CREATE INDEX idx_examples_sense ON examples(sense_id);
CREATE INDEX idx_collocations_sense ON collocations(sense_id);
CREATE INDEX idx_idioms_language ON idioms(language_id);
