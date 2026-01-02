import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ICard } from '@/common/enums/types/card.type';
import { i18n } from '@/localization/i18n';
import {
  filterCardsByStatus,
  rangeCards,
  resetFilter,
  setRangeLimit,
  sortCards,
} from '@/redux/cardReducer/cardSlice';

import { useAppDispatch, useAppSelector } from '../redux.hooks';

type ViewMode = 'list' | 'cards';

const useGroupFilters = (cards: ICard[]) => {
  const dispatch = useAppDispatch();
  const { rangeLimit, sortValue, sortOrder } = useAppSelector(
    (state) => state.cards,
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    if (rangeLimit === 0) {
      setRangeLimit();
    }
  }, []);

  const statusCardsButtons = useMemo(
    () => [
      {
        title: i18n.t('group.studying'),
        status: 'To Learn',
        amount: 0,
        color: '#32C74D',
        icon: 'radio-button-unchecked',
      },
      {
        title: i18n.t('group.reviewed'),
        status: 'Repeated',
        amount: 0,
        color: '#62CBE9',
        icon: 'check-circle',
      },
      {
        title: i18n.t('group.known'),
        status: 'Know',
        amount: 0,
        color: '#a8a800',
        icon: 'refresh',
      },
    ],
    [],
  );

  const onChangeCardsRange = useCallback(
    (value: number) => {
      dispatch(rangeCards(value));
    },
    [cards.length, dispatch],
  );

  const decWordsRange = useCallback(() => {
    if (rangeLimit > 2) {
      onChangeCardsRange(rangeLimit - 1);
    }
  }, [rangeLimit, onChangeCardsRange]);

  const incWordsRange = useCallback(() => {
    if (rangeLimit < cards.length) {
      onChangeCardsRange(rangeLimit + 1);
    }
  }, [rangeLimit, cards.length, onChangeCardsRange]);

  const handleStatusFilter = useCallback(
    (status: string) => {
      if (selectedStatus === status) {
        setSelectedStatus(null);
        dispatch(resetFilter());
      } else {
        setSelectedStatus(status);
        dispatch(filterCardsByStatus({ status }));
      }
    },
    [selectedStatus, dispatch],
  );

  const toggleFilters = useCallback(() => {
    setShowFilterModal((prev) => !prev);
  }, []);

  const resetFilters = useCallback(() => {
    dispatch(resetFilter());
    setSelectedStatus(null);
  }, [dispatch]);

  return {
    showFilterModal,
    sort: sortValue,
    sortOrder,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    statusCardsButtons,
    setViewMode,
    toggleFilters,
    onChangeCardsRange,
    decWordsRange,
    incWordsRange,
    handleStatusFilter,
    resetFilters,
    rangeLimit,
  };
};

export { useGroupFilters };
