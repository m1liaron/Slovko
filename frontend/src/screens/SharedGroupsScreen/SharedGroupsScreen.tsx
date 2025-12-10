import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { v4 as uuid } from 'uuid';

import { SkeletonGroupItem } from '@/common/components/SkeletonGroupItem/SkeletonGroupItem';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { IGroup } from '@/common/enums/types/group.type';
import type { ISharedGroup } from '@/common/enums/types/sharedGroup';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';

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
  getAllSharedGroups,
} from '../../redux/sharedGroupReducer/sharedGroupSlice';

import styles from './SharedGroupsScreen.styles';
import { HAS_TOKEN } from '@/utils/storage/initToken';

const SharedGroupsScreen = () => {
  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();
  const { sharedGroups, haveMoreSharedGroups, isLoading } = useAppSelector(
    (state) => state.sharedGroups,
  );
  const { isConnected } = useAppSelector((state) => state.network);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const groups = useAppSelector(selectGroup);

  const [showAddModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [sharedGroupTitle, setSharedGroupTitle] = useState(
    selectedGroup?.title,
  );
  const [showFilter, setShowFilter] = useState(false);
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
      dispatch(enqueueOrDispatch(addSharedGroup, sharedGroupData));
    }
  };

  const renderItem = ({ item }: { item: ISharedGroup }) => (
    <Pressable
      key={item.id}
      style={[styles.sharedGroup, { borderColor: colors.lightBackground }]}
      onPress={() =>
        navigation.navigate(AppPath.SharedGroupDetails, {
          sharedGroupId: item.id,
        })
      }
    >
      <View
        style={{
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Image
          source={item?.user?.image ? { uri: item.user.image } : AvatarImage}
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
    </Pressable>
  );

  const renderFooter = () =>
    isLoading ? (
      <View style={{ paddingVertical: 10 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;

  const onShowModalOrToast = () => {
    if (!isConnected || !isAuthenticated || !HAS_TOKEN) {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.sorry'),
        text2: i18n.t('common.notAvailableUnAuthorized'),
      });
      return;
    }

    if (groups.length > 0) {
      setShowModal(true);
    } else {
      Toast.show({
        type: 'error',
        text1: i18n.t('sharedGroupsScreen.noUserGroups'),
      });
    }
  };

  const difficulties = [
    `${i18n.t('sharedGroupsScreen.easy')}`,
    `${i18n.t('sharedGroupsScreen.medium')}`,
    `${i18n.t('sharedGroupsScreen.hard')}`,
  ];

  return (
    <ThemeBackground style={{ padding: 20 }}>
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
          <FontAwesome name="filter" size={23.5} color={colors.primary} />
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
                  key={diff}
                  onPress={() => setSelectedDifficulty(diff)}
                  style={[
                    styles.difficultyBtn,
                    {
                      borderColor: colors.highlightColor,
                      backgroundColor:
                        selectedDifficulty === diff
                          ? colors.highlightColor
                          : colors.background,
                    },
                  ]}
                >
                  <ThemeText>{diff}</ThemeText>
                </Pressable>
              ))}
            </View>
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
        <View
          style={{
            backgroundColor: colors.lightBackground,
            borderRadius: 10,
            padding: 20,
            margin: 10,
          }}
        >
          <ThemeText style={{ fontSize: 25, fontWeight: 'bold' }}>
            {i18n.t('sharedGroupsScreen.noGroups')}
          </ThemeText>
        </View>
      )}

      <AddButton onPress={onShowModalOrToast} />
      <DefaultModal
        isVisible={showAddModal}
        handleClose={() => setShowModal(false)}
      >
        <AddInput
          value={sharedGroupTitle}
          height={60}
          onChangeText={setSharedGroupTitle}
          placeholder={i18n.t('sharedGroupsScreen.placeholder')}
        />
        {groups.length ? (
          <>
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
            <PressableButton
              text={i18n.t('sharedGroupsScreen.share')}
              onPress={shareGroup}
            />
          </>
        ) : (
          <View>
            <ThemeText
              style={{
                fontSize: 20,
                textAlign: 'center',
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
      </DefaultModal>
    </ThemeBackground>
  );
};

export default SharedGroupsScreen;
