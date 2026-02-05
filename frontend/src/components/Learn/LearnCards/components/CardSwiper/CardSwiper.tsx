import React, { forwardRef } from 'react';
import Swiper from 'react-native-deck-swiper';
import type { ICard } from '@/common/enums/types/card.type';
import type { AnimatedStyleProp } from 'react-native-reanimated';
import { FlashCard } from '../FlashCard/FlashCard';
import { ViewStyle } from 'react-native';

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
  isAnswerCorrect: boolean | null;
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
      isAnswerCorrect,
    },
    ref,
  ) => {
    return (
      <Swiper
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
            isAnswerCorrect={isAnswerCorrect}
          />
        )}
        keyExtractor={(card) => card.id}
        onSwipedRight={onSwipeRight}
        onSwipedLeft={onSwipeLeft}
        onSwipedAll={onComplete}
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
