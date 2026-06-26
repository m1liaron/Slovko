const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API;

const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
) => {
  if (!text.trim()) return '';

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        sourceLang,
        q: text,
        target: targetLang,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return '';
  }
};

export { translateText };
