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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View, ScrollView } from 'react-native';
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
  const { sections, activeSectionId } = useAppSelector(
    (state) => state.sections,
  );
  const showSections = sections.filter(
    (section) => section.id !== activeSectionId,
  );

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
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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

  const handleStatusFilter = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      dispatch(resetFilter());
    } else {
      setSelectedStatus(status);
      dispatch(filterCardsByStatus({ status }));
    }
  };

  return (
    <ThemeBackground style={{ padding: 0 }}>
      {/* Header Section */}
      <View
        style={{
          padding: 20,
          paddingTop: 40,
          backgroundColor: colors.lightBackground,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <BackButton />
              <ThemeText
                style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 10 }}
              >
                {group?.title}
              </ThemeText>
            </View>
          </View>

          {/* View Mode Toggle */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => setViewMode('list')}
              style={{
                backgroundColor:
                  viewMode === 'list' ? colors.primary : colors.lightText,
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
                color={viewMode === 'list' ? colors.lightText : colors.primary}
              />
              <Text
                style={{
                  color: viewMode === 'list' ? colors.lightText : colors.text,
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
                  viewMode === 'cards' ? colors.primary : colors.lightText,
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
                color={viewMode === 'cards' ? colors.lightText : colors.primary}
              />
              <Text
                style={{
                  color:
                    viewMode === 'cards' ? colors.lightText : colors.primary,
                  fontWeight: '600',
                }}
              >
                Cards
              </Text>
            </Pressable>

            <Pressable onPress={() => setShowEditModal(true)}>
              <Entypo
                name="dots-three-vertical"
                size={24}
                color={colors.iconColor}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View
        style={{
          backgroundColor: colors.background,
          padding: 20,
          marginHorizontal: 20,
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
            {learnedCards}/{totalCards} learned
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

      {/* Filters Section */}
      <View
        style={{
          backgroundColor: colors.background,
          padding: 20,
          marginHorizontal: 20,
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
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Feather name="filter" size={20} color={colors.primary} />
          <ThemeText style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
            Filters
          </ThemeText>
        </View>

        <ScrollView
          horizontal={true}
          style={{
            flexDirection: 'row',
            gap: 20,
            borderStartColor: colors.primary,
          }}
        >
          {/* Cards to show slider */}
          <View style={{ flex: 1, margin: 20 }}>
            <ThemeText style={{ fontSize: 14, marginBottom: 8, opacity: 0.7 }}>
              Cards to show
            </ThemeText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={decWordsRange}>
                <FontAwesome name="minus" color={colors.primary} size={20} />
              </Pressable>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <ThemeText style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {Math.floor(wordsRangeNumber)}
                </ThemeText>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={2}
                  maximumValue={cards.length}
                  value={wordsRangeNumber}
                  onSlidingComplete={onChangeCardsRange}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.lightBackground}
                />
              </View>
              <Pressable onPress={incWordsRange}>
                <FontAwesome name="plus" color={colors.primary} size={20} />
              </Pressable>
            </View>
          </View>

          {/* Sort by dropdown */}
          <View style={{ flex: 1, margin: 20 }}>
            <ThemeText style={{ fontSize: 14, marginBottom: 8, opacity: 0.7 }}>
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
          <View style={{ flex: 1, margin: 20 }}>
            <ThemeText style={{ fontSize: 14, marginBottom: 8, opacity: 0.7 }}>
              Status
            </ThemeText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
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
        </ScrollView>

        <ThemeText style={{ fontSize: 14, marginTop: 16, opacity: 0.6 }}>
          Showing {filteredCards.length} of {totalCards} words
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
              gap: 6,
              marginTop: 12,
            }}
          >
            <Entypo name="back-in-time" size={18} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 14 }}>
              Reset filters
            </Text>
          </Pressable>
        )}
      </View>

      {isLoading && <LineLoader />}

      {/* Cards List */}
      <CardList groupId={groupId} />

      {/* Edit Modal */}
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
          )}

          {showSectionList && showSections.length > 0 && (
            <View>
              <FlatList
                data={showSections}
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
