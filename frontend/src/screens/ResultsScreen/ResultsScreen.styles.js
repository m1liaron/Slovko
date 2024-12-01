import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemContainer: {
        backgroundColor: '#DCDCDC',
        width: '90%',
        alignSelf: 'center',
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
});

export default styles