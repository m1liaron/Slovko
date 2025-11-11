import noCardsImage from '@/assets/images/no-cards.png';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { getCardsStorage } from '@/redux/cardReducer/cardThunk';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import AddButton from '../../../common/components/AddButton/AddButton';
import PressableButton from '../../../common/components/PressableButton/PressableButton';
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

import { AddCardModal } from '@/components/Modals/AddCardModal/AddCardModal';

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

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
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

  const renderFooter = () => (
    <View
      style={{
        paddingVertical: 20,
        paddingHorizontal: screenWidth < 620 ? 10 : 50,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {cards.length > 1 && (
          <PressableButton
            onPress={navigateToLearn}
            text={i18n.t('group.cardList.learnButton')}
            buttonStyle={{ flex: 1 }}
          />
        )}
        <AddButton onPress={() => setShowAddModal(true)} />
      </View>
    </View>
  );

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
            styles.listContainer,
            {
              padding: screenWidth < 620 ? 10 : 50,
              paddingBottom: 20, // Reduced since footer has its own padding
              height: Platform.OS === 'web' ? 550 : 'auto',
            },
          ]}
          numColumns={1}
          ListFooterComponent={renderFooter}
        />
      )}

      <AddCardModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        groupId={groupId}
      />
    </View>
  );
};

export default CardList;
