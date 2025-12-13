import {
  type PayloadAction,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import type { ICard, IRepeatedGroup } from '@/common/enums/types/types';

import { DataStatus, type IDataStatus } from '../../common/enums/app/app';
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
  cards: ICard[];
  globalCards: ICard[];
  filteredCards: ICard[];
  repeatedCards: IRepeatedGroup[];
  shownModes: Record<LearningMode, boolean>;
  lastFetchedSuccessfully: boolean;
  status: IDataStatus;
  error: undefined | null | string;
  isLoading: boolean;
}

const initialState: InitialState = {
  cards: [],
  globalCards: [],
  filteredCards: [],
  repeatedCards: [],
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
      state.cards.push(...data);
      state.globalCards.push(...data);
      state.filteredCards.push(...data);
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
      state.cards.push(newCardData);
      state.globalCards.push(newCardData);
    },
    updateStateCard: (state, action) =>
      handleUpdateState(state, action, 'cards'),
    removeStateCard: (state, action) => {
      const id = action.payload;
      state.cards = state.cards.filter((card) => card.id !== id);
      state.filteredCards = state.filteredCards.filter(
        (card) => card.id !== id,
      );
      state.globalCards = state.globalCards.filter((card) => card.id !== id);
    },
    rangeCards: (state, action) => {
      if (action.payload) {
        const limit = action.payload;
        const source =
          limit > state.cards.length ? state.filteredCards : state.cards;
        state.cards = source.slice(0, limit);
        state.isLoading = false;
      }
    },
    sortCards: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.isLoading = true;
      state.cards.sort((a, b) => {
        const timeA = new Date(a.nextReviewAt).getTime();
        const timeB = new Date(b.nextReviewAt).getTime();

        if (action.payload === 'asc') {
          return timeA - timeB; // Ascending order
        }
        return timeB - timeA;
      });
      state.isLoading = false;
    },
    filterCardsByStatus: (state, action) => {
      state.cards = state.filteredCards.filter(
        (card) => card.status === action.payload.status,
      );
    },
    resetFilter: (state) => {
      state.cards = [...state.filteredCards];
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
        state.cards = fresh;
        state.filteredCards = fresh;

        const existingIds = new Set(state.globalCards.map((c) => c.id));
        const newCards = fresh.filter(
          (card: ICard) => !existingIds.has(card.id),
        );

        state.globalCards = [...state.globalCards, ...newCards];
      })
      .addCase(getCards.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCardsStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.cards = action.payload;
        }
      })
      .addCase(updateCardsAfterLearn.fulfilled, (state, action) => {
        state.cards = action.payload;
        state.filteredCards = action.payload;
      })
      .addCase(addCard.fulfilled, (state, action) => {
        // const { tempId, card } = action.payload;
        // if (tempId) {
        // 	state.cards = state.cards.filter((card) => card.id !== tempId);
        // 	state.filteredCards = state.filteredCards.filter(
        // 		(card) => card.id !== tempId,
        // 	);
        // 	state.globalCards = state.globalCards.filter(
        // 		(card) => String(card.id) !== String(tempId),
        // 	);

        // 	state.cards.push(card);
        // 	state.globalCards.push(card);
        // }
        state.cards.push(action.payload.card);
        state.filteredCards.push(action.payload.card);
      })
      .addCase(addManyCards.fulfilled, (state, action) => {
        if (action.payload.cards.length > 0) {
          state.cards.push(...action.payload.cards);
          state.filteredCards.push(...action.payload.cards);
          state.globalCards.push(...action.payload.cards);
        }
      })
      // remove card
      .addCase(removeCard.fulfilled, (state, action) => {
        const filteredCards = state.cards.filter(
          (card) => card.id !== action.payload,
        );
        state.cards = filteredCards;
        state.filteredCards = filteredCards;
        state.globalCards = filteredCards;
      })
      // update card
      .addCase(updateCard.fulfilled, (state, action) => {
        const updatedCard = action.payload;
        const index = state.cards.findIndex(
          (card) => card.id === updatedCard.id,
        );
        if (index !== -1) {
          state.cards[index] = updatedCard;
          state.filteredCards[index] = updatedCard;
          state.cards = [...state.cards];
          state.filteredCards = [...state.filteredCards];
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
  rangeCards,
  sortCards,
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
export const cardReducers = cardSlice.reducer;
