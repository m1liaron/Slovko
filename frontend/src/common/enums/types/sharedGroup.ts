type ISharedCard = {
    id: string;
    word: string;
    translateWord: string;
    sharedGroupId?: string;
}

type ISharedGroup = {
    id: string;
    title: string;
    userId?: string;
    sharedCards: ISharedCard[];
}

export { ISharedGroup };