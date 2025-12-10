import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  anouncement: {
    backgroundColor: '#FFD700',
    width: '100%',
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0033A0',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 10,
  },
  timePassedText: {
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#FFD700',
    color: '#0033A0',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    fontWeight: 'bold',
  },
  repeatButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 40,
    alignSelf: 'center',
  },
  item: {
    width: '100%',
    padding: 20,
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;
