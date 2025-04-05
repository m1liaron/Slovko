import { IUser } from "./user.type";

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
    user?: IUser;
    createdAt: Date;
}

export { ISharedGroup };