import { ResultsCard } from './result.type';

type Section = 'cards' | 'quiz' | 'word' | 'check';

interface LearnSessionData {
  flashCards: ResultsCard[];
  quizCards: ResultsCard[];
  guessWordCards: ResultsCard[];
  checkCards: ResultsCard[];
}

interface ResultData {
  title: string;
  flashCards: ResultsCard[];
  quiz: ResultsCard[];
  guessWord: ResultsCard[];
  checkTranslate: ResultsCard[];
  startedLearn: string;
  completionTime: string;
}

export { Section, ResultsCard, LearnSessionData, ResultData };
