type ICard = {
	id: string;
	word: string;
	translateWord: string;
	groupId?: string;
	image?: string;
	status: string;
	learnedAt: Date;
	nextReviewAt: Date;
	reviewCount: Date;
};

type AddCardRequest = {
	word: string;
	translateWord: string;
	imageUri: string;
	groupId: string;
}

type IRepeatedGroup = {
	title: string;
	cards: string[];
};

export type { ICard, IRepeatedGroup, AddCardRequest };
