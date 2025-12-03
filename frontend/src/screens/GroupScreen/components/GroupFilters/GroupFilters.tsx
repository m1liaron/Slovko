import { Pressable, View, Text } from 'react-native';
import { Select } from '@/common/components/Select/Select';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useResponsive } from '@/hooks';
import { i18n } from '@/localization/i18n';
import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { SetStateAction } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/hooks/redux.hooks';

interface StatusButton {
  status: string;
  title: string;
  icon: string;
  color: string;
}

interface GroupFiltersProps {
  showFilterModal: boolean;

  // Cards to show slider
  wordsRangeNumber: number;
  filteredCards: any[]; // type as per your card object
  cards: any[];
  totalCards: number;
  decWordsRange: () => void;
  incWordsRange: () => void;
  onChangeCardsRange: (value: number) => void;

  // Sort
  sort: string;
  setSort: (item: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (item: string) => void;

  // Status filters
  statusCardsButtons: StatusButton[];
  selectedStatus: string | null;
  handleStatusFilter: (status: string) => void;

  // Dispatch for reset filters
  resetFilter: () => void;
  setSelectedStatus: (item: string | null) => void;
}

const GroupFilters: React.FC<GroupFiltersProps> = ({
  showFilterModal,
  wordsRangeNumber,
  filteredCards,
  cards,
  totalCards,
  decWordsRange,
  incWordsRange,
  onChangeCardsRange,
  sort,
  setSort,
  sortOrder,
  setSortOrder,
  statusCardsButtons,
  selectedStatus,
  handleStatusFilter,
  resetFilter,
  setSelectedStatus,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { isDesktop } = useResponsive();
  const dispatch = useAppDispatch();

  return (
    <>
      {showFilterModal && (
        <View
          style={{
            position: 'absolute',
            top: isDesktop ? 60 : 130,
            left: isDesktop ? '50%' : '0%',
            backgroundColor: colors.background,
            padding: isDesktop ? 32 : 20,
            marginHorizontal: isDesktop ? 32 : 20,
            marginTop: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            opacity: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Feather name="filter" size={20} color={colors.primary} />
            <ThemeText
              style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}
            >
              Filters
            </ThemeText>
          </View>

          <View style={{ gap: 24 }}>
            {/* Cards to show slider */}
            <View>
              <ThemeText
                style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}
              >
                Cards to show
              </ThemeText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <Pressable
                  onPress={decWordsRange}
                  style={{
                    padding: 8,
                    backgroundColor: colors.lightBackground,
                    borderRadius: 8,
                  }}
                >
                  <FontAwesome name="minus" color={colors.primary} size={16} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <ThemeText style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {Math.floor(wordsRangeNumber)}/{filteredCards.length}
                  </ThemeText>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    disabled={filteredCards.length === 0}
                    maximumValue={filteredCards.length}
                    value={wordsRangeNumber}
                    onSlidingComplete={onChangeCardsRange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.lightBackground}
                  />
                </View>
                <Pressable
                  onPress={incWordsRange}
                  style={{
                    padding: 8,
                    backgroundColor: colors.lightBackground,
                    borderRadius: 8,
                  }}
                >
                  <FontAwesome name="plus" color={colors.primary} size={16} />
                </Pressable>
              </View>
            </View>

            {/* Sort by dropdown */}
            <View>
              <ThemeText
                style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}
              >
                Sort by
              </ThemeText>
              <Select
                placeholder="Default order"
                data={[
                  i18n.t('group.sortByDate'),
                  i18n.t('group.sortByName'),
                  i18n.t('group.sortByReviewDate'),
                ]}
                customStyle={{ width: '100%' }}
                currentSelect={sort}
                setCurrentSelect={setSort}
                showSortIcon={true}
                setSortOrder={setSortOrder}
                sortOrder={sortOrder}
              />
            </View>

            {/* Status filters */}
            <View>
              <ThemeText
                style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}
              >
                Status
              </ThemeText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {statusCardsButtons.map(({ status, title, icon, color }) => (
                  <Pressable
                    key={status}
                    onPress={() => handleStatusFilter(status)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor:
                        selectedStatus === status
                          ? colors.lightBackground
                          : 'transparent',
                      borderWidth: 1,
                      borderColor:
                        selectedStatus === status
                          ? colors.primary
                          : colors.lightBackground,
                    }}
                  >
                    <MaterialIcons name={icon} size={18} color={color} />
                    <Text style={{ color: colors.text, fontSize: 14 }}>
                      {title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20, gap: 12 }}>
            <ThemeText style={{ fontSize: 14, opacity: 0.6 }}>
              Showing {totalCards} of {filteredCards.length} words
            </ThemeText>

            {filteredCards.length < cards.length && (
              <Pressable
                onPress={() => {
                  dispatch(resetFilter());
                  setSelectedStatus(null);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  alignSelf: 'flex-start',
                  paddingVertical: 8,
                }}
              >
                <Entypo name="back-in-time" size={18} color={colors.primary} />
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  Reset filters
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export { GroupFilters };
