import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { View, Pressable, Text } from 'react-native';

import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { IGroup } from '@/common/enums/types/group.type';
import BackButton from '@/components/BackButton/BackButton';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useResponsive } from '@/hooks';
import { useAppSelector } from '@/hooks/redux.hooks';

interface GroupHeaderProps {
  group: IGroup;
  viewMode: 'list' | 'cards';
  showFilterModal: boolean;
  onViewModeChange: (mode: 'list' | 'cards') => void;
  onToggleFilters: () => void;
  onOpenSettings: () => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
  group,
  viewMode,
  showFilterModal,
  onViewModeChange,
  onToggleFilters,
  onOpenSettings,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { isDesktop } = useResponsive();
  const { filterValue, rangeLimit, cards } = useAppSelector(
    (state) => state.cards,
  );

  const isFilterUsed = filterValue.length > 0 || rangeLimit < cards.length;

  return (
    <View
      style={{
        padding: isDesktop ? 32 : 20,
        paddingTop: isDesktop ? 32 : 40,
        backgroundColor: colors.lightBackground,
      }}
    >
      <View
        style={{
          flexDirection: isDesktop ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: isDesktop ? 'center' : 'flex-start',
          gap: 16,
        }}
      >
        <View style={{ flex: isDesktop ? 1 : undefined }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: isDesktop ? 0 : 8,
            }}
          >
            <BackButton />
            <ThemeText
              style={{
                fontSize: isDesktop ? 32 : 25,
                fontWeight: 'bold',
                marginLeft: 10,
              }}
            >
              {group?.title}
            </ThemeText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap' }}>
          <Pressable
            style={{
              borderRadius: 20,
              backgroundColor: showFilterModal
                ? colors.primary
                : colors.lightBackground,
              padding: 10,
            }}
            onPress={onToggleFilters}
          >
            {isFilterUsed && (
              <Pressable
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 35,
                  width: 20,
                  padding: 5,
                  borderRadius: 100,
                  backgroundColor: colors.highlightColor,
                }}
              >
                <ThemeText style={{ textAlign: 'center' }}>1</ThemeText>
              </Pressable>
            )}
            <Feather
              name="filter"
              size={20}
              color={showFilterModal ? colors.background : colors.text}
            />
          </Pressable>

          <Pressable
            onPress={() => onViewModeChange('list')}
            style={{
              backgroundColor:
                viewMode === 'list' ? colors.primary : colors.lightBackground,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <MaterialIcons
              name="view-list"
              size={20}
              color={viewMode === 'list' ? colors.background : colors.text}
            />
            <Text
              style={{
                color: viewMode === 'list' ? colors.background : colors.text,
                fontWeight: '600',
              }}
            >
              List
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onViewModeChange('cards')}
            style={{
              backgroundColor:
                viewMode === 'cards' ? colors.primary : colors.lightBackground,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <MaterialIcons
              name="view-carousel"
              size={20}
              color={viewMode === 'cards' ? colors.background : colors.text}
            />
            <Text
              style={{
                color: viewMode === 'cards' ? colors.background : colors.text,
                fontWeight: '600',
              }}
            >
              Cards
            </Text>
          </Pressable>

          <Pressable
            onPress={onOpenSettings}
            style={{
              padding: 10,
              backgroundColor: colors.lightBackground,
              borderRadius: 20,
            }}
          >
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={colors.iconColor}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
