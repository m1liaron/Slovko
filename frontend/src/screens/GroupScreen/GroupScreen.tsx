import type { StackScreenProps } from '@react-navigation/stack';
import { View } from 'moti';

import { LineLoader } from '@/common/components/LineLoader/LineLoader';
import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import type { AppPath } from '@/common/enums/app/AppPath';
import CardList from '@/components/Card/CardList/CardList';
import { useResponsive } from '@/hooks';
import {
  useGroupFilters,
  useGroupModals,
  useGroupNavigation,
  useGroupScreen,
} from '@/hooks/GroupScreen';
import type { RootStackParamList } from '@/navigation/ProtectedRoute/ProtectedRoute';

import { GroupActions } from './components/GroupActions/GroupActions';
import { GroupFilters } from './components/GroupFilters/GroupFilters';
import { GroupHeader } from './components/GroupHeader/GroupHeader';
import { GroupModals } from './components/GroupModals/GroupsModal';
import { GroupProgress } from './components/GroupProgress/GroupProgress';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import BackButton from '@/components/BackButton/BackButton';

type GroupScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.Group
>;

const GroupScreen: React.FC<GroupScreenProps> = ({ route }) => {
  const { groupId } = route.params as { groupId: string };
  const { isDesktop, width } = useResponsive();

  const maxContentWidth = isDesktop ? 1200 : width;

  const {
    group: groupData,
    groups,
    cards,
    filteredCards,
    isLoading,
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

  const filterState = useGroupFilters(cards, filteredCards);
  const modalState = useGroupModals();
  const navigationHandlers = useGroupNavigation(
    groupId,
    modalState.setShowModesModal,
  );

  if (!group) {
    return (
      <ThemeBackground>
        <BackButton />
        <ThemeText>I am so sorry, your group was not found</ThemeText>
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
        />

        {isLoading && <LineLoader />}

        <GroupProgress
          learnedCards={learnedCards}
          filteredCardsLength={filteredCards.length}
          progressPercentage={progressPercentage}
          isDesktop={isDesktop}
        />
      </View>

      <View
        style={{
          flexShrink: isDesktop ? 0 : 1,
          height: isDesktop ? 500 : 'auto',
          paddingHorizontal: isDesktop ? 32 : 0,
        }}
      >
        <CardList groupId={groupId} />
      </View>

      <GroupActions
        hasCards={cards.length > 1}
        onLearn={modalState.openModesModal}
        onAddCard={modalState.openAddModal}
      />

      {filterState.showFilterModal && (
        <GroupFilters
          isDesktop={isDesktop}
          wordsRangeNumber={filterState.wordsRangeNumber}
          filteredCardsLength={filteredCards.length}
          cardsLength={cards.length}
          sort={filterState.sort}
          sortOrder={filterState.sortOrder}
          selectedStatus={filterState.selectedStatus}
          statusButtons={filterState.statusCardsButtons}
          onChangeCardsRange={filterState.onChangeCardsRange}
          onDecrement={filterState.decWordsRange}
          onIncrement={filterState.incWordsRange}
          onSortChange={filterState.setSort}
          onSortOrderChange={filterState.setSortOrder}
          onStatusFilter={filterState.handleStatusFilter}
          onResetFilters={filterState.resetFilters}
        />
      )}

      <GroupModals
        groupId={groupId}
        group={group}
        groupTitle={navigationHandlers.groupTitle}
        setGroupTitle={navigationHandlers.setGroupTitle}
        filteredCards={filteredCards}
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
          navigationHandlers.navigateToLearn(filterState.wordsRangeNumber)
        }
        onUpdateGroup={navigationHandlers.updateGroupTitle}
        onRemoveGroup={navigationHandlers.handleRemoveGroup}
        onMoveGroup={navigationHandlers.handleMoveGroup}
      />
    </ThemeBackground>
  );
};

export default GroupScreen;
