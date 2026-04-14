import React, { memo, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';

import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';

import { useAppTheme } from '../../../contexts/ThemeProvider';
import {
  getCards,
  removeCard,
  removeStateCard,
} from '../../../redux/cardReducer/cardSlice';
import CardItem from '../CardItem/CardItem';

import styles from './CardList.styles';
import { ICard } from '@/common/enums/types/card.type';
import { DataStatus } from '@/common/enums/app/DataStatus';

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
  const { width: screenWidth, height } = useWindowDimensions();

  const {
    theme: { colors },
  } = useAppTheme();
  const { status } = useAppSelector((state) => state.cards);
  const dispatch = useAppDispatch();
  const isLoading = status === DataStatus.PENDING;

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
              height: height / 2,
              padding: screenWidth < 620 ? 20 : 50,
              paddingBottom: 20,
            },
          ]}
        />
      )}
    </View>
  );
};

export default CardList;
