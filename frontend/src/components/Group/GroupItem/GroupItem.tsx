import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { removeCard, removeStateCard } from '@/redux/cardReducer/cardSlice';
import { Entypo, SimpleLineIcons } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';
import { useCallback } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import {
  removeGroup,
  removeStateGroup,
} from '../../../redux/groupReducer/groupSlice';
import styles from './Group.styles';

interface GroupItemProps {
  item: {
    id: string;
    title: string;
  };
}

export const GroupItem = ({ item: { id, title } }: GroupItemProps) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();
  const { globalCards } = useAppSelector((state) => state.cards);

  const handleRemoveGroup = useCallback(() => {
    // Don't call dispatch directly in render - wrap in async function
    const performRemove = async () => {
      try {
        await dispatch(enqueueOrDispatch(removeGroup, removeStateGroup, id));
        const groupsCards = globalCards.filter((card) => card.groupId === id);
        for (const card of groupsCards) {
          dispatch(enqueueOrDispatch(removeCard, removeStateCard, card.id));
        }
      } catch (error) {
        console.error('Failed to remove group:', error);
      }
    };

    performRemove();
  }, [dispatch, id, globalCards.filter]);

  return (
    <Link
      key={id}
      style={[
        styles.item,
        { borderColor: colors.lightBackground, shadowColor: colors.primary },
      ]}
      to={{ screen: 'group', params: { groupId: id } }}
    >
      <Text style={{ fontSize: 30, color: colors.primary }}>{title}</Text>
      <SimpleLineIcons name="arrow-right" size={30} color={colors.primary} />
    </Link>
  );
};
