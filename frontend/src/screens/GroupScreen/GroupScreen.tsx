import ThemeText from '@/common/components/ThemeText/ThemeText';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type {
  RootStackParamList,
  StackNavigation,
} from '@/navigation/ProtectedRoute/ProtectedRoute';
import { getGroupStorage } from '@/redux/groupReducer/groupThunk';
import type { RootState } from '@/redux/store';
import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AddInput from '../../common/components/AddInput/AddInput';
import PressableButton from '../../common/components/PressableButton/PressableButton';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import { AppPath, DataStatus } from '../../common/enums/app/app';
import BackButton from '../../components/BackButton/BackButton';
import CardList from '../../components/Card/CardList/CardList';
import DefaultModal from '../../components/DefaultModal/DefaultModal';
import { useAppTheme } from '../../contexts/ThemeProvider';
import {
  filterCardsByStatus,
  rangeCards,
  resetFilter,
  selectCard,
  sortCards,
} from '../../redux/cardReducer/cardSlice';
import {
  getGroup,
  removeGroup,
  removeStateGroup,
  updateGroup,
  updateStateGroup,
} from '../../redux/groupReducer/groupSlice';
import Slider from '@react-native-community/slider';
import { Select } from '@/common/components/Select/Select';

type GroupScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.Group
>;

