import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CardFields } from '@/common/enums/app/CardFields';
import { cardsAdapter } from './cardSlice';
import { ICard } from '@/common/enums/types/card.type';

const selectCardState = (state: RootState) => state.cards;
const adapterSelectors = cardsAdapter.getSelectors(selectCardState);

export const selectVisibleCardsByGroup = createSelector(
  [
    adapterSelectors.selectAll,
    (_state: RootState, groupId: string) => groupId,
    selectCardState,
  ],
  (
    allCards: ICard[],
    groupId: string,
    {
      filterValue,
      sortValue,
      sortOrder,
      rangeLimit,
    }: {
      filterValue: string;
      sortValue: string;
      sortOrder: string;
      rangeLimit: number;
    },
  ) => {
    let result = allCards.filter((card) => card.groupId === groupId);

    if (filterValue) {
      result = result.filter((c) => c.status === filterValue);
    }

    const sortedResult = [...result].sort((a, b) => {
      const valA = a[sortValue as keyof ICard];
      const valB = b[sortValue as keyof ICard];

      let comparison = 0;

      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else if (
        valA === CardFields.createdAt &&
        valB === CardFields.nextReviewAt
      ) {
        const timeA = new Date(valA).getTime();
        const timeB = new Date(valB).getTime();

        comparison = timeA - timeB;
      } else {
        comparison = (valA as number) - (valB as number);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return rangeLimit > 0 ? result.slice(0, rangeLimit) : result;
  },
);

export const selectCardsByGroupId = createSelector(
  [adapterSelectors.selectAll, (_state: RootState, groupId: string) => groupId],
  (allCards: ICard[], groupId: string) => {
    return allCards.filter((card) => card.groupId === groupId);
  },
);
