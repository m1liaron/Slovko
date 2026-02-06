import { useState, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import type Swiper from 'react-native-deck-swiper';
import Toast from 'react-native-toast-message';

import type { ICard } from '@/common/enums/types/card.type';

export const useTypeMode = (
  learningCards: ICard[],
  currentCardIndex: number,
  swiperRef: RefObject<Swiper<ICard>>,
  handleFlipCard: (index: number) => void,
  answerResults: Record<string, boolean | null>,
  setAnswerResults: React.Dispatch<
    React.SetStateAction<Record<string, boolean | null>>
  >,
) => {
  const [showTypeMode, setShowTypeMode] = useState(true);
  const [valueAnswer, setValueAnswer] = useState('');
  const [answerSide, setAnswerSide] = useState<'word' | 'translateWord'>(
    'translateWord',
  );
  const [isCardAnswered, setIsCardAnswered] = useState(false);

  useEffect(() => {
    if (showTypeMode && currentCardIndex !== 0) {
      setAnswerSide('translateWord');
      handleFlipCard(currentCardIndex);
      setIsCardAnswered(false);
      setValueAnswer('');
    }
  }, [showTypeMode]);

  const toggleTypeMode = () => {
    setShowTypeMode((prev) => !prev);
  };

  const handleAnswerChange = useCallback((text: string) => {
    setValueAnswer(text);
  }, []);

  const handleSwipe = (cardIndex: number) => {
    const card = learningCards[cardIndex];
    if (!card) return;

    setAnswerResults((prev) => ({
      ...prev,
      [card.id]: null,
    }));
  };

  const checkAnswer = useCallback(() => {
    if (valueAnswer.trim().length === 0 && !isCardAnswered) {
      Toast.show({
        type: 'error',
        text1: 'Fail',
        text2: 'Input must be filled',
      });
      return;
    }

    const currentCard = learningCards[currentCardIndex];
    if (!currentCard) return;

    if (!isCardAnswered) {
      const correctAnswer = currentCard[answerSide];

      const isCorrect =
        valueAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

      setAnswerResults((prev) => ({
        ...prev,
        [currentCard.id]: isCorrect,
      }));

      handleFlipCard(currentCardIndex);
      setAnswerSide((prev) => (prev === 'word' ? 'translateWord' : 'word'));
      setIsCardAnswered(true);
      return;
    }
    const result = answerResults[currentCard.id];

    if (result === true) {
      swiperRef.current?.swipeRight();
    } else {
      swiperRef.current?.swipeLeft();
    }

    setValueAnswer('');
    setIsCardAnswered(false);
  }, [
    valueAnswer,
    learningCards,
    currentCardIndex,
    handleFlipCard,
    swiperRef,
    answerResults,
    isCardAnswered,
    answerSide,
  ]);

  return {
    showTypeMode,
    valueAnswer,
    toggleTypeMode,
    handleAnswerChange,
    checkAnswer,
    answerSide,
    isCardAnswered,
    handleSwipe,
  };
};
