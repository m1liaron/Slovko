import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  formContainer: {
    padding: 16,
    gap: 10,
  },
  bulkAddContainer: {
    marginTop: 16,
  },
  fileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileInput: {
    marginLeft: 8,
    padding: 5,
  },
  jsonTableContainer: {
    marginTop: 10,
  },
  jsonTable: {
    borderWidth: 1,
    padding: 8,
  },
  jsonTableTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  jsonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jsonKey: {
    fontWeight: 'bold',
  },
  jsonValue: {
    flex: 1,
    marginLeft: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    margin: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default styles;
