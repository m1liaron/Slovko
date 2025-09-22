import noGroupsImage from '@/assets/images/no_groups.png';
import { SkeletonGroupItem } from '@/common/components/SkeletonGroupItem/SkeletonGroupItem';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { v4 as uuid } from 'uuid';
import AddButton from '../../../common/components/AddButton/AddButton';
import AddInput from '../../../common/components/AddInput/AddInput';
import PressableButton from '../../../common/components/PressableButton/PressableButton';
import {
  addGroup,
  addStateGroup,
  getAllGroups,
} from '../../../redux/groupReducer/groupSlice';
import DefaultModal from '../../DefaultModal/DefaultModal';
import { GroupItem } from '../GroupItem/GroupItem';
import styles from './GroupList.styles';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { selectUser } from '@/redux/userReducer/userSlice';

export const GroupList = () => {
  const { groups, isLoading } = useAppSelector((state) => state.groups);
  const { activeSectionId } = useAppSelector((state) => state.sections);
  const [title, setTitle] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(enqueueOrDispatch(getAllGroups, activeSectionId));
  }, [dispatch, activeSectionId]);

  const handleAddGroup = () => {
    if (!title.length) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a title',
      });
    }
    const newGroup = {
      id: uuid(),
      title,
      sectionId: activeSectionId,
    };
    dispatch(enqueueOrDispatch(addGroup, addStateGroup, newGroup));
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.groupListContainer}>
        {isLoading ? (
          <FlatList
            data={Array(5).fill(null)}
            keyExtractor={(_, index) => `skeleton-${index}`}
            renderItem={() => <SkeletonGroupItem />}
          />
        ) : !groups.length ? (
          <View style={styles.noGroupsContainer}>
            <Image source={noGroupsImage} />
          </View>
        ) : (
          <FlatList
            data={groups}
            renderItem={({ item }) => <GroupItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <AddButton onPress={() => setShowAddModal(true)} />

      <DefaultModal
        isVisible={showAddModal}
        handleClose={() => setShowAddModal(false)}
      >
        <ThemeText>Додайте Групу!</ThemeText>
        <AddInput
          placeholder="Назва Групи"
          placeholderTextColor="#A0A0A0"
          value={title}
          onChangeText={setTitle}
        />

        <PressableButton onPress={handleAddGroup} text="Додати групу" />
      </DefaultModal>
    </View>
  );
};
