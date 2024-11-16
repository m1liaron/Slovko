import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cardsList: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        height: Dimensions.get('window').height - 500,
        marginTop: 20
    },
    cardContainer: {
        minWidth: 300,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor:'#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        height: Dimensions.get('window').height - 500,
        marginRight: 30
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default styles