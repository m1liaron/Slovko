enum Modes {
	flashCards = 0,
	quiz = 1,
	guessWord = 2,
}

type IWord = {
	id: string;
	word: string;
	translate: string;
	mistakesAmount: number;
};

type IResultMode = {
	id: string;
	mode: Modes;
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

export type { IResult, IStatistics, ModeName };
