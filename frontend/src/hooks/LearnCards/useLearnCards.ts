import { useState, useCallback } from 'react';

import type { ICard } from '@/common/enums/types/card.type';

const useLearnCards = (
  initialCards: ICard[],
  setFlashCards: (card: ICard, isCorrect: boolean) => void,
) => {
  const [learningCards, setLearningCards] = useState<ICard[]>([
    ...initialCards,
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  const [isTranslateShow, setIsTranslateShow] = useState(false);
  const [showLeftSwipeView, setShowLeftSwipeView] = useState(false);
  const [showRightSwipeView, setShowRightSwipeView] = useState(false);

  const incrementCardIndex = useCallback(() => {
    setCurrentCardIndex((prevIndex) => prevIndex + 1);
  }, []);

  const handleSwipeRight = useCallback(() => {
    setShowRightSwipeView(true);
    setTimeout(() => setShowRightSwipeView(false), 1000);

    incrementCardIndex();
    setFlashCards(learningCards[currentCardIndex], true);
    setIsTranslateShow((prev) => !prev);
  }, [currentCardIndex, learningCards, setFlashCards, incrementCardIndex]);

  const handleSwipeLeft = useCallback(
    (index: number) => {
      setShowLeftSwipeView(true);
      setTimeout(() => setShowLeftSwipeView(false), 1000);

      const currentCard = learningCards[index];
      setLearningCards((prev) => [...prev, currentCard]);

      incrementCardIndex();
      setFlashCards(learningCards[currentCardIndex], false);
      setIsTranslateShow((prev) => !prev);
    },
    [currentCardIndex, learningCards, setFlashCards, incrementCardIndex],
  );

  return {
    learningCards,
    currentCardIndex,
    isHorizontalSwipe,
    isTranslateShow,
    showLeftSwipeView,
    showRightSwipeView,
    setIsHorizontalSwipe,
    setIsTranslateShow,
    handleSwipeRight,
    handleSwipeLeft,
  };
};

export { useLearnCards };
