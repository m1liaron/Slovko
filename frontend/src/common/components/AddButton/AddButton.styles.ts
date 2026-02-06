import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 4,
    height: 50,
    justifyContent: 'center',
    width: 50,
    elevation: 5, // Adds shadow for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default styles;
