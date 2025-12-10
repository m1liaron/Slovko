import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: 136,
    height: 136,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  emptyCell: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  letter: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
  },
});

export default styles;
