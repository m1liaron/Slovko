import { useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { addLearningMode } from '@/redux/cardReducer/cardSlice';
import { i18n } from '@/localization/i18n';
import type { LearningMode } from '@/redux/cardReducer/cardSlice';
import type BottomSheet from '@gorhom/bottom-sheet';

interface ShowModeLearning {
  text: string;
  iconName: string;
  shown: boolean;
  sectionName: LearningMode;
}

const useGroupModals = (groupId: string, wordsRangeNumber: number) => {
  const dispatch = useAppDispatch();
  const { shownModes } = useAppSelector((state) => state.cards);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModesModal, setShowModesModal] = useState(false);

  const [shownLearningModes, setShownLearningModes] = useState<
    ShowModeLearning[]
  >([
    {
      text: i18n.t('learnScreen.quizMode'),
      iconName: 'quiz',
      shown: shownModes?.quiz ?? true,
      sectionName: 'quiz',
    },
    {
      text: i18n.t('learnScreen.guessWordMode'),
      iconName: 'wordpress',
      shown: shownModes?.word ?? true,
      sectionName: 'word',
    },
    {
      text: i18n.t('learnScreen.checkTranslateMode'),
      iconName: 'checklist',
      shown: shownModes?.check ?? true,
      sectionName: 'check',
    },
  ]);

  const openEditModal = useCallback(() => setShowEditModal(true), []);
  const closeEditModal = useCallback(() => setShowEditModal(false), []);

  const openAddModal = useCallback(() => setShowAddModal(true), []);
  const closeAddModal = useCallback(() => setShowAddModal(false), []);

  const openModesModal = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(2);
    setShowModesModal(true);
  }, []);

  const closeModesModal = useCallback(() => {
    bottomSheetRef.current?.close();
    setShowModesModal(false);
  }, []);

  const onChangeLearningModeShown = useCallback(
    (index: number) => {
      setShownLearningModes((prev) =>
        prev.map((mode, i) =>
          i === index ? { ...mode, shown: !mode.shown } : mode,
        ),
      );
      dispatch(
        addLearningMode({ sectionName: shownLearningModes[index].sectionName }),
      );
    },
    [shownLearningModes, dispatch],
  );

  return {
    showEditModal,
    showAddModal,
    showModesModal,
    shownLearningModes,
    bottomSheetRef,
    openEditModal,
    closeEditModal,
    openAddModal,
    closeAddModal,
    openModesModal,
    closeModesModal,
    onChangeLearningModeShown,
  };
};

export { useGroupModals };
