import { useMemo } from 'react';

import type { LearnSessionData } from '@/common/enums/types/learn.types';

export const useLearnSession = (sessionData: LearnSessionData) => {
  const resultsData = useMemo(
    () => [
      ...sessionData.flashCards,
      ...sessionData.quizCards,
      ...sessionData.guessWordCards,
      ...sessionData.checkCards,
    ],
    [sessionData],
  );

  const correctAnswersAmount = useMemo(
    () => resultsData.filter((item) => item.mistakesAmount === 0).length,
    [resultsData],
  );

  const accuracy = useMemo(
    () =>
      resultsData.length > 0
        ? Math.floor((correctAnswersAmount / resultsData.length) * 100)
        : 0,
    [resultsData.length, correctAnswersAmount],
  );

  return {
    resultsData,
    correctAnswersAmount,
    accuracy,
  };
};
