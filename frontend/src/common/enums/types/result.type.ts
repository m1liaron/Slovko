enum Modes { flashCards, quiz, guessWord }

type IWord = {
    id: string;
    word: string;
    translate: string;
    mistakesAmount: number;
}

type IResultMode = {
    id: string;
    mode: Modes;
    resultId?: string;
    words: IWord[]
}

type IResult = {
    id: string;
    title: string;
    userId?: string;
    startedLearn: Date;
    completionTime: Date;
    mode: IResultMode[]
}

export { IResult };