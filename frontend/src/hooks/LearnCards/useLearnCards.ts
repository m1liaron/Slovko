import { useState, useCallback } from 'react';

import type { ICard } from '@/common/enums/types/card.type';

const useLearnCards = (
  initialCards: ICard[],
  setFlashCards: (card: ICard, isCorrect: boolean) => void,
) => {
  const sortedWords = [...initialCards].sort(() => Math.random() - 0.5);
  const [learnedWordsIdes, setLearnedWordsIdes] = useState<number[]>([]);
  const [learningCards, setLearningCards] = useState<ICard[]>(sortedWords);
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
    if (!learnedWordsIdes.includes(currentCardIndex)) {
      setLearnedWordsIdes((prev) => [...prev, currentCardIndex]);
    }
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
    learnedWordsIdes,
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
