import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10,
  },
  modalContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    borderRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    padding: 25,
  },
});

export default styles;
