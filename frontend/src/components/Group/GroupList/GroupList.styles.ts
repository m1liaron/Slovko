import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    flex: 1,
  },
  groupListContainer: {
    flexDirection: 'column',
    flex: 1,
    padding: 20,
  },
  noGroupsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
