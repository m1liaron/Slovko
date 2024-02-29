import requests
from googletrans import Translator


class GoogleApi:
    def __init__(self):
        self.translator = Translator()

    def translate_text(self, text: str, target_language: str = 'uk') -> dict:
        translation = self.translator.translate(text, dest=target_language)
        return translation.text


class FreeDictApi:
    def __init__(self):
        self.api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

    def get_explanation(self, word: str) -> dict:
        response = requests.get(self.api_url + word)
        return response.json()
