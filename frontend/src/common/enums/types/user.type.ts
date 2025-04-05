export type IUser = {
    id: string;
    name: string;
    image?: string;
    email: string;
    streak: number;
    lastReviewAt: Date;
    points: number;
    frozen: boolean;
}

export type RegisterUser = {
    name: string;
    email: string;
}

export type IUpdateUser = {
    image: string;
    name: string;
    email: string;
}

export type IStreakDate = {
    id: string;
    date: string;
    frozen: boolean;
    userId?: string;
}