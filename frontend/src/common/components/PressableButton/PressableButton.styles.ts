import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: '#ffffffff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    padding: 4,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default styles;
