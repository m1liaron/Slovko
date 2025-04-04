type ICard = {
    id: string;
    word: string;
    translateWord: string;
    groupId?: string;
    image?:string;
    status: string;
    learnedAt: Date;
    nextReviewAt: Date;
    reviewCount: Date;
}

export { ICard };