import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import {
  updateGroup,
  updateStateGroup,
  removeGroup,
  removeStateGroup,
} from '@/redux/groupReducer/groupSlice';
import { moveGroupToAnotherSection } from '@/redux/groupReducer/groupThunk';
import { getRepeatedCards, rangeCards } from '@/redux/cardReducer/cardSlice';
import { setActiveSectionId } from '@/redux/sectionReducer/sectionSlice';
import { AppPath } from '@/common/enums/app/app';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';

const useGroupNavigation = (groupId: string) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();
  const { cards } = useAppSelector((state) => state.cards);
  const { activeSectionId } = useAppSelector((state) => state.sections);

  const [groupTitle, setGroupTitle] = useState('');
  const [newSectionId, setNewSectionId] = useState<string>();

  const updateGroupTitle = useCallback(() => {
    if (!groupTitle) {
      console.error('Provide title');
      return;
    }
    dispatch(
      enqueueOrDispatch(updateGroup, updateStateGroup, {
        id: groupId,
        title: groupTitle,
      }),
    );
  }, [groupTitle, groupId, dispatch]);

  const handleRemoveGroup = useCallback(() => {
    dispatch(
      enqueueOrDispatch(removeGroup, removeStateGroup, {
        groupId,
        sectionId: activeSectionId,
      }),
    );
    dispatch(getRepeatedCards({ sectionId: activeSectionId }));
    navigation.navigate(AppPath.Main);
  }, [groupId, activeSectionId, dispatch, navigation]);

  const handleMoveGroup = useCallback(() => {
    if (!newSectionId) {
      Alert.alert('Please select section to move group');
      return;
    }
    dispatch(moveGroupToAnotherSection({ groupId, sectionId: newSectionId }));
    dispatch(setActiveSectionId(null));
    navigation.navigate(AppPath.Home);
  }, [newSectionId, groupId, dispatch, navigation]);

  const navigateToLearn = useCallback(
    (wordsRangeNumber: number) => {
      if (wordsRangeNumber !== cards.length) {
        dispatch(rangeCards(wordsRangeNumber));
      }
      navigation.navigate(AppPath.Learn, { groupId });
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
  };
};

export { useGroupNavigation };
