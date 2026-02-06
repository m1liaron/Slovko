import { useState, useCallback } from 'react';
import type { RefObject } from 'react';
import type Swiper from 'react-native-deck-swiper';
import Toast from 'react-native-toast-message';

import type { ICard } from '@/common/enums/types/card.type';
import { useAppTheme } from '@/contexts/ThemeProvider';

export const useTypeMode = (
  learningCards: ICard[],
  currentCardIndex: number,
  swiperRef: RefObject<Swiper<ICard>>,
  handleFlipCard: (index: number) => void,
  setAnswerResults: React.Dispatch<
    React.SetStateAction<Record<string, boolean | null>>
  >,
) => {
  const {
    theme: { colors },
  } = useAppTheme();

  const [showTypeMode, setShowTypeMode] = useState(true);
  const [valueAnswer, setValueAnswer] = useState('');
  const [placeholderColor, setPlaceholderColor] = useState(colors.lightText);
  const [isTranslateShow, setIsTranslateShow] = useState(false);
  const [isCardAnswered, setIsCardAnswered] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const toggleTypeMode = () => {
    setShowTypeMode((prev) => !prev);
  };

  const handleAnswerChange = useCallback((text: string) => {
    setValueAnswer(text);
  }, []);

  const checkAnswer = useCallback(() => {
    if (valueAnswer.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Fail',
        text2: 'Input must be filled',
      });
      return;
    }

    const currentCard = learningCards[currentCardIndex];
    if (!currentCard) return;

    const correctAnswer =
      currentCard[isTranslateShow ? 'word' : 'translateWord'];

    const isCorrect =
      valueAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
    setAnswerResults((prev) => ({
      ...prev,
      [currentCard.id]: isCorrect,
    }));

    if (isCardAnswered) {
      if (isCorrect) {
        swiperRef.current?.swipeRight();
      } else {
        swiperRef.current?.swipeLeft();
      }
      setAnswerResults((prev) => ({
        ...prev,
        [currentCard.id]: null,
      }));
      setValueAnswer('');
      setIsCardAnswered(false);
    }

    handleFlipCard(currentCardIndex);

    if (!isCardAnswered) {
      setIsCardAnswered(true);
    }

    setIsTranslateShow((prev) => !prev);
  }, [
    valueAnswer,
    learningCards,
    currentCardIndex,
    showTypeMode,
    handleFlipCard,
    swiperRef,
    colors.primary,
  ]);

  return {
    showTypeMode,
    valueAnswer,
    placeholderColor,
    toggleTypeMode,
    handleAnswerChange,
    checkAnswer,
    isTranslateShow,
    isCardAnswered,
    isAnswerCorrect,
  };
};
