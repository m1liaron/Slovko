import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
    zIndex: 20,
    flex: 1,
    padding: 20,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subheader: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  item: { fontSize: 18, marginVertical: 10 },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  langItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeLang: {
    backgroundColor: '#f0f0f0',
  },
});

export default styles;