const GroupScreen: React.FC<GroupScreenProps> = ({ route }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { groupId } = route.params as { groupId: string };
  const { group, status } = useAppSelector((state) => state.groups);
  const { cards, filteredCards } = useAppSelector((state) => state.cards);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [groupTitle, setGroupTitle] = useState<string>('');
  const [nextReviewSort, setNextReviewSort] = useState<'asc' | 'desc'>('asc'); // asc || desc
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [wordsRangeNumber, setWordsRangeNumber] = useState<number>(
    cards?.length || 2,
  );
  const [sort, setSort] = useState('date');

  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();

  if (!groupId && status === DataStatus.ERROR) {
    navigation.goBack();
  }

  useEffect(() => {
    if (!group || group.id !== groupId) {
      dispatch(enqueueOrDispatch(getGroupStorage, getGroup, { groupId }));
    }
  }, [group, groupId, dispatch]);

  const statusCardsButtons = useMemo(() => {
    if (!group) return [];
    return [
      {
        title: i18n.t('group.studying'),
        status: 'To Learn',
        amount: group.learnToCardsAmount || 0,
        color: '#32C74D',
      },
      {
        title: i18n.t('group.reviewed'),
        status: 'Learned',
        amount: group.learnedCardsAmount || 0,
        color: '#62CBE9',
      },
      {
        title: i18n.t('group.known'),
        status: 'Know',
        amount: group.knowCardsAmount || 0,
        color: '#a8a800',
      },
    ];
  }, [group]);

  const RenderStatusButtons = () => {
    return statusCardsButtons.map(({ status, title, amount, color }) => (
      <Pressable
        key={title}
        style={{
          padding: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: color,
          marginHorizontal: 10,
          alignItems: 'center',
        }}
        onPress={() => dispatch(filterCardsByStatus({ status }))}
      >
        <Text style={{ color, fontWeight: 'bold' }}>{amount}</Text>
        <Text style={{ color, fontWeight: 'bold' }}>{title}</Text>
      </Pressable>
    ));
  };

  const updateGroupTitle = () => {
    if (!groupTitle) {
      return console.error('Provide title');
    }
    dispatch(
      enqueueOrDispatch(updateGroup, updateStateGroup, {
        id: groupId,
        title: groupTitle,
      }),
    );
  };

  const sortByNextReview = () => {
    dispatch(sortCards(nextReviewSort));
    setNextReviewSort(nextReviewSort === 'asc' ? 'desc' : 'asc');
  };

  const handleRemoveGroup = () => {
    dispatch(enqueueOrDispatch(removeGroup, removeStateGroup, groupId));
    setShowEditModal(false);
    navigation.navigate(AppPath.Main);
  };

  const onChangeCardsRange = useCallback((value: number) => {
    setWordsRangeNumber(value);
  }, []);

  const decWordsRange = () => {
    if (wordsRangeNumber > 2) {
      setWordsRangeNumber(wordsRangeNumber - 1);
    }
  };

  const incWordsRange = () => {
    if (wordsRangeNumber < cards?.length) {
      setWordsRangeNumber(wordsRangeNumber + 1);
    }
  };

  const navigateToLearn = () => {
    if (wordsRangeNumber !== cards.length) {
      dispatch(rangeCards(wordsRangeNumber));
    }
    navigation.navigate(AppPath.Learn, { groupId });
  };

  return (
    <ThemeBackground style={{ padding: 10 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <BackButton />
          <ThemeText style={{ fontSize: 30 }}>{group?.title}</ThemeText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => setShowFilterModal((prev) => !prev)}>
            {showFilterModal ? (
              <FontAwesome name="filter" size={23.5} color={colors.primary} />
            ) : (
              <Feather name="filter" size={20} color={colors.primary} />
            )}
          </Pressable>

          <Pressable onPress={() => setShowEditModal((prev) => !prev)}>
            <Entypo
              name="dots-three-vertical"
              size={30}
              color={colors.iconColor}
            />
          </Pressable>
        </View>
      </View>

      {showFilterModal && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: colors.background,
            top: 100,
            right: 10,
            borderRadius: 20,
            padding: 20,
            zIndex: 2,
            borderColor: colors.lightBackground,
            borderWidth: 3,
          }}
        >
          <ThemeText>Filter</ThemeText>
          {cards.length > 1 && (
            <View style={{ marginHorizontal: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Pressable onPress={decWordsRange}>
                  <FontAwesome name="minus" color={colors.primary} size={40} />
                </Pressable>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ThemeText style={{ fontSize: 35 }}>
                    {Math.floor(wordsRangeNumber)}
                  </ThemeText>
                  <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={2}
                    maximumValue={cards.length}
                    value={wordsRangeNumber}
                    onSlidingComplete={onChangeCardsRange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.background}
                  />
                </View>

                <Pressable onPress={incWordsRange}>
                  <FontAwesome name="plus" color={colors.primary} size={40} />
                </Pressable>
                {filteredCards.length > cards.length && (
                  <Pressable
                    style={{
                      padding: 5,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: '#bcbcbc',
                      marginHorizontal: 10,
                    }}
                    onPress={() => dispatch(resetFilter())}
                  >
                    <Entypo name="back-in-time" size={30} color="#bcbcbc" />
                  </Pressable>
                )}
              </View>
            </View>
          )}

          <Select
            placeholder={i18n.t('sharedGroupsScreen.sort')}
            data={[
              i18n.t('group.sortByDate'),
              i18n.t('group.sortByName'),
              i18n.t('group.sortByReviewDate'),
            ]}
            currentSelect={sort}
            setCurrentSelect={setSort}
          />

          <PressableButton
            buttonStyle={{ marginTop: 20 }}
            text={i18n.t('sharedGroupsScreen.filter')}
          />
        </View>
      )}

      <CardList groupId={groupId} />

      <DefaultModal
        isVisible={showEditModal}
        handleClose={() => setShowEditModal(false)}
      >
        <ThemeText>{i18n.t('group.changeTitle')}</ThemeText>
        <AddInput
          value={groupTitle}
          onChangeText={setGroupTitle}
          placeholder={i18n.t('group.inputPlaceholder')}
        />

        <PressableButton
          text={i18n.t('group.changeButton')}
          onPress={updateGroupTitle}
        />

        <Pressable onPress={handleRemoveGroup}>
          <Entypo name="trash" size={30} color={colors.primary} />
        </Pressable>
      </DefaultModal>
    </ThemeBackground>
  );
};

export default GroupScreen;
