import { SkeletonGroupItem } from '@/common/components/SkeletonGroupItem/SkeletonGroupItem';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { IGroup } from '@/common/enums/types/group.type';
import type { ISharedGroup } from '@/common/enums/types/sharedGroup';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import { v4 as uuid } from 'uuid';
import AvatarImage from '../../../assets/images/avatar.png';
import AddButton from '../../common/components/AddButton/AddButton';
import AddInput from '../../common/components/AddInput/AddInput';
import PressableButton from '../../common/components/PressableButton/PressableButton';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import { AppPath, DataStatus } from '../../common/enums/app/app';
import DefaultModal from '../../components/DefaultModal/DefaultModal';
import { useAppTheme } from '../../contexts/ThemeProvider';
import { selectGroup } from '../../redux/groupReducer/groupSlice';
import {
  addSharedGroup,
  addStateSharedGroup,
  filterMySharedGroups,
  filterSharedGroups,
  getAllSharedGroups,
  removeSharedGroup,
  removeStateSharedGroup,
  resetSharedGroups,
} from '../../redux/sharedGroupReducer/sharedGroupSlice';
import { selectUser } from '../../redux/userReducer/userSlice';
import styles from './SharedGroupsScreen.styles';

const SharedGroupsScreen = () => {
  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();
  const { sharedGroups, haveMoreSharedGroups, isLoading, status, error } =
    useAppSelector((state) => state.sharedGroups);
  const groups = useAppSelector(selectGroup);

  const [showAddModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [sharedGroupTitle, setSharedGroupTitle] = useState(
    selectedGroup?.title,
  );
  const [showFilter, setShowFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'easy' | 'medium' | 'hard' | string
  >('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(enqueueOrDispatch(getAllSharedGroups, { page }));
  }, [page]);

  const handleLoadMore = () => {
    if (haveMoreSharedGroups && !isLoading) {
      const nextPage = page + 1;
      dispatch(enqueueOrDispatch(getAllSharedGroups, { page: nextPage }));
      setPage(nextPage);
    }
  };

  const addRemoveSelectedGroup = (newGroup: IGroup) => {
    setSelectedGroup(!selectedGroup ? newGroup : null);
    setSharedGroupTitle(!sharedGroupTitle ? newGroup.title : '');
  };

  const shareGroup = () => {
    if (!selectedGroup) {
      alert('Please select a shared group');
    }

    if (selectedGroup) {
      const sharedGroupData = {
        tempId: uuid(),
        group: {
          groupId: selectedGroup.id,
          title: sharedGroupTitle || 'Shared Group Title',
          createdAt: new Date(),
        },
      };
      dispatch(
        enqueueOrDispatch(addSharedGroup, addStateSharedGroup, sharedGroupData),
      );
    }
  };

  useEffect(() => {
    if (status === DataStatus.ERROR && error) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: error,
      });
    }
  }, [error, status]);

  const renderItem = ({ item }: { item: ISharedGroup }) => (
    <View
      key={item.id}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Pressable
        style={styles.sharedGroup}
        onPress={() =>
          navigation.navigate(AppPath.SharedGroupDetails, {
            sharedGroupId: item.id,
          })
        }
      >
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Image
              source={
                item?.user?.image ? { uri: item.user.image } : AvatarImage
              }
              style={styles.avatarIcon}
            />
            <View>
              <ThemeText style={{ fontSize: 30 }}>{item.title}</ThemeText>
              <ThemeText
                style={[
                  styles.avatarName,
                  { backgroundColor: colors.lightBackground },
                ]}
              >
                {item?.user?.name}
              </ThemeText>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );

  const renderFooter = () =>
    isLoading ? (
      <View style={{ paddingVertical: 10 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;

  const sortOptions = [
    { label: i18n.t('sharedGroupsScreen.sortDate'), value: 'sortDate' },
    { label: i18n.t('sharedGroupsScreen.sortName'), value: 'sortName' },
    {
      label: i18n.t('sharedGroupsScreen.sortWordsAmount'),
      value: 'sortWordsAmount',
    },
  ];

  const sortSelectStyle = {
    color: colors.primary,
    backgroundColor: colors.lightBackground,
    ...styles.sortSelect,
  };

  const difficulties = [
    `${i18n.t('sharedGroupsScreen.easy')}`,
    `${i18n.t('sharedGroupsScreen.medium')}`,
    `${i18n.t('sharedGroupsScreen.hard')}`,
  ];

  return (
    <ThemeBackground>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.lightBackground,
          },
        ]}
      >
        <Ionicons name="search" size={20} color={colors.lightText} />
        <TextInput
          style={[styles.searchInput, { color: colors.primary }]}
          placeholder={i18n.t('sharedGroupsScreen.searchPlaceholder')}
          placeholderTextColor={colors.lightText}
        />
      </View>

      <Pressable
        style={{ margin: 10, alignSelf: 'flex-start', alignItems: 'center' }}
        onPress={() => setShowFilter((prev) => !prev)}
      >
        {showFilter ? (
          <FontAwesome name="filter" size={21} color={colors.primary} />
        ) : (
          <Feather name="filter" size={20} color={colors.primary} />
        )}
        <ThemeText>{i18n.t('sharedGroupsScreen.filter')}</ThemeText>
      </Pressable>

      {showFilter ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: colors.background,
            top: 100,
            left: 10,
            borderRadius: 20,
            padding: 20,
            zIndex: 2,
            borderColor: colors.lightText,
          }}
        >
          <View>
            <ThemeText style={{ fontSize: 20, fontWeight: 'bold' }}>
              {i18n.t('sharedGroupsScreen.filterDifficulty')}
            </ThemeText>
            <View style={{ flexDirection: 'row', gap: 5, padding: 10 }}>
              {difficulties.map((diff) => (
                <Pressable
                  onPress={() => setSelectedDifficulty(diff)}
                  style={[
                    styles.difficultyBtn,
                    {
                      borderColor: colors.highlightColor,
                      backgroundColor:
                        selectedDifficulty === diff
                          ? colors.highlightColor
                          : '',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        selectedDifficulty === diff
                          ? colors.background
                          : colors.primary,
                    }}
                  >
                    {diff}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 20,
              alignItems: 'center',
            }}
          >
            <RNPickerSelect
              placeholder={{
                label: i18n.t('sharedGroupsScreen.sort'),
                value: 'sort',
              }}
              onValueChange={() => {}}
              items={sortOptions}
              style={{
                inputWeb: sortSelectStyle,
                inputIOS: sortSelectStyle,
                inputAndroid: sortSelectStyle,
              }}
            />
            <FontAwesome
              onPress={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              size={30}
              color={colors.primary}
              name={sortOrder == 'asc' ? 'sort-asc' : 'sort-desc'}
            />
          </View>
        </View>
      ) : null}

      {isLoading ? (
        <FlatList
          data={Array(5).fill(null)}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <SkeletonGroupItem />}
        />
      ) : sharedGroups?.length ? (
        <FlatList
          data={sharedGroups}
          contentContainerStyle={{
            flexDirection: 'column',
            gap: 20,
            padding: 10,
          }}
          keyExtractor={(item) => `${item.id}-${item.user?.id}`}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <ThemeText>{i18n.t('sharedGroupsScreen.noGroups')}</ThemeText>
      )}

      <AddButton onPress={() => setShowModal(true)} />
      <DefaultModal
        isVisible={showAddModal}
        handleClose={() => setShowModal(false)}
      >
        <AddInput
          value={sharedGroupTitle}
          onChangeText={setSharedGroupTitle}
          placeholder={i18n.t('sharedGroupsScreen.placeholder')}
        />
        {groups.length ? (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: IGroup }) => (
              <Pressable
                key={item.id}
                onPress={() => addRemoveSelectedGroup(item)}
              >
                <ThemeText
                  style={{
                    borderColor:
                      selectedGroup?.title === item.title
                        ? '#007AFF'
                        : colors.primary,
                    borderWidth: 2,
                    borderRadius: 10,
                    fontSize: 30,
                    padding: 10,
                  }}
                >
                  {item.title}
                </ThemeText>
              </Pressable>
            )}
            style={{ height: 400 }}
          />
        ) : (
          <View>
            <ThemeText
              style={{
                fontSize: 30,
              }}
            >
              {i18n.t('sharedGroupsScreen.noUserGroups')}
            </ThemeText>
            <PressableButton
              text={i18n.t('sharedGroupsScreen.createGroup')}
              onPress={() => navigation.navigate(AppPath.Home)}
              buttonStyle={{ padding: 10 }}
            />
          </View>
        )}
        <PressableButton
          text={i18n.t('sharedGroupsScreen.share')}
          onPress={shareGroup}
        />
      </DefaultModal>
    </ThemeBackground>
  );
};

export default SharedGroupsScreen;
