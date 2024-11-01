import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: '#919191',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20
    },
    resultContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10
    },
    mistakesAmountContainer: {
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#ff0000',
        marginRight: 20
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#969696'
    },
    title: {
        color: '#fff',
        fontSize:35,
        fontWeight: 'bold'
    },
    wastedTimeContainer: {
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 6,
        padding: 10,
        backgroundColor: '#bcbcbc'
    }
});

export default styles