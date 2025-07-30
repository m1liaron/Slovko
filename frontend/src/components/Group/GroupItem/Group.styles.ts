import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    width: '100%',
    padding: 10,
    margin: 10,
    borderRadius: 40,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // Shadow
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});

export default styles;
