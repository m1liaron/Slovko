import { useState, useCallback } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { ICard } from '@/common/enums/types/card.type';

export const useCardFlip = (cards: ICard[]) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const rotation = useSharedValue(0);

  const handleFlipCard = useCallback(
    (index: number) => {
      setFlippedCards((prevFlippedCards) => {
        if (prevFlippedCards[index]) {
          return prevFlippedCards;
        }

        setFlippedIndex(index === flippedIndex ? null : index);
        rotation.value = withTiming(rotation.value === 0 ? 180 : 0, {
          duration: 500,
        });

        return { ...prevFlippedCards, [index]: true };
      });
    },
    [flippedIndex, rotation, cards],
  );

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        {
          rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        {
          rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  return {
    rotation,
    flippedIndex,
    flippedCards,
    handleFlipCard,
    frontAnimatedStyle,
    backAnimatedStyle,
  };
};
