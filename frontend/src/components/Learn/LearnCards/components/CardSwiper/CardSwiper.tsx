import React, { forwardRef } from 'react';
import type { ViewStyle } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import type { AnimatedStyleProp } from 'react-native-reanimated';

import type { ICard } from '@/common/enums/types/card.type';

import { FlashCard } from '../FlashCard/FlashCard';

interface CardSwiperProps {
  cards: ICard[];
  currentCardIndex: number;
  cardWidth: string;
  cardHeight: string;
  showTypeMode: boolean;
  isHorizontalSwipe: boolean;
  flippedCards: Record<string, boolean>;
  frontAnimatedStyle: AnimatedStyleProp<ViewStyle>;
  backAnimatedStyle: AnimatedStyleProp<ViewStyle>;
  onSwipeRight: () => void;
  onSwipeLeft: (index: number) => void;
  onComplete: () => void;
  onFlipCard: (index: number) => void;
  answerResults: Record<string, boolean | null>;
  handleSwipe: (cardIndex: number) => void;
}

export const CardSwiper = forwardRef<Swiper<ICard>, CardSwiperProps>(
  (
    {
      cards,
      currentCardIndex,
      showTypeMode,
      isHorizontalSwipe,
      frontAnimatedStyle,
      backAnimatedStyle,
      onSwipeRight,
      onSwipeLeft,
      onComplete,
      onFlipCard,
      answerResults,
      handleSwipe,
    },
    ref,
  ) => {
    return (
      <Swiper
        key={`${currentCardIndex}-${answerResults[cards[currentCardIndex]?.id || '']}`}
        ref={ref}
        cards={cards}
        renderCard={(card, index) => (
          <FlashCard
            card={card}
            index={index}
            typeMode={showTypeMode}
            frontAnimatedStyle={frontAnimatedStyle}
            backAnimatedStyle={backAnimatedStyle}
            onFlipCard={onFlipCard}
            isAnswerCorrect={answerResults[card.id] ?? null}
          />
        )}
        keyExtractor={(card) => card.id}
        onSwipedRight={onSwipeRight}
        onSwipedLeft={onSwipeLeft}
        onSwipedAll={onComplete}
        onSwiped={handleSwipe}
        stackSize={3}
        cardIndex={currentCardIndex}
        backgroundColor="transparent"
        verticalSwipe={false}
        horizontalSwipe={showTypeMode ? isHorizontalSwipe : true}
      />
    );
  },
);

CardSwiper.displayName = 'CardSwiper';
