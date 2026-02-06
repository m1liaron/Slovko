type ICard = {
  id: string;
  word: string;
  translateWord: string;
  definition: string;
  example: string;
  groupId?: string;
  image?: CardImage;
  status: string;
  learnedAt: Date;
  nextReviewAt: Date;
  reviewCount: number;
  createdAt: Date;
};

type CardImage = {
  url: string;
};

type UpdateCardRequest = {
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

export type { ICard, IRepeatedGroup, AddCardRequest, UpdateCardRequest };
