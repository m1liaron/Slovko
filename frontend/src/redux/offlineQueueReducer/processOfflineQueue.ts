import {
  addCard,
  removeCard,
  updateCard,
  updateCardsAfterLearn,
} from '../cardReducer/cardSlice';
import { addManyCards } from '../cardReducer/cardThunk';
import { addGroup, removeGroup, updateGroup } from '../groupReducer/groupThunk';
import { saveResults } from '../resultReducer/resultThunk';
import {
  addSharedGroup,
  copySharedGroup,
  removeSharedGroup,
} from '../sharedGroupReducer/sharedGroupThunk';
import type { AppDispatch, RootState } from '../store';
import {
  buyFreeze,
  updateUser,
  updateUserStreak,
} from '../userReducer/userThunk';

import { dequeueAction } from './offlineQueueSlice';

const thunkMap: Record<string, Function> = {
  // group
  'group/add': addGroup,
  'group/remove': removeGroup,
  'group/update': updateGroup,
  // card
  'card/add-card': addCard,
  'card/add-many': addManyCards,
  'card/update': updateCard,
  'card/remove': removeCard,
  'card/update-cards-learn': updateCardsAfterLearn,
  // results
  'results/save': saveResults,
  // user
  'user/update': updateUser,
  'user/updateUserStreak': updateUserStreak,
  'user/buyFreeze': buyFreeze,
  //shared group
  'sharedGroup/save': addSharedGroup,
  'sharedGroup/copy': copySharedGroup,
  'sharedGroup/remove': removeSharedGroup,
};

let isProcessingQueue = false;

const processOfflineQueue = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    try {
      let { queue } = getState().offlineQueue;

      for (let i = 0; i < queue.length; ) {
        const { type, payload } = queue[i];
        const actionCreator = thunkMap[type];
        if (!actionCreator) {
          i++;
          continue;
        }

        try {
          const result = await dispatch(actionCreator(payload));
          const isConnected = getState().network.isConnected;
          if (!result.type.endsWith('/rejected') || isConnected) {
            const idToRemove = queue[i].id;
            dispatch(dequeueAction(idToRemove));
            queue = getState().offlineQueue.queue;
            continue;
          }
        } catch (error) {
          console.error('Retry failed:', error);
          break;
        }

        i++;
      }
    } finally {
      isProcessingQueue = false;
    }
  };
};

export { processOfflineQueue };
