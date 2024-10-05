import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    addButton: {
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        width: 50,
        elevation: 5, // Adds shadow for Android
        shadowColor: '#000', // Adds shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    addButtonContainer: {
        bottom: 20,
        position: 'absolute',
        right: 20,
    },
});

export default styles;