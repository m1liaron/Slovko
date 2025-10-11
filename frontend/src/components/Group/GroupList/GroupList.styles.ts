import { Dimensions, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: Platform.OS === 'web' ? '50%' : '90%',
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
