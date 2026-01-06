import { useNavigation } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

import { AppPath } from '@/common/enums/app/app';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { getRepeatedCards, rangeCards } from '@/redux/cardReducer/cardSlice';
import {
  updateGroup,
  updateStateGroup,
  removeGroup,
  removeStateGroup,
  moveStateGroupToAnotherSection,
} from '@/redux/groupReducer/groupSlice';
import { moveGroupToAnotherSection } from '@/redux/groupReducer/groupThunk';
import { setActiveSection } from '@/redux/sectionReducer/sectionSlice';

const useGroupNavigation = (
  groupId: string,
  setShowModesModal: (item: boolean) => void,
) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();
  const { cards } = useAppSelector((state) => state.cards);
  const { activeSection } = useAppSelector((state) => state.sections);
  const activeSectionId = activeSection?.id;

  const [groupTitle, setGroupTitle] = useState('');
  const [newSectionId, setNewSectionId] = useState<string>();
  const [showSectionList, setShowSectionList] = useState(false);

  const toggleSectionList = useCallback(() => {
    setShowSectionList((prev) => !prev);
  }, []);

  const updateGroupTitle = useCallback(() => {
    if (!groupTitle) {
      console.error('Provide title');
      return;
    }
    if (activeSectionId) {
      dispatch(
        enqueueOrDispatch(updateGroup, updateStateGroup, {
          id: groupId,
          title: groupTitle,
          sectionId: activeSectionId,
        }),
      );
    }
  }, [groupTitle, groupId, dispatch]);

  const handleRemoveGroup = useCallback(() => {
    if (activeSectionId) {
      dispatch(
        enqueueOrDispatch(removeGroup, removeStateGroup, {
          groupId,
          sectionId: activeSectionId,
        }),
      );
      dispatch(getRepeatedCards({ sectionId: activeSectionId }));
      navigation.navigate(AppPath.Main);
    }
  }, [groupId, activeSectionId, dispatch, navigation]);

  const handleMoveGroup = useCallback(() => {
    if (!newSectionId) {
      Alert.alert('Please select section to move group');
      return;
    }
    dispatch(
      enqueueOrDispatch(
        moveGroupToAnotherSection,
        moveStateGroupToAnotherSection,
        { groupId, sectionId: newSectionId },
      ),
    );
    navigation.navigate(AppPath.Main);
  }, [newSectionId, groupId, dispatch, navigation]);

  const navigateToLearn = useCallback(
    (wordsRangeNumber: number) => {
      if (wordsRangeNumber !== cards.length) {
        dispatch(rangeCards(wordsRangeNumber));
      }
      navigation.navigate(AppPath.Learn, { groupId });
      setShowModesModal(false);
    },
    [cards.length, groupId, dispatch, navigation],
  );

  return {
    groupTitle,
    newSectionId,
    setGroupTitle,
    setNewSectionId,
    updateGroupTitle,
    handleRemoveGroup,
    handleMoveGroup,
    navigateToLearn,
    showSectionList,
    toggleSectionList,
  };
};

export { useGroupNavigation };
