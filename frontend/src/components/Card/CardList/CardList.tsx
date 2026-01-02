import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';

import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { getCardsStorage } from '@/redux/cardReducer/cardThunk';

import { useAppTheme } from '../../../contexts/ThemeProvider';
import {
  getCards,
  getStateCards,
  rangeCards,
  removeCard,
  removeStateCard,
} from '../../../redux/cardReducer/cardSlice';
import CardItem from '../CardItem/CardItem';

import styles from './CardList.styles';
import { selectVisibleCards } from '@/redux/cardReducer/cardSelector';
import { ICard } from '@/common/enums/types/card.type';

const MemoCardItem = memo(CardItem);

/**
 * @param groupId {string}
 * @returns {JSX.Element}
 * @constructor
 */

type CardListProps = {
  shownCards: ICard[];
  groupId: string;
};

const CardList = ({ shownCards, groupId }: CardListProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const {
    theme: { colors },
  } = useAppTheme();
  const { group } = useAppSelector((state) => state.groups);
  const { isLoading } = useAppSelector((state) => state.cards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(enqueueOrDispatch(getCards, getStateCards, { groupId }));
  }, [group, groupId]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={shownCards}
          renderItem={({ item }) => (
            <MemoCardItem
              key={item.id}
              item={item}
              onRemove={() =>
                dispatch(
                  enqueueOrDispatch(removeCard, removeStateCard, item.id),
                )
              }
              groupId={groupId}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            {
              padding: screenWidth < 620 ? 10 : 50,
              paddingBottom: 20,
            },
          ]}
        />
      )}
    </View>
  );
};

export default CardList;
