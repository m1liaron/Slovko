import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';

import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { getCardsStorage } from '@/redux/cardReducer/cardThunk';

import { AppPath } from '../../../common/enums/app/app';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import {
  getCards,
  rangeCards,
  removeCard,
  removeStateCard,
} from '../../../redux/cardReducer/cardSlice';
import CardItem from '../CardItem/CardItem';

import styles from './CardList.styles';


const MemoCardItem = memo(CardItem);

/**
 * @param groupId {string}
 * @returns {JSX.Element}
 * @constructor
 */

type CardListProps = {
  groupId: string;
};

const CardList = ({ groupId }: CardListProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const {
    theme: { colors },
  } = useAppTheme();
  const { group } = useAppSelector((state) => state.groups);
  const { cards = [], isLoading } = useAppSelector((state) => state.cards);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();

  const [wordsRangeNumber, setWordsRangeNumber] = useState<number>(
    cards?.length || 2,
  );

  useEffect(() => {
    setWordsRangeNumber(cards?.length);
  }, [cards?.length]);

  useEffect(() => {
    dispatch(enqueueOrDispatch(getCards, getCardsStorage, { groupId }));
  }, [group, groupId]);

  const navigateToLearn = () => {
    if (wordsRangeNumber !== cards.length) {
      dispatch(rangeCards(wordsRangeNumber));
    }
    navigation.navigate(AppPath.Learn, { groupId });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={cards}
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
