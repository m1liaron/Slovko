import React, { useRef } from 'react';
import { View } from 'react-native';
import type Swiper from 'react-native-deck-swiper';

import type { ICard } from '@/common/enums/types/card.type';
import { useResponsive } from '@/hooks';
import { useCardFlip, useLearnCards, useTypeMode } from '@/hooks/LearnCards';
import { useAppSelector } from '@/hooks/redux.hooks';
import { selectCard } from '@/redux/cardReducer/cardSlice';

import { AnswerInput } from './components/AnswerInput.tsx/AnswerInput';
import { CardSwiper } from './components/CardSwiper/CardSwiper';
import { TypeModeToggle } from './components/TypeModeToggle/TypeModeToggle';

interface LearnCardsProps {
  onComplete: () => void;
  setFlashCards: (card: ICard, isCorrect: boolean) => void;
}

const LearnCards: React.FC<LearnCardsProps> = ({
  onComplete,
  setFlashCards,
}) => {
  const cards = useAppSelector(selectCard);
  const swiperRef = useRef<Swiper<ICard>>(null);

  const { isMobile, isDesktop } = useResponsive();

  const cardWidth = isMobile ? '90%' : isDesktop ? '70%' : '50%';
  const cardHeight = isMobile ? '70%' : '75%';

  const {
    learningCards,
    currentCardIndex,
    isHorizontalSwipe,
    handleSwipeRight,
    handleSwipeLeft,
  } = useLearnCards(cards, setFlashCards);

  const {
    flippedCards,
    handleFlipCard,
    frontAnimatedStyle,
    backAnimatedStyle,
  } = useCardFlip(learningCards);

  const {
    showTypeMode,
    valueAnswer,
    placeholderColor,
    toggleTypeMode,
    handleAnswerChange,
    checkAnswer,
  } = useTypeMode(learningCards, currentCardIndex, swiperRef, handleFlipCard);

  const backCardAnswerLength =
    learningCards[currentCardIndex]?.[showTypeMode ? 'word' : 'translateWord']
      ?.length || 0;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TypeModeToggle typeMode={showTypeMode} onToggle={toggleTypeMode} />

      <CardSwiper
        ref={swiperRef}
        cards={learningCards}
        currentCardIndex={currentCardIndex}
        showTypeMode={showTypeMode}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        isHorizontalSwipe={isHorizontalSwipe}
        flippedCards={flippedCards}
        frontAnimatedStyle={frontAnimatedStyle}
        backAnimatedStyle={backAnimatedStyle}
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        onComplete={onComplete}
        onFlipCard={handleFlipCard}
      />

      {showTypeMode && (
        <AnswerInput
          valueAnswer={valueAnswer}
          backCardAnswerLength={backCardAnswerLength}
          placeholderColor={placeholderColor}
          onAnswerChange={handleAnswerChange}
          onCheckAnswer={checkAnswer}
        />
      )}
    </View>
  );
};

export default LearnCards;
