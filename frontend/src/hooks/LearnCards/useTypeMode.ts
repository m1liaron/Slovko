import { useState, useCallback, useRef } from 'react';
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
) => {
  const {
    theme: { colors },
  } = useAppTheme();

  const [showTypeMode, setShowTypeMode] = useState(true);
  const [valueAnswer, setValueAnswer] = useState('');
  const [placeholderColor, setPlaceholderColor] = useState(colors.lightText);
  const [isTranslateShow, setIsTranslateShow] = useState(false);

  const checkTimerRef = useRef<NodeJS.Timeout>();
  const resetTimerRef = useRef<NodeJS.Timeout>();

  const clearTimers = useCallback(() => {
    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current);
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  }, []);

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

    handleFlipCard(currentCardIndex);

    clearTimers();

    checkTimerRef.current = setTimeout(() => {
      const correctAnswer =
        currentCard[isTranslateShow ? 'word' : 'translateWord'];
      const isCorrect =
        valueAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

      if (isCorrect) {
        swiperRef.current?.swipeRight();
        setPlaceholderColor('#62c485');
      } else {
        swiperRef.current?.swipeLeft();
        setPlaceholderColor('#ff1100');
      }

      setValueAnswer('');
    }, 1000);

    setIsTranslateShow((prev) => !prev);
    resetTimerRef.current = setTimeout(() => {
      setPlaceholderColor(colors.primary);
    }, 1100);
  }, [
    valueAnswer,
    learningCards,
    currentCardIndex,
    showTypeMode,
    handleFlipCard,
    swiperRef,
    colors.primary,
    clearTimers,
  ]);

  return {
    showTypeMode,
    valueAnswer,
    placeholderColor,
    toggleTypeMode,
    handleAnswerChange,
    checkAnswer,
  };
};
