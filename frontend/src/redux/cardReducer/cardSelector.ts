import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CardFields } from '@/common/enums/app/CardFields';

export const selectVisibleCards = createSelector(
  [
    (state: RootState) => state.cards.globalCards,
    (state: RootState) => state.cards.filterValue,
    (state: RootState) => state.cards.sortValue,
    (state: RootState) => state.cards.sortOrder,
    (state: RootState) => state.cards.rangeLimit,
  ],
  (cards, filter, sort, order, range) => {
    let result = [...cards];

    if (filter) {
      result = result.filter((c) => c.status === filter);
    }

    if (sort === CardFields.createdAt || sort === CardFields.nextReviewAt) {
      result.sort((a, b) => {
        const timeA = new Date(a[sort]).getTime();
        const timeB = new Date(b[sort]).getTime();
        return order === 'asc' ? timeA - timeB : timeB - timeA;
      });
    } else if (sort === CardFields.word) {
      result.sort((a, b) => {
        const comparison = a.word.localeCompare(b.word);
        return order === 'asc' ? comparison : -comparison;
      });
    } else if (sort === CardFields.reviewCount) {
      result.sort((a, b) => {
        const comparison = a.reviewCount - b.reviewCount;
        return order === 'asc' ? comparison : -comparison;
      });
    }

    // 3. Apply range
    if (range && range < result.length) {
      result = result.slice(0, range);
    }

    return result;
  },
);
