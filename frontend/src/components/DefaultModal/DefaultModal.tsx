import React, { type ReactNode, useEffect, useRef } from 'react';
import {
  type GestureResponderEvent,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useAppTheme } from '../../contexts/ThemeProvider';

import styles from './styles';

/**
 * @param isVisible { boolean}
 * @param handleClose {function}
 * @param modalStyle {object}
 * @param backgroundColor {string}
 * @param animationType {"none" || "slide" || "fade"}
 * @param children {object}
 * @returns {JSX.Element}
 * @constructor
 */

interface DefaultModalProps {
  isVisible: boolean;
  handleClose: () => void;
  modalStyle?: object;
  backgroundColor?: string;
  animationType?: 'none' | 'slide' | 'fade';
  children: ReactNode;
}

const DefaultModal = ({
  isVisible,
  handleClose,
  modalStyle,
  backgroundColor,
  animationType,
  children,
}: DefaultModalProps) => {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();

  const handleOverlayPress = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={handleClose}
      transparent={true}
      animationType={animationType}
    >
      <Pressable
        style={[
          styles.modalContainer,
          { backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.5)' },
        ]}
        onPress={handleOverlayPress}
      >
        <View
          style={[
            styles.modalContent,
            modalStyle,
            {
              width: width - 100,
              maxWidth: 400,
              backgroundColor: theme.colors.background,
              margin: 50,
            },
          ]}
        >
          <View style={styles.header}>
            <Icon
              name="times"
              size={30}
              onPress={handleClose}
              color={theme.colors.primary}
            />
          </View>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
};

export default DefaultModal;
