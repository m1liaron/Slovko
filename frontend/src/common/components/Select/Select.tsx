import { Entypo, Feather } from '@expo/vector-icons';
import { View } from 'moti';
import { useState } from 'react';
import type { ViewStyle } from 'react-native';
import { Pressable, FlatList, Text } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeProvider';

import ThemeText from '../ThemeText/ThemeText';

import styles from './Select.styles';

interface SelectData<T> {
  item: string;
  value: T;
}

interface SelectProps<T> {
  placeholder?: string;
  activeItem: string;
  data: SelectData<T>[];
  customStyle?: ViewStyle;
  setCurrentSelect: (item: T) => void;
  showSortIcon?: boolean;
  sortOrder?: 'asc' | 'desc';
  toggleOrder?: () => void;
}

const Select = <T,>({
  placeholder,
  data,
  activeItem,
  customStyle,
  setCurrentSelect,
  showSortIcon,
  toggleOrder,
  sortOrder,
}: SelectProps<T>) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const [showSelect, setShowSelect] = useState(false);

  return (
    <View style={{ zIndex: 15, position: 'relative' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Pressable
          style={[
            styles.selectPlaceholder,
            { backgroundColor: colors.lightBackground, ...customStyle },
          ]}
          onPress={() => setShowSelect((prev) => !prev)}
        >
          <ThemeText>{placeholder || data[0].item}</ThemeText>
          <Feather
            name={showSelect ? 'arrow-down' : 'arrow-up'}
            size={25}
            color={colors.primary}
          />
        </Pressable>

        {showSortIcon && (
          <Pressable onPress={toggleOrder}>
            <Feather
              name={sortOrder === 'asc' ? 'arrow-down' : 'arrow-up'}
              size={25}
              color={colors.primary}
            />
          </Pressable>
        )}
      </View>

      {showSelect && (
        <View
          style={{ position: 'absolute', top: 50, zIndex: 10, width: '100%' }}
        >
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                onPress={() => setCurrentSelect(item.value)}
              >
                <Text style={{ color: colors.lightText }}>{item.item}</Text>
                {activeItem === item.value && (
                  <Entypo name="check" size={15} color={colors.lightText} />
                )}
              </Pressable>
            )}
            keyExtractor={(item) => item.item}
            contentContainerStyle={[
              styles.selectModal,
              { backgroundColor: colors.lightBackground },
            ]}
          />
        </View>
      )}
    </View>
  );
};

export { Select };
