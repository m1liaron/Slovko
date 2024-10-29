import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    flex: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        gap: 20,
        width: '90%',
        alignSelf: 'center',
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
});

export default styles