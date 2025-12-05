import React, { useState } from 'react';
import { FlatList, Image, Pressable, View, useWindowDimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { v4 as uuid } from 'uuid';

import noGroupsImage from '@/assets/images/no_groups.png';
import { SkeletonGroupItem } from '@/common/components/SkeletonGroupItem/SkeletonGroupItem';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';

import AddButton from '../../../common/components/AddButton/AddButton';
import AddInput from '../../../common/components/AddInput/AddInput';
import PressableButton from '../../../common/components/PressableButton/PressableButton';
import {
  addGroup,
  addStateGroup,
} from '../../../redux/groupReducer/groupSlice';
import DefaultModal from '../../DefaultModal/DefaultModal';
import { GroupItem } from '../GroupItem/GroupItem';

export const GroupList = () => {
  const { groups, isLoading } = useAppSelector((state) => state.groups);
  const { activeSectionId, sections } = useAppSelector(
    (state) => state.sections,
  );
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  // Calculate number of columns based on screen width
  const numColumns = width >= 1200 ? 3 : width >= 768 ? 2 : 1;

  const handleAddGroup = () => {
    if (!title.length) {
      setError(i18n.t('mainScreen.groupList.enterTitle'))
      return;
    }
    if (!activeSectionId || sections.length === 0) {
      setError(i18n.t('mainScreen.groupList.pleaseCreate'))
      return;
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
    <View style={{ flex: 1, paddingHorizontal: isDesktop ? 32 : 20 }}>
      <View style={{ zIndex: 5 }}>
        <Toast />
      </View>
      <View
        style={{ flex: 1, maxWidth: 1400, width: '100%', alignSelf: 'center' }}
      >
        {isLoading ? (
          <FlatList
            data={Array(5).fill(null)}
            keyExtractor={(_, index) => `skeleton-${index}`}
            renderItem={() => <SkeletonGroupItem />}
            numColumns={numColumns}
            key={`skeleton-${numColumns}`}
            columnWrapperStyle={
              numColumns > 1 ? { gap: 16, marginBottom: 16 } : undefined
            }
            contentContainerStyle={{ paddingVertical: 20 }}
          />
        ) : !groups.length ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60,
            }}
          >
            <Image
              source={noGroupsImage}
              style={{ width: 200, height: 200, marginBottom: 20 }}
              resizeMode="contain"
            />
            <ThemeText style={{ fontSize: 18, opacity: 0.6 }}>
              No groups yet. Create your first one!
            </ThemeText>
          </View>
        ) : (
          <FlatList
            data={groups}
            renderItem={({ item }) => <GroupItem item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            key={`groups-${numColumns}`}
            columnWrapperStyle={
              numColumns > 1 ? { gap: 16, marginBottom: 16 } : undefined
            }
            contentContainerStyle={{
              paddingVertical: 20,
              gap: numColumns === 1 ? 16 : 0,
            }}
          />
        )}
      </View>
      <AddButton onPress={() => setShowAddModal(true)} />

      <DefaultModal
        isVisible={showAddModal}
        handleClose={() => setShowAddModal(false)}
      >
        <ThemeText
          style={{ fontSize: 20, fontWeight: '600', marginBottom: 16 }}
        >
          {i18n.t('mainScreen.groupList.addGroup')}
        </ThemeText>
        <AddInput
          placeholder="Назва Групи"
          placeholderTextColor="#A0A0A0"
          value={title}
          onChangeText={setTitle}
          height={70}
        />
        {error && (
          <Pressable onPress={() => { setError(null); setShowAddModal(false)} } style={{ backgroundColor: '#d16975', borderRadius: 10, padding: 10, marginVertical: 10 }}>
            <ThemeText style={{ textTransform: "uppercase" }}>{error}!</ThemeText>
          </Pressable>
        )}
        <PressableButton onPress={handleAddGroup} text="Додати групу" buttonStyle={{ marginTop: 20}}/>
      </DefaultModal>
    </View>
  );
};
