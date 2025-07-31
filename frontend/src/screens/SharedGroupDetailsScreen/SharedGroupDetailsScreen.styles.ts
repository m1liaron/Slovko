import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardsList: {
    paddingHorizontal: 20,
    flex: 1,
    marginVertical: 30,
    maxHeight: 500,
  },
  cardContainer: {
    position: 'relative',
    padding: 16,
    borderRadius: 10,
    marginRight: 30,
    marginBottom: 10,
    alignSelf: 'center',
    width: '100%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default styles;
