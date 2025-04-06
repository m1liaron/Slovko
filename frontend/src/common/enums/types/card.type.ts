type ICard = {
	id: string;
	word: string;
	translateWord: string;
	groupId?: string;
	image?: CardImage;
	status: string;
	learnedAt: Date;
	nextReviewAt: Date;
	reviewCount: Date;
};

type CardImage = {
	url: string;
};

type UpdateCardRequst = {
	id: string;
	word: string;
	translateWord: string;
	groupId?: string;
	imageUri?: string;
};

type AddCardRequest = {
	word: string;
	translateWord: string;
	imageUri: string;
	groupId: string;
};

type IRepeatedGroup = {
	title: string;
	cards: string[];
};

export type { ICard, IRepeatedGroup, AddCardRequest, UpdateCardRequst };
