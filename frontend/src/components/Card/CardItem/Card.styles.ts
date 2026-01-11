import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    padding: 16,
    borderRadius: 10,
    alignSelf: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLoader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: '#5B62F8',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  translate: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
    width: 69,
  },
  reviewDate: {
    fontSize: 16,
    marginTop: 10,
    color: '#007bff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default styles;
