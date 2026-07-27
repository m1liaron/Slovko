import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import type {
  AddCardRequest,
  UpdateCardRequest,
} from '@/common/enums/types/types';

import { withAuth } from '../services';
import { createAppAsyncThunk } from '../services/createAppAsyncThunk';

export const getCards = createAppAsyncThunk(
  'card/get-cards',
  async ({ groupId }: { groupId: string }) =>
    withAuth((api) => api.get(`/cards/${groupId}`)).then((r) => r.data),
);

export const addCard = createAppAsyncThunk(
  'card/add-card',
  async ({ card, tempId }: { card: AddCardRequest; tempId: string }) =>
    withAuth((api) => api.post('/cards', card)).then((r) => ({
      card: r.data,
      tempId,
    })),
);

export const addManyCards = createAppAsyncThunk(
  'card/add-many',
  async (cards: AddCardRequest[]) =>
    withAuth((api) => api.post('/cards/many', { cards })).then((r) => ({
      cards: r.data,
    })),
);

export const removeCard = createAppAsyncThunk(
  'card/remove',
  async (cardId: string) =>
    withAuth((api) => api.delete(`/cards/${cardId}`)).then((r) => r.data),
);

export const updateCard = createAppAsyncThunk(
  'card/update',
  async (data: UpdateCardRequest) =>
    withAuth((api) => api.patch(`/cards/${data.id}`, data)).then((r) => r.data),
);

export const updateCardsAfterLearn = createAppAsyncThunk(
  'card/update-cards-learn',
  async (data: string[]) =>
    withAuth((api) => api.put('/cards/learn', data || {})).then((r) => r.data),
);

export const getRepeatedCards = createAppAsyncThunk(
  'card/getRepeatedCards',
  async ({ sectionId }: { sectionId: string }) =>
    withAuth((api) => api.get(`/cards/repeated/${sectionId}`)).then(
      (r) => r.data,
    ),
);

export const getRepeatedCardsFromIds = createAppAsyncThunk(
  'card/getRepeatedCardsFromIds',
  async (data: string[]) =>
    withAuth((api) => api.post('/cards/repeated', data)).then((r) => r.data),
);
