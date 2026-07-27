import { useNavigation } from '@react-navigation/native';
import { useState, useCallback, useEffect } from 'react';

import { AppPath } from '@/common/enums/app/app';
import type {
  ICard,
  LearnSessionData,
  ResultsCard,
  Section,
} from '@/common/enums/types/types';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { selectVisibleCardsByGroup } from '@/redux/cardReducer/cardSelector';
import {
  getRepeatedCards,
  updateCardsAfterLearn,
} from '@/redux/cardReducer/cardSlice';
import { selectGroup } from '@/redux/groupReducer/groupSlice';
import { addStateResult, saveResults } from '@/redux/resultReducer/resultSlice';
import { updateUserStreak } from '@/redux/userReducer/userSlice';
import { formatTime } from '@/utils/formatTime/formatTime';

export const useLearnScreen = (groupId: string) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();

  const learningCards = useAppSelector((state) =>
    selectVisibleCardsByGroup(state),
  );
  const { user } = useAppSelector((state) => state.user);
  const groups = useAppSelector(selectGroup);
  const { repeatedCards, status, shownModes } = useAppSelector(
    (state) => state.cards,
  );
  const { activeSection } = useAppSelector((state) => state.sections);
  const activeSectionId = activeSection?.id;

  // Derive enabled modes from shownModes
  const enabledModes: Section[] = [
    'cards',
    ...Object.entries(shownModes)
      .filter(([mode, isEnabled]) => mode !== 'cards' && isEnabled)
      .map(([mode]) => mode as Section),
  ];

  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<Section>('cards');
  const [isLessonOver, setIsLessonOver] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startLearnDate] = useState(() => new Date());
  const [elapsedTime, setElapsedTime] = useState('');

  // Session data
  const [sessionData, setSessionData] = useState<LearnSessionData>({
    flashCards: [],
    quizCards: [],
    guessWordCards: [],
    checkCards: [],
  });

  const projectName = groups?.find((group) => group.id === groupId)?.title;

  const updateCardData = useCallback(
    (sectionKey: keyof LearnSessionData, card: ICard, isCorrect: boolean) => {
      setSessionData((prev) => {
        const currentCards = prev[sectionKey];
        const existingCardIndex = currentCards.findIndex(
          (item) => item.wordId === card.id,
        );

        const newCard: ResultsCard = {
          wordId: card.id,
          word: card.word,
          translateWord: card.translateWord,
          mistakesAmount: isCorrect ? 0 : 1,
        };

        if (existingCardIndex !== -1) {
          if (isCorrect) return prev;

          const updatedCards = [...currentCards];
          updatedCards[existingCardIndex] = {
            ...updatedCards[existingCardIndex],
            mistakesAmount: updatedCards[existingCardIndex].mistakesAmount + 1,
          };

          return {
            ...prev,
            [sectionKey]: updatedCards,
          };
        }

        return {
          ...prev,
          [sectionKey]: [...currentCards, newCard],
        };
      });
    },
    [],
  );

  const handleSetData = useCallback(
    (card: ICard, isCorrect: boolean) => {
      const sectionKeyMap: Record<Section, keyof LearnSessionData> = {
        cards: 'flashCards',
        quiz: 'quizCards',
        word: 'guessWordCards',
        check: 'checkCards',
      };

      const sectionKey = sectionKeyMap[currentSection];
      if (sectionKey) {
        updateCardData(sectionKey, card, isCorrect);
      }
    },
    [currentSection, updateCardData],
  );

  const saveResultsData = useCallback(() => {
    const resultData = {
      title: projectName || new Date().toString(),
      userId: user?.id,
      flashCards: sessionData.flashCards,
      quiz: sessionData.quizCards,
      guessWord: sessionData.guessWordCards,
      checkTranslate: sessionData.checkCards,
      startedLearn: startLearnDate.toISOString(),
      completionTime: new Date().toISOString(),
    };

    dispatch(enqueueOrDispatch(saveResults, addStateResult, resultData));
  }, [projectName, sessionData, startLearnDate, dispatch]);

  const finishLesson = useCallback(() => {
    setIsLessonOver(true);

    const endLearnDate = new Date().getTime();
    const totalLearnedTime = endLearnDate - startLearnDate.getTime();
    setElapsedTime(formatTime(totalLearnedTime));

    const repeatedCardsIds = repeatedCards?.map((card) => card.id);
    dispatch(enqueueOrDispatch(updateCardsAfterLearn, repeatedCardsIds));
    dispatch(enqueueOrDispatch(updateUserStreak, {}));

    saveResultsData();

    if (repeatedCards.length && activeSectionId) {
      dispatch(
        enqueueOrDispatch(getRepeatedCards, { sectionId: activeSectionId }),
      );
    }
  }, [
    startLearnDate,
    repeatedCards,
    activeSectionId,
    saveResultsData,
    dispatch,
  ]);

  const handleNextSection = useCallback(() => {
    const nextSectionIndex = currentSectionIndex + 1;

    if (nextSectionIndex >= enabledModes.length) {
      finishLesson();
    } else {
      const nextSection = enabledModes[nextSectionIndex];
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentSection(nextSection);
    }
  }, [currentSectionIndex, enabledModes, finishLesson]);

  const leaveStudy = useCallback(() => {
    navigation.navigate(AppPath.Main);
  }, [navigation]);

  return {
    learningCards,
    status,
    currentSection,
    isLessonOver,
    showExitModal,
    sessionData,
    elapsedTime,
    setShowExitModal,
    handleNextSection,
    handleSetData,
    leaveStudy,
  };
};
