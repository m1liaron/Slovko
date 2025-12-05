import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import type {
  AddCardRequest,
  ICard,
  UpdateCardRequst,
} from '@/common/enums/types/types';
import { getStorageItem } from '@/utils/storage';

import { createAuthorizedInstance } from '../../utils/createAuthorizedInstance';
import { createAppAsyncThunk } from '../services/createAppAsyncThunk';

export const getCards = createAppAsyncThunk(
  'card/get-cards',
  async ({ groupId }: { groupId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(`/cards/${groupId}`);
    return response.data;
  },
);

export const getCardsStorage = createAppAsyncThunk(
  'card/get-cards-storage',
  async ({ groupId }: { groupId: string }) => {
    const storage = await getStorageItem(AsyncStorageVariables.PERSIST_ROOT);
    if (!storage) {
      return null;
    }
    const cards = JSON.parse(JSON.parse(storage).cards).globalCards;
    const filteredCards = cards.filter(
      (card: ICard) => card.groupId === groupId,
    );

    return filteredCards;
  },
);

export const addCard = createAppAsyncThunk(
  'card/add-card',
  async ({ card, tempId }: { card: AddCardRequest; tempId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.post('/cards', card);
    return { card: response.data, tempId };
  },
);

export const addManyCards = createAppAsyncThunk(
  'card/add-many',
  async (data: { cards: AddCardRequest[]; tempId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.post('/cards/many', {
      cards: data.cards,
    });
    return { cards: response.data, tempId: data };
  },
);

export const removeCard = createAppAsyncThunk(
  'card/remove',
  async (cardId: string) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.delete(`/cards/${cardId}`);
    return response.data;
  },
);

export const updateCard = createAppAsyncThunk(
  'card/update',
  async (data: UpdateCardRequst) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.patch(`/cards/${data.id}`, data);
    return response.data;
  },
);

export const updateCardsAfterLearn = createAppAsyncThunk(
  'card/update-cards-learn',
  async (data: string[]) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.put('/cards/learn', data || {});
    return response.data;
  },
);

export const getRepeatedCards = createAppAsyncThunk(
  'card/getRepeatedCards',
  async ({ sectionId }: { sectionId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(`/cards/repeated/${sectionId}`);
    return response.data;
  },
);

export const getRepeatedCardsFromIds = createAppAsyncThunk(
  'card/getRepeatedCardsFromIds',
  async (data: string[]) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.post('/cards/repeated', data);
    return response.data;
  },
);
