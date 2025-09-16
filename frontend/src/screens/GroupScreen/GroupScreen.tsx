import ThemeText from '@/common/components/ThemeText/ThemeText';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type {
  RootStackParamList,
  StackNavigation,
} from '@/navigation/ProtectedRoute/ProtectedRoute';
import {
  getGroupStorage,
  moveGroupToAnotherSection,
} from '@/redux/groupReducer/groupThunk';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
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
import { LineLoader } from '@/common/components/LineLoader/LineLoader';
import { setActiveSectionId } from '@/redux/sectionReducer/sectionSlice';
import { FlatList } from 'react-native-gesture-handler';

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
  const { cards, filteredCards, isLoading } = useAppSelector(
    (state) => state.cards,
  );
  const { sections } = useAppSelector((state) => state.sections);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [groupTitle, setGroupTitle] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [wordsRangeNumber, setWordsRangeNumber] = useState<number>(
    cards?.length || 2,
  );
  const [sort, setSort] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [newSectionId, setNewSectionId] = useState<string>();
  const [showSectionList, setShowSectionList] = useState(false);

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

  const handleFilterCards = () => {
    if (sort.length > 0) {
      dispatch(sortCards(sortOrder));
    }
    if (wordsRangeNumber !== cards.length || wordsRangeNumber !== 2) {
      dispatch(rangeCards(wordsRangeNumber));
    }
  };

  const handleRemoveGroup = () => {
    dispatch(enqueueOrDispatch(removeGroup, removeStateGroup, groupId));
    setShowEditModal(false);
    navigation.navigate(AppPath.Main);
  };

  const handleMoveGroupToAnotherSection = () => {
    if (!newSectionId) {
      Alert.alert('Please select section to move group');
      return;
    }
    dispatch(moveGroupToAnotherSection({ groupId, sectionId: newSectionId }));
    setActiveSectionId(null);
    setShowEditModal(false);
    setShowSectionList(false);
    navigation.navigate(AppPath.Home);
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
          <View>
            <Pressable onPress={() => setShowFilterModal((prev) => !prev)}>
              {showFilterModal ? (
                <FontAwesome name="filter" size={23.5} color={colors.primary} />
              ) : (
                <Feather name="filter" size={20} color={colors.primary} />
              )}
            </Pressable>
          </View>

          <Pressable onPress={() => setShowEditModal((prev) => !prev)}>
            <Entypo
              name="dots-three-vertical"
              size={30}
              color={colors.iconColor}
            />
          </Pressable>
        </View>
      </View>

      {isLoading && <LineLoader />}

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
            customStyle={{ width: '100%', paddingHorizontal: 20 }}
            currentSelect={sort}
            setCurrentSelect={setSort}
            showSortIcon={true}
            setSortOrder={setSortOrder}
            sortOrder={sortOrder}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {statusCardsButtons.map(({ status, title, amount, color }) => (
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
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PressableButton
              onPress={handleFilterCards}
              buttonStyle={{ marginTop: 20, width: '60%' }}
              text={i18n.t('sharedGroupsScreen.filter')}
            />
            {filteredCards.length < cards.length && (
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

        <View>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setShowSectionList((prev) => !prev)}
          >
            <ThemeText>{i18n.t('group.moveGroup')}</ThemeText>
            <Feather
              name={showSectionList ? 'arrow-down' : 'arrow-right'}
              color={colors.primary}
              size={30}
            />
          </Pressable>

          {showSectionList && (
            <View>
              <FlatList
                data={sections}
                contentContainerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  margin: 10,
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={{
                      padding: 10,
                      backgroundColor:
                        newSectionId === item.id ? colors.highlightColor : '',
                      borderRadius: 10,
                    }}
                    onPress={() => setNewSectionId(item.id)}
                  >
                    <ThemeText>{item.title}</ThemeText>
                  </Pressable>
                )}
              />
              <PressableButton
                text="Перемістити"
                onPress={handleMoveGroupToAnotherSection}
              />
            </View>
          )}
        </View>
      </DefaultModal>
    </ThemeBackground>
  );
};

export default GroupScreen;
