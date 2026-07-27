import type { StackScreenProps } from '@react-navigation/stack';
import { View } from 'moti';

import { LineLoader } from '@/common/components/LineLoader/LineLoader';
import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { AppPath } from '@/common/enums/app/AppPath';
import { DataStatus } from '@/common/enums/app/DataStatus';
import BackButton from '@/components/BackButton/BackButton';
import CardList from '@/components/Card/CardList/CardList';
import { useResponsive } from '@/hooks';
import {
  useGroupFilters,
  useGroupModals,
  useGroupNavigation,
  useGroupScreen,
} from '@/hooks/GroupScreen';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { RootStackParamList } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { selectVisibleCardsByGroup } from '@/redux/cardReducer/cardSelector';

import { GroupActions } from './components/GroupActions/GroupActions';
import { GroupFilters } from './components/GroupFilters/GroupFilters';
import { GroupHeader } from './components/GroupHeader/GroupHeader';
import { GroupModals } from './components/GroupModals/GroupsModal';
import { GroupProgress } from './components/GroupProgress/GroupProgress';

type GroupScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.Group
>;

const GroupScreen: React.FC<GroupScreenProps> = ({ route }) => {
  const dispatch = useAppDispatch();
  const { rangeLimit, status } = useAppSelector((state) => state.cards);
  const { groupId } = route.params as { groupId: string };
  const cards =
    useAppSelector((state) => selectVisibleCardsByGroup(state, groupId)) ?? [];

  const { isDesktop, width } = useResponsive();

  const maxContentWidth = isDesktop ? 1200 : width;
  const isLoading = status === DataStatus.PENDING;

  const {
    group: groupData,
    groups,
    progressPercentage,
    learnedCards,
  } = useGroupScreen(groupId);

  let group = groupData;
  if (!group) {
    const findGroup = groups.find((group) => group.id === groupId);
    if (findGroup) {
      group = findGroup;
    }
  }

  const filterState = useGroupFilters(cards);

  const modalState = useGroupModals();
  const navigationHandlers = useGroupNavigation(
    groupId,
    modalState.setShowModesModal,
  );

  if (!group) {
    return (
      <ThemeBackground>
        <BackButton />
        <ThemeText>{i18n.t('group.groupNotFound')}</ThemeText>
      </ThemeBackground>
    );
  }

  return (
    <ThemeBackground style={{ padding: 0, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: maxContentWidth }}>
        <GroupHeader
          group={group}
          viewMode={filterState.viewMode}
          showFilterModal={filterState.showFilterModal}
          onViewModeChange={filterState.setViewMode}
          onToggleFilters={filterState.toggleFilters}
          onOpenSettings={modalState.openEditModal}
          cards={cards}
        />

        {isLoading && <LineLoader />}

        <GroupProgress
          learnedCards={learnedCards}
          shownCardsLength={cards.length}
          progressPercentage={progressPercentage}
          isDesktop={isDesktop}
        />
      </View>

      <CardList shownCards={cards} groupId={groupId} />

      <GroupActions
        hasCards={cards.length > 1}
        isLoading={isLoading}
        onLearn={modalState.openModesModal}
        onAddCard={modalState.openAddModal}
      />

      {filterState.showFilterModal && (
        <GroupFilters
          cardsLength={cards.length}
          shownCards={cards}
          sort={filterState.sort}
          sortOrder={filterState.sortOrder}
          selectedStatus={filterState.selectedStatus}
          statusButtons={filterState.statusCardsButtons}
          onChangeCardsRange={filterState.onChangeCardsRange}
          onDecrement={filterState.decWordsRange}
          onIncrement={filterState.incWordsRange}
          onStatusFilter={filterState.handleStatusFilter}
          onResetFilters={filterState.resetFilters}
        />
      )}

      <GroupModals
        groupId={groupId}
        newSectionId={navigationHandlers.newSectionId}
        setNewSectionId={navigationHandlers.setNewSectionId}
        group={group}
        shownCards={cards}
        groupTitle={navigationHandlers.groupTitle}
        setGroupTitle={navigationHandlers.setGroupTitle}
        showModesModal={modalState.showModesModal}
        showEditModal={modalState.showEditModal}
        showAddModal={modalState.showAddModal}
        showSectionList={navigationHandlers.showSectionList}
        toggleSectionList={navigationHandlers.toggleSectionList}
        shownLearningModes={modalState.shownLearningModes}
        onCloseModesModal={modalState.closeModesModal}
        onCloseEditModal={modalState.closeEditModal}
        onCloseAddModal={modalState.closeAddModal}
        onChangeLearningMode={modalState.onChangeLearningModeShown}
        onNavigateToLearn={() =>
          navigationHandlers.navigateToLearn(filterState.rangeLimit)
        }
        onUpdateGroup={navigationHandlers.updateGroupTitle}
        onRemoveGroup={navigationHandlers.handleRemoveGroup}
        onMoveGroup={navigationHandlers.handleMoveGroup}
      />
    </ThemeBackground>
  );
};

export default GroupScreen;
