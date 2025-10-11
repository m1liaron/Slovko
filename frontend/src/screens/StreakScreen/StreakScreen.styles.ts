import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  calendarContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },
  frozenContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frozenIcon: {
    marginBottom: 12,
  },
  frozenText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  buyFreezeContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyFreezeButton: {
    backgroundColor: '#2aaef5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#2aaef5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buyFreezeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
