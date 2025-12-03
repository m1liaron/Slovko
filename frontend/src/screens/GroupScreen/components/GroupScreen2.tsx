import { LineLoader } from '@/common/components/LineLoader/LineLoader';
import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import { AppPath } from '@/common/enums/app/AppPath';
import { useResponsive } from '@/hooks';
import { useGroupScreen } from '@/hooks/GroupScreen';
import { RootStackParamList } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'moti';
import { GroupHeader } from './GroupHeader/GroupHeader';
import { GroupProgress } from './GroupProgress/GroupProgress';
import CardList from '@/components/Card/CardList/CardList';
import { GroupActions } from './GroupActions/GroupActions';
import { GroupFilters } from './GroupFilters/GroupFilters';

type GroupScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.Group
>;

const GroupScreen: React.FC<GroupScreenProps> = ({ route }) => {
  const { groupId } = route.params as { groupId: string };
  const { isDesktop, width } = useResponsive();

  const maxContentWidth = isDesktop ? 1200 : width;

  const {
    group,
    cards,
    filteredCards,
    isLoading,
    progressPercentage,
    learnedCards,
    totalCards,
  } = useGroupScreen(groupId);

  const filterState = useGroupFilters(cards, filteredCards);
  const modalState = useGroupModals(groupId, filterState.wordsRangeNumber);
  const navigationHandlers = useGroupNavigation(groupId);

  if (!group) {
    return (
      <ThemeBackground style={{ padding: 0, alignItems: 'center' }}>
        <LineLoader />
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
        filteredCards={filteredCards}
        showModesModal={modalState.showModesModal}
        showEditModal={modalState.showEditModal}
        showAddModal={modalState.showAddModal}
        shownLearningModes={modalState.shownLearningModes}
        onCloseModesModal={modalState.closeModesModal}
        onCloseEditModal={modalState.closeEditModal}
        onCloseAddModal={modalState.closeAddModal}
        onChangeLearningMode={modalState.onChangeLearningModeShown}
        onNavigateToLearn={navigationHandlers.navigateToLearn}
        onUpdateGroup={navigationHandlers.updateGroupTitle}
        onRemoveGroup={navigationHandlers.handleRemoveGroup}
        onMoveGroup={navigationHandlers.handleMoveGroup}
      />
    </ThemeBackground>
  );
};
