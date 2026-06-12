import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import { DataStatus } from '@/common/enums/app/DataStatus';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { selectVisibleCardsByGroup } from '@/redux/cardReducer/cardSelector';
import { getGroup, getGroupStorage } from '@/redux/groupReducer/groupThunk';

import { useAppDispatch, useAppSelector } from '../redux.hooks';

const useGroupScreen = (groupId: string) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();

  const { group, status, groups } = useAppSelector((state) => state.groups);
  const cards = useAppSelector((state) =>
    selectVisibleCardsByGroup(state, groupId),
  );

  useEffect(() => {
    if (!groupId && status === DataStatus.ERROR) {
      navigation.goBack();
    }
  }, [groupId, status, navigation]);

  useEffect(() => {
    if (!group || group.id !== groupId) {
      dispatch(enqueueOrDispatch(getGroupStorage, getGroup, { groupId }));
    }
  }, [group, groupId, dispatch]);

  const totalCards = cards?.length || 0;
  const learnedCards = group?.learnedCount || 0;
  const progressPercentage =
    totalCards > 0 ? (learnedCards / totalCards) * 100 : 0;

  return {
    group,
    groups,
    totalCards,
    learnedCards,
    progressPercentage,
  };
};

export { useGroupScreen };
