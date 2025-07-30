import React from 'react';
import { Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './AddButton.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';

/**
 * @param onPress {function} - react-native function for press on button
 * @param iconSize {number} - size of icons
 * @returns {JSX.Element}
 * @constructor
 */

interface AddButtonProps {
  onPress: () => void;
  iconSize?: number;
}

const AddButton = ({ onPress, iconSize = 30 }: AddButtonProps) => {
  const {
    theme: {
      colors: { highlightColor },
    },
  } = useAppTheme();
  return (
    <View style={styles.addButtonContainer}>
      <Pressable
        onPress={onPress}
        style={[
          styles.addButton,
          { borderColor: highlightColor, shadowColor: highlightColor },
        ]}
      >
        <Icon name="plus" size={iconSize} color={highlightColor} />
      </Pressable>
    </View>
  );
};
export default AddButton;
