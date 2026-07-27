import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { View, Pressable, Text } from 'react-native';

import { Select } from '@/common/components/Select/Select';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { CardFields } from '@/common/enums/app/CardFields';
import type { ICard } from '@/common/enums/types/card.type';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useResponsive } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import { sortCards, toggleCardsSortOrder } from '@/redux/cardReducer/cardSlice';

interface StatusButton {
  title: string;
  status: string;
  amount: number;
  color: string;
  icon: string;
}

interface GroupFiltersProps {
  cardsLength: number;
  shownCards: ICard[];
  sort: string;
  sortOrder: 'asc' | 'desc';
  selectedStatus: string | null;
  statusButtons: StatusButton[];
  onChangeCardsRange: (value: number) => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onStatusFilter: (status: string) => void;
  onResetFilters: () => void;
}

export const GroupFilters: React.FC<GroupFiltersProps> = ({
  sort,
  sortOrder,
  selectedStatus,
  statusButtons,
  cardsLength,
  shownCards,
  onChangeCardsRange,
  onDecrement,
  onIncrement,
  onStatusFilter,
  onResetFilters,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { isDesktop } = useResponsive();
  const { rangeLimit } = useAppSelector((state) => state.cards);
  const dispatch = useAppDispatch();

  return (
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
        zIndex: 1000,
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
        <ThemeText style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
          Filters
        </ThemeText>
      </View>

      <View style={{ gap: 24 }}>
        {/* Cards to show slider */}
        <View>
          <ThemeText style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}>
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
              onPress={onDecrement}
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
                {Math.floor(rangeLimit)}/{cardsLength}
              </ThemeText>
              <Slider
                style={{ width: '100%', height: 40 }}
                disabled={cardsLength === 0}
                maximumValue={cardsLength}
                minimumValue={2}
                value={rangeLimit}
                onSlidingComplete={onChangeCardsRange}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.lightBackground}
              />
            </View>
            <Pressable
              onPress={onIncrement}
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
        <View style={{ zIndex: 1 }}>
          <ThemeText style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}>
            Sort by
          </ThemeText>
          <Select
            placeholder="Default order"
            data={[
              {
                item: i18n.t('group.sortByDate'),
                value: CardFields.createdAt,
              },
              {
                item: i18n.t('group.sortByName'),
                value: CardFields.word,
              },
              {
                item: i18n.t('group.sortByReviewDate'),
                value: CardFields.nextReviewAt,
              },
              {
                item: i18n.t('group.sortByReviewCount'),
                value: CardFields.reviewCount,
              },
            ]}
            sortOrder={sortOrder}
            toggleOrder={() => dispatch(toggleCardsSortOrder())}
            activeItem={sort}
            customStyle={{ width: '100%' }}
            setCurrentSelect={(value) => dispatch(sortCards({ sort: value }))}
            showSortIcon={true}
          />
        </View>

        {/* Status filters */}
        <View>
          <ThemeText style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}>
            Status
          </ThemeText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {statusButtons.map(({ status, title, icon, color }) => (
              <Pressable
                key={status}
                onPress={() => onStatusFilter(status)}
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
          Showing {shownCards.length} of {cardsLength} words
        </ThemeText>

        {shownCards.length < cardsLength && (
          <Pressable
            onPress={onResetFilters}
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
              {i18n.t('group.resetFilters')}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
