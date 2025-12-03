import { ICard } from '@/common/enums/types/card.type';
import { useAppDispatch } from '../redux.hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { i18n } from '@/localization/i18n';
import {
  filterCardsByStatus,
  rangeCards,
  resetFilter,
} from '@/redux/cardReducer/cardSlice';

type ViewMode = 'list' | 'cards';
type SortOrder = 'asc' | 'desc';

const useGroupFilters = (cards: ICard[], filteredCards: ICard[]) => {
  const dispatch = useAppDispatch();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [wordsRangeNumber, setWordsRangeNumber] = useState(cards?.length || 2);
  const [sort, setSort] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    setWordsRangeNumber(filteredCards.length);
  }, [filteredCards.length]);

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
      setWordsRangeNumber(value);
      if (value !== cards.length && value >= 2) {
        dispatch(rangeCards(Math.floor(value)));
      }
    },
    [cards.length, dispatch],
  );

  const decWordsRange = useCallback(() => {
    if (wordsRangeNumber > 2) {
      onChangeCardsRange(wordsRangeNumber - 1);
    }
  }, [wordsRangeNumber, onChangeCardsRange]);

  const incWordsRange = useCallback(() => {
    if (wordsRangeNumber < filteredCards.length) {
      onChangeCardsRange(wordsRangeNumber + 1);
    }
  }, [wordsRangeNumber, filteredCards.length, onChangeCardsRange]);

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
    wordsRangeNumber,
    sort,
    sortOrder,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    statusCardsButtons,
    setSort,
    setSortOrder,
    setViewMode,
    toggleFilters,
    onChangeCardsRange,
    decWordsRange,
    incWordsRange,
    handleStatusFilter,
    resetFilters,
  };
};

export { useGroupFilters };
