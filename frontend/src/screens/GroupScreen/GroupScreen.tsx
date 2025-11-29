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
import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import AddInput from '../../common/components/AddInput/AddInput';
import PressableButton from '../../common/components/PressableButton/PressableButton';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import { AppPath, DataStatus } from '../../common/enums/app/app';
import BackButton from '../../components/BackButton/BackButton';
import CardList from '../../components/Card/CardList/CardList';
import DefaultModal from '../../components/DefaultModal/DefaultModal';
import { useAppTheme } from '../../contexts/ThemeProvider';
import {
  addLearningMode,
  filterCardsByStatus,
  getRepeatedCards,
  LearningMode,
  rangeCards,
  resetFilter,
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
import AddButton from '@/common/components/AddButton/AddButton';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { AddCardModal } from '@/components/Modals/AddCardModal/AddCardModal';
import Checkbox from 'expo-checkbox';

type GroupScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.Group
>;

interface ShowModeLearning {
  text: string;
  iconName: string;
  shown: boolean;
  sectionName: LearningMode;
}

const GroupScreen: React.FC<GroupScreenProps> = ({ route }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const maxContentWidth = isDesktop ? 1200 : width;

  const { groupId } = route.params as { groupId: string };
  const { group, status } = useAppSelector((state) => state.groups);
  const { cards, filteredCards, isLoading, shownModes } = useAppSelector(
    (state) => state.cards,
  );
  const { sections, activeSectionId } = useAppSelector(
    (state) => state.sections,
  );
  const showSections = sections.filter(
    (section) => section.id !== activeSectionId,
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

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
  const [showModesModal, setShowModesModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [shownLearningModes, setShownLearningModes] = useState<
    ShowModeLearning[]
  >([
    {
      text: i18n.t('learnScreen.quizMode'),
      iconName: 'quiz',
      shown: shownModes.quiz,
      sectionName: 'quiz',
    },
    {
      text: i18n.t('learnScreen.guessWordMode'),
      iconName: 'wordpress',
      shown: shownModes.word,
      sectionName: 'word',
    },
    {
      text: i18n.t('learnScreen.checkTranslateMode'),
      iconName: 'checklist',
      shown: shownModes.check,
      sectionName: 'check',
    },
  ]);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();

  if (!groupId && status === DataStatus.ERROR) {
    navigation.goBack();
  }

  useEffect(() => {
    setWordsRangeNumber(filteredCards.length);
  }, [filteredCards.length]);

  useEffect(() => {
    if (!group || group.id !== groupId) {
      dispatch(enqueueOrDispatch(getGroupStorage, getGroup, { groupId }));
    }
  }, [group, groupId, dispatch]);

  const totalCards = cards?.length || 0;
  const learnedCards = group?.learnedCount || 0;
  const progressPercentage =
    totalCards > 0 ? (learnedCards / totalCards) * 100 : 0;

  const statusCardsButtons = useMemo(() => {
    if (!group) return [];
    return [
      {
        title: i18n.t('group.studying'),
        status: 'To Learn',
        amount: group.toLearnCount || 0,
        color: '#32C74D',
        icon: 'radio-button-unchecked',
      },
      {
        title: i18n.t('group.reviewed'),
        status: 'Learned',
        amount: group.repeatedCount || 0,
        color: '#62CBE9',
        icon: 'check-circle',
      },
      {
        title: i18n.t('group.known'),
        status: 'Know',
        amount: group.knowCount || 0,
        color: '#a8a800',
        icon: 'refresh',
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

  const handleRemoveGroup = () => {
    dispatch(
      enqueueOrDispatch(removeGroup, removeStateGroup, {
        groupId,
        sectionId: activeSectionId,
      }),
    );
    dispatch(getRepeatedCards({ sectionId: activeSectionId }));
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
    if (value !== cards.length || value !== 2) {
      dispatch(rangeCards(Math.floor(value)));
    }
  }, []);

  const decWordsRange = () => {
    if (wordsRangeNumber > 2) {
      onChangeCardsRange(wordsRangeNumber - 1);
    }
  };

  const incWordsRange = () => {
    if (wordsRangeNumber < filteredCards?.length) {
      onChangeCardsRange(wordsRangeNumber + 1);
    }
  };

  const handleStatusFilter = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      dispatch(resetFilter());
    } else {
      setSelectedStatus(status);
      dispatch(filterCardsByStatus({ status }));
    }
  };

  const handleShowModesModal = () => {
    bottomSheetRef.current?.snapToIndex(2);
    setShowModesModal(true);
  };

  const navigateToLearn = () => {
    if (wordsRangeNumber !== cards.length) {
      dispatch(rangeCards(wordsRangeNumber));
    }
    navigation.navigate(AppPath.Learn, { groupId });
    bottomSheetRef.current?.close();
    setShowAddModal(false);
  };

  const onChangeLearningModeShown = (index: number) => {
    setShownLearningModes((prev) =>
      prev.map((mode, i) =>
        i === index ? { ...mode, shown: !mode.shown } : mode,
      ),
    );
    dispatch(
      addLearningMode({ sectionName: shownLearningModes[index].sectionName }),
    );
  };

  return (
    <ThemeBackground style={{ padding: 0, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: maxContentWidth }}>
        <View
          style={{
            padding: isDesktop ? 32 : 20,
            paddingTop: isDesktop ? 32 : 40,
            backgroundColor: colors.lightBackground,
          }}
        >
          <View
            style={{
              flexDirection: isDesktop ? 'row' : 'column',
              justifyContent: 'space-between',
              alignItems: isDesktop ? 'center' : 'flex-start',
              gap: 16,
            }}
          >
            <View style={{ flex: isDesktop ? 1 : undefined }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: isDesktop ? 0 : 8,
                }}
              >
                <BackButton />
                <ThemeText
                  style={{
                    fontSize: isDesktop ? 32 : 25,
                    fontWeight: 'bold',
                    marginLeft: 10,
                  }}
                >
                  {group?.title}
                </ThemeText>
              </View>
            </View>

            {/* View Mode Toggle */}
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Pressable
                style={{
                  borderRadius: 20,
                  backgroundColor: showFilterModal
                    ? colors.primary
                    : colors.lightBackground,
                  padding: 10,
                }}
                onPress={() => setShowFilterModal((prev) => !prev)}
              >
                <Feather
                  name="filter"
                  size={20}
                  color={showFilterModal ? colors.background : colors.text}
                />
              </Pressable>

              <Pressable
                onPress={() => setViewMode('list')}
                style={{
                  backgroundColor:
                    viewMode === 'list'
                      ? colors.primary
                      : colors.lightBackground,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <MaterialIcons
                  name="view-list"
                  size={20}
                  color={viewMode === 'list' ? colors.background : colors.text}
                />
                <Text
                  style={{
                    color:
                      viewMode === 'list' ? colors.background : colors.text,
                    fontWeight: '600',
                  }}
                >
                  List
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setViewMode('cards')}
                style={{
                  backgroundColor:
                    viewMode === 'cards'
                      ? colors.primary
                      : colors.lightBackground,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <MaterialIcons
                  name="view-carousel"
                  size={20}
                  color={viewMode === 'cards' ? colors.background : colors.text}
                />
                <Text
                  style={{
                    color:
                      viewMode === 'cards' ? colors.background : colors.text,
                    fontWeight: '600',
                  }}
                >
                  Cards
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowEditModal(true)}
                style={{
                  padding: 10,
                  backgroundColor: colors.lightBackground,
                  borderRadius: 20,
                }}
              >
                <Entypo
                  name="dots-three-vertical"
                  size={20}
                  color={colors.iconColor}
                />
              </Pressable>
            </View>
          </View>
        </View>
        {isLoading && <LineLoader />}

        <View
          style={{
            backgroundColor: colors.background,
            padding: isDesktop ? 32 : 20,
            marginHorizontal: isDesktop ? 32 : 20,
            marginTop: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <ThemeText style={{ fontSize: 18, fontWeight: '600' }}>
              Progress
            </ThemeText>
            <ThemeText style={{ fontSize: 16 }}>
              {learnedCards > 0
                ? `${learnedCards}/${filteredCards.length}`
                : i18n.t('group.noCardsLearned')}{' '}
              {i18n.t('group.learned')}
            </ThemeText>
          </View>
          <View
            style={{
              height: 12,
              backgroundColor: colors.lightBackground,
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${progressPercentage}%`,
                backgroundColor: colors.primary,
                borderRadius: 6,
              }}
            />
          </View>
        </View>
      </View>

      {/* Cards List */}
      <View style={{ flex: 1, paddingHorizontal: isDesktop ? 32 : 0 }}>
        <CardList groupId={groupId} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 20,
        }}
      >
        {cards.length > 1 && (
          <PressableButton
            onPress={handleShowModesModal}
            text={i18n.t('group.cardList.learnButton')}
            buttonStyle={{ flex: 1 }}
          />
        )}
        <AddButton
          viewStyles={{ position: 'static', right: 0, bottom: 0 }}
          onPress={() => setShowAddModal(true)}
        />
      </View>

      {showFilterModal && (
        <View
          style={{
            position: 'absolute',
            top: isDesktop ? 60 : 130,
            left: isDesktop ? '50%' : '0%',
            backgroundColor: colors.background,
            padding: isDesktop ? 32 : 20,
            marginHorizontal: isDesktop ? 32 : 20,
            marginTop: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            opacity: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Feather name="filter" size={20} color={colors.primary} />
            <ThemeText
              style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}
            >
              Filters
            </ThemeText>
          </View>

          <View style={{ gap: 24 }}>
            {/* Cards to show slider */}
            <View>
              <ThemeText
                style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}
              >
                Cards to show
              </ThemeText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <Pressable
                  onPress={decWordsRange}
                  style={{
                    padding: 8,
                    backgroundColor: colors.lightBackground,
                    borderRadius: 8,
                  }}
                >
                  <FontAwesome name="minus" color={colors.primary} size={16} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <ThemeText style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {Math.floor(wordsRangeNumber)}/{filteredCards.length}
                  </ThemeText>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    disabled={filteredCards.length === 0}
                    maximumValue={filteredCards.length}
                    value={wordsRangeNumber}
                    onSlidingComplete={onChangeCardsRange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.lightBackground}
                  />
                </View>
                <Pressable
                  onPress={incWordsRange}
                  style={{
                    padding: 8,
                    backgroundColor: colors.lightBackground,
                    borderRadius: 8,
                  }}
                >
                  <FontAwesome name="plus" color={colors.primary} size={16} />
                </Pressable>
              </View>
            </View>

            {/* Sort by dropdown */}
            <View>
              <ThemeText
                style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}
              >
                Sort by
              </ThemeText>
              <Select
                placeholder="Default order"
                data={[
                  i18n.t('group.sortByDate'),
                  i18n.t('group.sortByName'),
                  i18n.t('group.sortByReviewDate'),
                ]}
                customStyle={{ width: '100%' }}
                currentSelect={sort}
                setCurrentSelect={setSort}
                showSortIcon={true}
                setSortOrder={setSortOrder}
                sortOrder={sortOrder}
              />
            </View>

            {/* Status filters */}
            <View>
              <ThemeText
                style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}
              >
                Status
              </ThemeText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {statusCardsButtons.map(({ status, title, icon, color }) => (
                  <Pressable
                    key={status}
                    onPress={() => handleStatusFilter(status)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor:
                        selectedStatus === status
                          ? colors.lightBackground
                          : 'transparent',
                      borderWidth: 1,
                      borderColor:
                        selectedStatus === status
                          ? colors.primary
                          : colors.lightBackground,
                    }}
                  >
                    <MaterialIcons name={icon} size={18} color={color} />
                    <Text style={{ color: colors.text, fontSize: 14 }}>
                      {title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20, gap: 12 }}>
            <ThemeText style={{ fontSize: 14, opacity: 0.6 }}>
              Showing {totalCards} of {filteredCards.length} words
            </ThemeText>

            {filteredCards.length < cards.length && (
              <Pressable
                onPress={() => {
                  dispatch(resetFilter());
                  setSelectedStatus(null);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  alignSelf: 'flex-start',
                  paddingVertical: 8,
                }}
              >
                <Entypo name="back-in-time" size={18} color={colors.primary} />
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  Reset filters
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {showModesModal && (
        <BottomSheet
          enablePanDownToClose={true}
          snapPoints={[300, '40%']}
          ref={bottomSheetRef}
          style={{
            backgroundColor: colors.lightBackground,
          }}
        >
          <BottomSheetView
            style={{ flex: 1, padding: 30, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {i18n.t('group.chooseModes')}
            </Text>
            <FlatList
              data={shownLearningModes}
              keyExtractor={(item) => item.text}
              contentContainerStyle={{ marginBottom: 20 }}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    value={item.shown}
                    onValueChange={() => onChangeLearningModeShown(index)}
                  />
                  <MaterialIcons name={item.iconName} size={30} />
                  <Text style={{ fontSize: 20 }}>{item.text}</Text>
                </View>
              )}
            />
            <PressableButton
              onPress={navigateToLearn}
              text={i18n.t('group.cardList.learnButton')}
              buttonStyle={{ width: '100%' }}
            />
          </BottomSheetView>
        </BottomSheet>
      )}

      <AddCardModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        groupId={groupId}
      />

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
          {showSections.length > 0 && (
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              onPress={() => setShowSectionList((prev) => !prev)}
            >
              <ThemeText>{i18n.t('group.moveGroup')}</ThemeText>
              <Feather
                name={showSectionList ? 'arrow-down' : 'arrow-right'}
                color={colors.primary}
                size={24}
              />
            </Pressable>
          )}

          {showSectionList && showSections.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <FlatList
                data={showSections}
                contentContainerStyle={{
                  gap: 10,
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={{
                      padding: 12,
                      backgroundColor:
                        newSectionId === item.id
                          ? colors.highlightColor
                          : colors.lightBackground,
                      borderRadius: 10,
                    }}
                    onPress={() => setNewSectionId(item.id)}
                  >
                    <ThemeText>{item.title}</ThemeText>
                  </Pressable>
                )}
              />
              <View style={{ marginTop: 16 }}>
                <PressableButton
                  text="Перемістити"
                  onPress={handleMoveGroupToAnotherSection}
                />
              </View>
            </View>
          )}
        </View>
      </DefaultModal>
    </ThemeBackground>
  );
};

export default GroupScreen;
