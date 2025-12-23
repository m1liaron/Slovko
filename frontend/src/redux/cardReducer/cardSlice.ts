import {
  type PayloadAction,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import type { ICard, IRepeatedGroup } from '@/common/enums/types/types';

import {
  CardFields,
  DataStatus,
  type IDataStatus,
} from '../../common/enums/app/app';
import { handleUpdateState } from '../services/handleUpdateState';
import type { RootState } from '../store';

import {
  addCard,
  addManyCards,
  getCards,
  getCardsStorage,
  getRepeatedCards,
  getRepeatedCardsFromIds,
  removeCard,
  updateCard,
  updateCardsAfterLearn,
} from './cardThunk';

export type LearningMode = 'cards' | 'quiz' | 'word' | 'check';

interface InitialState {
  globalCards: ICard[];
  cards: ICard[];
  filteredCards: ICard[];
  repeatedCards: IRepeatedGroup[];
  sortOrder: 'asc' | 'desc';
  sortValue: keyof typeof CardFields;
  filterValue: string;
  rangeLimit: number;
  shownModes: Record<LearningMode, boolean>;
  lastFetchedSuccessfully: boolean;
  status: IDataStatus;
  error: undefined | null | string;
  isLoading: boolean;
}

const initialState: InitialState = {
  globalCards: [],
  cards: [],
  filteredCards: [],
  repeatedCards: [],
  sortOrder: 'asc',
  sortValue: 'word',
  filterValue: '',
  rangeLimit: 0,
  shownModes: {
    cards: true, // always
    quiz: true,
    word: true,
    check: true,
  },
  lastFetchedSuccessfully: false,
  status: DataStatus.IDLE,
  error: null,
  isLoading: false,
};

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addStateManyCards: (state, action) => {
      const data = action.payload.cards;
      state.globalCards.push(...data);
      state.cards.push(...data);
      state.rangeLimit = data.length;
    },
    addStateCard: (state, action) => {
      const { card: newCard, tempId } = action.payload;
      const existingGroup = state.cards.find(
        (card) =>
          card.word === newCard.word && card.groupId === newCard.groupId,
      );
      if (existingGroup) {
        throw new Error('Card with this name already exist');
      }
      const newCardData = {
        id: tempId,
        ...newCard,
      };
      state.globalCards.push(newCardData);
      state.cards.push(newCardData);
    },
    updateStateCard: (state, action) =>
      handleUpdateState(state, action, 'cards'),
    removeStateCard: (state, action) => {
      const id = action.payload;
      state.globalCards = state.globalCards.filter((card) => card.id !== id);
    },
    setRangeLimit: (state, action) => {
      state.rangeLimit = action.payload;
    },
    rangeCards: (state, action) => {
      state.rangeLimit = Math.floor(action.payload);
      state.isLoading = false;
    },
    sortCards: (
      state,
      action: PayloadAction<{ sort: keyof typeof CardFields }>,
    ) => {
      const { sort } = action.payload;

      state.isLoading = true;
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      state.sortValue = sort;

      state.isLoading = false;
    },
    toggleCardsSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    filterCardsByStatus: (state, action) => {
      state.filterValue = action.payload.status;
    },
    resetFilter: (state) => {
      state.filterValue = '';
      state.sortOrder = 'asc';
      state.sortValue = 'word';
      state.rangeLimit = state.cards.length;

      state.isLoading = false;
    },
    addLearningMode: (
      state,
      action: PayloadAction<{ sectionName: LearningMode }>,
    ) => {
      const { sectionName } = action.payload;
      if (!sectionName.length) return;

      const prev = state.shownModes[sectionName];
      state.shownModes[sectionName] = !prev;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCards.fulfilled, (state, action) => {
        const fresh = action.payload;
        state.globalCards = fresh;
        state.cards = fresh;
      })
      .addCase(getCards.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCardsStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.globalCards = action.payload;
          state.cards = action.payload;
        }
      })
      .addCase(updateCardsAfterLearn.fulfilled, (state, action) => {
        state.cards = action.payload;
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.globalCards.push(action.payload.card);
        state.cards.push(action.payload.card);
      })
      .addCase(addManyCards.fulfilled, (state, action) => {
        if (action.payload.cards.length > 0) {
          state.globalCards.push(...action.payload.cards);
          state.cards.push(...action.payload.cards);
        }
      })
      // remove card
      .addCase(removeCard.fulfilled, (state, action) => {
        state.globalCards.filter((card) => card.id !== action.payload);
        state.cards.filter((card) => card.id !== action.payload);
      })
      // update card
      .addCase(updateCard.fulfilled, (state, action) => {
        const updatedCard = action.payload;
        const index = state.cards.findIndex(
          (card) => card.id === updatedCard.id,
        );
        if (index !== -1) {
          state.globalCards[index] = updatedCard;
          state.cards[index] = updatedCard;
        }
      })
      // get repeated cards
      .addCase(getRepeatedCards.fulfilled, (state, action) => {
        state.repeatedCards = action.payload;
      })
      // get repeated cards
      .addCase(getRepeatedCardsFromIds.fulfilled, (state, action) => {
        state.cards = action.payload;
      })

      .addMatcher(isPending, (state) => {
        state.status = DataStatus.PENDING;
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        state.lastFetchedSuccessfully = true;
        state.isLoading = false;
      })
      .addMatcher(isRejected, (state, action) => {
        state.status = DataStatus.ERROR;
        state.lastFetchedSuccessfully = false;
        state.isLoading = false;
        const payload = action.payload as { message?: string } | undefined;
        state.error = payload?.message ?? action.error.message;
      });
  },
});

export const {
  addStateCard,
  addStateManyCards,
  updateStateCard,
  removeStateCard,
  filterCardsByStatus,
  resetFilter,
  setRangeLimit,
  rangeCards,
  sortCards,
  toggleCardsSortOrder,
  addLearningMode,
} = cardSlice.actions;
export const selectCard = (state: RootState) => state.cards.cards;
export {
  getCards,
  addCard,
  removeCard,
  updateCard,
  updateCardsAfterLearn,
  getRepeatedCards,
  getRepeatedCardsFromIds,
} from './cardThunk';
export const cardReducer = cardSlice.reducer;
