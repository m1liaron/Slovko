import { useState, useRef } from 'react';
import { Platform, View, Text, Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Checkbox from 'expo-checkbox';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import AddInput from '@/common/components/AddInput/AddInput';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import DefaultModal from '@/components/DefaultModal/DefaultModal';
import { AddCardModal } from '@/components/Modals/AddCardModal/AddCardModal';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { IGroup, ICard } from '@/common/enums/types/types';
import type { LearningMode } from '@/redux/cardReducer/cardSlice';

interface ShowModeLearning {
  text: string;
  iconName: string;
  shown: boolean;
  sectionName: LearningMode;
}

interface GroupModalsProps {
  groupId: string;
  group: IGroup;
  filteredCards: ICard[];
  showModesModal: boolean;
  showEditModal: boolean;
  showAddModal: boolean;
  shownLearningModes: ShowModeLearning[];
  onCloseModesModal: () => void;
  onCloseEditModal: () => void;
  onCloseAddModal: () => void;
  onChangeLearningMode: (index: number) => void;
  onNavigateToLearn: () => void;
  onUpdateGroup: () => void;
  onRemoveGroup: () => void;
  onMoveGroup: () => void;
}

export const GroupModals: React.FC<GroupModalsProps> = ({
  groupId,
  filteredCards,
  showModesModal,
  showEditModal,
  showAddModal,
  shownLearningModes,
  onCloseModesModal,
  onCloseEditModal,
  onCloseAddModal,
  onChangeLearningMode,
  onNavigateToLearn,
  onUpdateGroup,
  onRemoveGroup,
  onMoveGroup,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { sections, activeSectionId } = useAppSelector(
    (state) => state.sections,
  );
  const showSections = sections.filter(
    (section) => section.id !== activeSectionId,
  );

  const [groupTitle, setGroupTitle] = useState('');
  const [newSectionId, setNewSectionId] = useState<string>();
  const [showSectionList, setShowSectionList] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderLearningModeItem = ({
    item,
    index,
  }: {
    item: ShowModeLearning;
    index: number;
  }) => {
    if (item.sectionName === 'check' && filteredCards.length < 4) {
      return (
        <>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <MaterialIcons
              name={item.iconName}
              size={30}
              color={colors.primary}
            />
            <ThemeText
              style={{
                fontSize: 20,
                textDecorationLine: 'line-through',
              }}
            >
              {item.text}
            </ThemeText>
          </View>
          <ThemeText style={{ fontWeight: 'bold' }}>
            {i18n.t('group.cardList.atLeastFourWords')}
          </ThemeText>
        </>
      );
    }

    return (
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
          onValueChange={() => onChangeLearningMode(index)}
        />
        <MaterialIcons name={item.iconName} size={30} color={colors.primary} />
        <ThemeText style={{ fontSize: 20 }}>{item.text}</ThemeText>
      </View>
    );
  };

  return (
    <>
      {/* Learning Modes Modal - Mobile (BottomSheet) */}
      {Platform.OS !== 'web' && showModesModal && (
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
              renderItem={renderLearningModeItem}
            />
            <PressableButton
              onPress={onNavigateToLearn}
              text={i18n.t('group.cardList.learnButton')}
              buttonStyle={{ width: '100%' }}
            />
          </BottomSheetView>
        </BottomSheet>
      )}

      {/* Learning Modes Modal - Web */}
      <DefaultModal
        isVisible={showModesModal && Platform.OS === 'web'}
        handleClose={onCloseModesModal}
      >
        <ThemeText style={{ fontSize: 20, fontWeight: 'bold' }}>
          {i18n.t('group.chooseModes')}
        </ThemeText>
        <FlatList
          data={shownLearningModes}
          keyExtractor={(item) => item.text}
          contentContainerStyle={{ marginBottom: 20 }}
          renderItem={renderLearningModeItem}
        />
        <PressableButton
          onPress={onNavigateToLearn}
          text={i18n.t('group.cardList.learnButton')}
          buttonStyle={{ width: '100%' }}
        />
      </DefaultModal>

      {/* Add Card Modal */}
      <AddCardModal
        showAddModal={showAddModal}
        setShowAddModal={onCloseAddModal}
        groupId={groupId}
      />

      {/* Edit Group Modal */}
      <DefaultModal isVisible={showEditModal} handleClose={onCloseEditModal}>
        <ThemeText>{i18n.t('group.changeTitle')}</ThemeText>
        <AddInput
          value={groupTitle}
          onChangeText={setGroupTitle}
          placeholder={i18n.t('group.inputPlaceholder')}
        />

        <PressableButton
          text={i18n.t('group.changeButton')}
          onPress={onUpdateGroup}
          buttonStyle={{ marginVertical: 20 }}
        />

        <Pressable onPress={onRemoveGroup}>
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
                <PressableButton text="Перемістити" onPress={onMoveGroup} />
              </View>
            </View>
          )}
        </View>
      </DefaultModal>
    </>
  );
};
