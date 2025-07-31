import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  sharedGroup: {
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    flex: 1,
    borderRadius: 10,
    gap: 30,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  avatarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarName: {
    padding: 5,
    textAlign: 'center',
    borderRadius: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 36,
    margin: 8,
    gap: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sortSelect: {
    padding: 10,
    borderRadius: 10,
    maxWidth: 450,
    borderWidth: 0,
  },
  difficultyBtn: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
  },
});

export default styles;
