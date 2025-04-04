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

export type IStreakDate = {
    id: string;
    date: string;
    frozen: boolean;
    userId?: string;
}