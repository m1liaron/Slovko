import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux.hooks';
import { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { useEffect } from 'react';
import { DataStatus } from '@/common/enums/app/DataStatus';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { getGroup, getGroupStorage } from '@/redux/groupReducer/groupThunk';

const useGroupScreen = (groupId: string) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();

  const { group, status } = useAppSelector((state) => state.groups);
  const { cards, filteredCards, isLoading } = useAppSelector(
    (state) => state.cards,
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
    cards,
    filteredCards,
    isLoading,
    totalCards,
    learnedCards,
    progressPercentage,
  };
};

export { useGroupScreen };
