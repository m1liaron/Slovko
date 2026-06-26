interface WordResultAttributes {
    mistakesAmount: number;
}

interface ResultModeAttributes {
    mode: string;
    words: WordResultAttributes[];
}

interface ResultAttributes {
    createdAt: Date;
    mode?: ResultModeAttributes[];
}


export type { WordResultAttributes, ResultModeAttributes, ResultAttributes }