import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 36,
    margin: 8,
    gap: 5,
  },
  searchInput: {
    fontSize: 16,
  },
  sortSelect: {
    padding: 10,
    borderRadius: 10,
    maxWidth: 450,
    borderWidth: 0,
  },
  itemContainer: {
    backgroundColor: '#DCDCDC',
    alignSelf: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
  },
});

export default styles;
