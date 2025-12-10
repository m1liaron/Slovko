import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 36,
    margin: 8,
    gap: 5,
    width: windowWidth < 720 ? '100%' : '30%',
  },
  searchInput: {
    fontSize: 16,
    width: '100%',
    flex: 1,
  },
});

export default styles;
