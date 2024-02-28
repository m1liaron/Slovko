from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Card(BaseModel):
    title: str
    translate: str


@app.get('/')
def all_cards():
    all_cards = Card.objects.all()
    return {'cards': all_cards}


@app.post('/add_card')
def add_card(card: Card):
    return {'card': card}


@app.put()
def update_card():
    new_card = ''
    return {'card': new_card}


@app.delete()
def delete_card():
    return {'card': None}
