import psycopg2


class DataBase:
    def __init__(self):
        self.conn = psycopg2.connect(dbname='postgres', user='postgres', password='Djart!2398', host='localhost', port='5432')
        self.cur = self.conn.cursor()

    def get_all_cards(self, user):
        self.cur.execute("""SELECT cards.* FROM cards INNER JOIN learning_words ON cards.eng_word = learning_words.word_id WHERE learning_words.user_id = %s; """,
                         (user,))
        return self.cur.fetchall()

    def get_card(self, eng_word):
        self.cur.execute("""SELECT * FROM cards WHERE eng_word = %s""", (eng_word,))
        return self.cur.fetchone()

    def add_card(self, eng_word: str, ukr_word: str, explanation: str, example: str, voice: str) -> tuple:
        self.cur.execute("""INSERT INTO cards (eng_word, ukr_word, explanation, example, voice) VALUES (%s, %s, %s, %s, %s) RETURNING eng_word, ukr_word, explanation, example""",
                         (eng_word, ukr_word, explanation, example, voice))
        new_card = self.cur.fetchone()
        self.conn.commit()
        return new_card

    def delete_card(self, eng_word: str) -> None:
        self.cur.execute("""DELETE FROM cards WHERE eng_word = %s""", (eng_word,))
        self.conn.commit()

    def get_card_from_user(self, word, user):
        self.cur.execute("""SELECT * FROM learning_words WHERE word_id = %s AND user_id = %s""", (word, user))
        return self.cur.fetchone()

    def add_card_to_learning(self, user: str, word: str):
        self.cur.execute(
            """INSERT INTO learning_words (user_id, word_id) VALUES (%s, %s) RETURNING user_id, word_id""",
            (user, word))
        new_card = self.cur.fetchone()
        self.conn.commit()
        return new_card