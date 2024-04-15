from db import DataBase
from fastapi import FastAPI
from pydantic import BaseModel
from translation_api import GoogleApi, FreeDictApi
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Налаштування CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://192.168.31.196:8081", "http://192.168.31.196:1"],  # Додайте сюди дозволені домени
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = DataBase()

class User(BaseModel):
    user: str

class TranslateWord(BaseModel):
    word: str
    language: str
    user: str


class Card(BaseModel):
    word: str
    translation: str = None
    explanation: str
    example: str
    voice: str


@app.post('/cards')
def all_cards(user: User):
    cards = db.get_all_cards(user.user)
    return cards


@app.get('/card/{word}')
def one_card(card: Card):
    db.get_card(card.word)
    return {'cards': all_cards}


@app.post('/add_card')
def add_card(word: TranslateWord):
    if db.get_card(word.word) is None:
        google = GoogleApi()
        free_dict = FreeDictApi()
        expl_resp = free_dict.get_explanation(word.word)
        translate = google.translate_text(target=word.language, text=word.word)
        explanation = expl_resp[0]['meanings'][0]['definitions'][0]['definition']
        if expl_resp and 'meanings' in expl_resp[0] and 'definitions' in expl_resp[0]['meanings']:
            example = expl_resp[0]['meanings']['definitions'][0].get('example', None)
        else:
            example = 'no example'
        voice = expl_resp[0]['phonetics'][0].get('audio', None)

        new_card = Card(word=word.word,
                        translation=translate,
                        explanation=explanation,
                        example=example,
                        voice=voice)
        db.add_card(new_card.word, new_card.translation, new_card.explanation, new_card.example, new_card.voice)
        return new_card
    elif db.get_card_from_user(word.word, word.user) is None:
        db.add_card_to_learning(word.user, word.word)
        return db.get_card(word.word)
    else:
        return {'error': 'Card is exists'}


@app.delete("/card/{word}")
def delete_card(word):
    db.delete_card(str(word))
    return {'card': None}

