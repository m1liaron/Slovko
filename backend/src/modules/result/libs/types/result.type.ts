interface ResultsQuery {
  month: string;
  year: string;
  page?: string;
  limit?: string;
}

type ResultsCard = {
  wordId: string;
  word: string;
  translateWord: string;
  mistakesAmount: number;
};

type SaveResultsRequest = {
  title: string;
  flashCards: ResultsCard[];
  quiz: ResultsCard[];
  guessWord: ResultsCard[];
  startedLearn: Date;
  completionTime: Date;
};

export { type ResultsQuery, type ResultsCard, type SaveResultsRequest };
