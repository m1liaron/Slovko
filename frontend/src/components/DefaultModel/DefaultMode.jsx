import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DefaultMode = ({
    isVisible,
    handleClose
}) => {
    return (
        <Modal
            visible={isVisible}
            onRequestClose={handleClose}
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
                    { backgroundColor: theme.colors.background },
                ]}
            >
            <View style={styles.header}>
                    <Icon
                    name="times"
                    size={30}
                    color={theme.colors.primary}
                    onPress={() => setModalVisible('none')}
                    />
            </View>
                {children}
                </View>
            </Pressable>
        </Modal>
    );
};

export default DefaultMode;