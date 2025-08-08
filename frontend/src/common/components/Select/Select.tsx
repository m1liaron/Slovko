import { View } from 'moti';
import ThemeText from '../ThemeText/ThemeText';
import { Pressable, FlatList, Text, ViewStyle } from 'react-native';
import { useState } from 'react';
import styles from './Select.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { Entypo, Feather } from '@expo/vector-icons';

interface SelectProps {
  placeholder?: string;
  data: string[];
  customStyle?: ViewStyle;
  currentSelect: string;
  setCurrentSelect: (item: string) => void;
  showSortIcon?: boolean;
  sortOrder?: 'asc' | 'desc';
  setSortOrder?: (order: 'asc' | 'desc') => void;
}

const Select: React.FC<SelectProps> = ({
  placeholder,
  data,
  customStyle,
  currentSelect,
  setCurrentSelect,
  showSortIcon,
  sortOrder,
  setSortOrder,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const [showSelect, setShowSelect] = useState(false);

  return (
    <View style={{ zIndex: 2 }}>
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
          <ThemeText>{placeholder || data[0]}</ThemeText>
          <Feather
            name={showSelect ? 'arrow-down' : 'arrow-up'}
            size={25}
            color={colors.primary}
          />
        </Pressable>

        {showSortIcon && typeof setSortOrder === 'function' && (
          <Pressable
            onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <Feather
              name={sortOrder === 'asc' ? 'arrow-down' : 'arrow-up'}
              size={25}
              color={colors.primary}
            />
          </Pressable>
        )}
      </View>

      {showSelect && (
        <View style={{ position: 'absolute', top: 50 }}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                onPress={() => setCurrentSelect(item)}
              >
                <Text style={{ color: colors.lightText }}>{item}</Text>
                {currentSelect === item && (
                  <Entypo name="check" size={15} color={colors.lightText} />
                )}
              </Pressable>
            )}
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
