from fastapi import FastAPI
from pydantic import BaseModel
from translation_api import GoogleApi, FreeDictApi
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Налаштування CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Додайте сюди дозволені домени
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslateWord(BaseModel):
    title: str
    word: str
    language: str


class Card(BaseModel):
    word: str
    translation: str
    explanation: str
    example: str
    voice: str


@app.get('/')
def all_cards():
    all_cards = Card.objects.all()
    return {'cards': all_cards}


@app.post('/add_card')
def add_card(word: TranslateWord):
    google = GoogleApi()
    free_dict = FreeDictApi()
    expl_resp = free_dict.get_explanation(word.word)
    translate = google.translate_text(text=word.word, target_language=word.language)
    explanation = expl_resp["meanings"][0]["definitions"][0]["definition"]
    example = expl_resp["meanings"][0]["definitions"][0]["example"]
    voice = expl_resp["phonetics"][0]["audio"]
    new_card = Card(title=TranslateWord.title,
                    word=word.word,
                    translate=translate,
                    explanation=explanation,
                    example=example,
                    voice=voice)
    return new_card


@app.put()
def update_card():
    new_card = ''
    return {'card': new_card}


@app.delete()
def delete_card():
    return {'card': None}

