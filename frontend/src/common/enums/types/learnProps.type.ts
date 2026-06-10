import type { ICard } from './card.type';

interface LearnProps {
  learningCards: ICard[];
  onComplete: () => void;
  handleSetData: (card: ICard, isCorrect: boolean) => void;
}

export type { LearnProps };
