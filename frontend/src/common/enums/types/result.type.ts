export enum Modes {
	flashCards = 0,
	quiz = 1,
	guessWord = 2,
	check = 3,
}

type IWord = {
	id: string;
	word: string;
	translate: string;
	mistakesAmount: number;
};

type IResultMode = {
	id: string;
	mode: ModeName;
	resultId?: string;
	words: IWord[];
};

type IResult = {
	id: string;
	title: string;
	userId?: string;
	startedLearn: Date;
	completionTime: Date;
	mode: IResultMode[];
	createdAt: Date;
};

type ModeName = "flashCards" | "quiz" | "guessWord" | "check";

type IStatistics = {
	resultsMonths: string[];
	amountMistakesCards: {
		[key in ModeName]: {
			mistakes: number[];
			wordLength: number[];
		};
	};
};

type ResultsCard = {
	wordId: string;
	word: string;
	translateWord: string;
	mistakesAmount: number;
};

type SaveResultsRequest = {
	title: string | Date;
	flashCards: ResultsCard[];
	quiz: ResultsCard[];
	guessWord: ResultsCard[];
	startedLearn: Date;
	completionTime: Date;
};

export type {
	IResult,
	IStatistics,
	ModeName,
	SaveResultsRequest,
	ResultsCard,
	IResultMode,
	IWord,
};
