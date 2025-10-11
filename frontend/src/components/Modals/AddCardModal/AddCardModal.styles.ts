import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
  },
  bulkAddContainer: {
    marginTop: 16,
  },
  fileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileInput: {
    marginLeft: 8,
    padding: 5,
  },
  jsonTableContainer: {
    marginTop: 12,
    maxHeight: 300,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'scroll',
  },
  jsonTable: {
    padding: 8,
  },
  jsonTableTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  jsonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  jsonKey: {
    fontWeight: 'bold',
    flexShrink: 0,
    marginRight: 8,
  },
  jsonValue: {
    flex: 1,
    flexShrink: 1,
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
