import type { EntityState } from '@reduxjs/toolkit';
import {
  type PayloadAction,
  createEntityAdapter,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import type {
  AddCardRequest,
  ICard,
  IRepeatedGroup,
} from '@/common/enums/types/types';

import type { CardFields } from '../../common/enums/app/app';
import { DataStatus, type IDataStatus } from '../../common/enums/app/app';
import type { RootState } from '../store';

import {
  addCard,
  addManyCards,
  getCards,
  getRepeatedCards,
  getRepeatedCardsFromIds,
  removeCard,
  updateCard,
  updateCardsAfterLearn,
} from './cardThunk';

export type LearningMode = 'cards' | 'quiz' | 'word' | 'check';

interface CardMetadata {
  repeatedCards: IRepeatedGroup[];
  repeatedIds: string[];
  sortOrder: 'asc' | 'desc';
  sortValue: keyof typeof CardFields;
  filterValue: string;
  rangeLimit: number;
  shownModes: Record<LearningMode, boolean>;
  lastFetchedSuccessfully: boolean;
  status: IDataStatus;
  errorMessage: string | null;
}

type InitialState = EntityState<ICard, string> & CardMetadata;

const cardsAdapter = createEntityAdapter<ICard>({
  sortComparer: (a, b) => a.word.localeCompare(b.word),
});

const initialState: InitialState = cardsAdapter.getInitialState({
  repeatedCards: [],
  repeatedIds: [],
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
  errorMessage: null,
});

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addStateManyCards: {
      prepare: (cards: AddCardRequest[]) => ({
        payload: cards.map((card) => ({
          ...card,
          id: uuid(),
          reviewCount: 0,
          nextReviewAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'To Learn',
          definition: '',
          example: '',
          image: { url: '' },
          learnedAt: null,
        })) as ICard[],
      }),
      reducer: (state, action: PayloadAction<ICard[]>) => {
        cardsAdapter.addMany(state, action.payload);
      },
    },
    addStateCard: (state, action: PayloadAction<ICard>) => {
      cardsAdapter.addOne(state, action.payload);
    },
    updateStateCard: (state, action) => {
      cardsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    removeStateCard: (state, action) => {
      const id = action.payload;
      cardsAdapter.removeOne(state, id);
    },
    removeStateGroupCards: (state, action) => {
      const idsToRemove = Object.values(state.entities)
        .filter((card) => card.groupId === action.payload.groupId)
        .map((card) => card!.id);

      cardsAdapter.removeMany(state, idsToRemove);
    },
    setRangeLimit: (state, action) => {
      state.rangeLimit = action.payload;
    },
    sortCards: (
      state,
      action: PayloadAction<{ sort: keyof typeof CardFields }>,
    ) => {
      const { sort } = action.payload;
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      state.sortValue = sort;
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
        cardsAdapter.setAll(state, action.payload);
      })
      .addCase(addCard.fulfilled, (state, action) => {
        cardsAdapter.addOne(state, action.payload.card);
      })
      .addCase(addManyCards.fulfilled, (state, action) => {
        cardsAdapter.addMany(state, action.payload.cards);
      })
      // remove card
      .addCase(removeCard.fulfilled, (state, action) => {
        cardsAdapter.removeOne(state, action.payload.id);
      })
      // update card
      .addCase(updateCard.fulfilled, (state, action) => {
        cardsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })
      // get repeated cards
      .addCase(getRepeatedCards.fulfilled, (state, action) => {
        state.repeatedCards = action.payload;
      })
      .addCase(getRepeatedCardsFromIds.fulfilled, (state, action) => {
        state.repeatedIds = action.payload;
      })
      .addCase(updateCardsAfterLearn.fulfilled, (state, action) => {
        cardsAdapter.upsertMany(state, action.payload);
      })

      .addMatcher(isPending, (state) => {
        state.status = DataStatus.PENDING;
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = DataStatus.SUCCESS;
        state.errorMessage = null;
        state.lastFetchedSuccessfully = true;
      })
      .addMatcher(isRejected, (state, action) => {
        state.status = DataStatus.ERROR;
        state.lastFetchedSuccessfully = false;
        const payload = action.payload as { message?: string } | undefined;
        state.errorMessage =
          payload?.message ?? action.error.message ?? 'Unknown Error';
      });
  },
});

export const {
  addStateCard,
  addStateManyCards,
  updateStateCard,
  removeStateCard,
  removeStateGroupCards,
  filterCardsByStatus,
  resetFilter,
  setRangeLimit,
  sortCards,
  toggleCardsSortOrder,
  addLearningMode,
} = cardSlice.actions;
export const selectCard = (state: RootState) => state.cards.entities;
export {
  getCards,
  addCard,
  removeCard,
  updateCard,
  updateCardsAfterLearn,
  getRepeatedCards,
  getRepeatedCardsFromIds,
} from './cardThunk';
export { cardsAdapter };
export const cardReducer = cardSlice.reducer;
