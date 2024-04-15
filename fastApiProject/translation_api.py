import requests
from googletrans import Translator
from google.cloud import translate_v2 as translate
from google.oauth2.service_account import Credentials

# Replace with the path to your downloaded JSON file
credentials_path = "./tactile-anthem-415815-91abe30f4ebd.json"

# Create credentials object
credentials = Credentials.from_service_account_file(credentials_path)


class GoogleApi:
    def __init__(self):
        self.translate_client = translate.Client(credentials=credentials)

    def translate_text(self, target: str, text: str) -> dict:

        if isinstance(text, bytes):
            text = text.decode("utf-8")
        result = self.translate_client.translate(text, target_language=target)
        return result["translatedText"]


class FreeDictApi:
    def __init__(self):
        self.api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

    def get_explanation(self, word: str) -> dict:
        response = requests.get(self.api_url + word)
        return response.json()

