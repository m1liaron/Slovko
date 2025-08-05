import { View } from 'moti';
import ThemeText from '../ThemeText/ThemeText';
import { Pressable, FlatList, Text } from 'react-native';
import { useState } from 'react';
import styles from './Select.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';

interface SelectProps {
  placeholder?: string;
  data: string[];
  currentSelect: string;
  setCurrentSelect: (item: string) => void;
  iconPress?: () => void;
}

const Select: React.FC<SelectProps> = ({
  placeholder,
  data,
  currentSelect,
  setCurrentSelect,
  iconPress,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const [showSelect, setShowSelect] = useState(false);

  return (
    <View style={{ zIndex: 2 }}>
      <Pressable
        style={[
          styles.selectPlaceholder,
          { backgroundColor: colors.lightBackground },
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
