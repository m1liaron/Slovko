import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    quizContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        flex: 1,
    },
    cardCount: {
        fontSize: 18,
    },
    quizCard: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    quizCardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    quizCardDescription: {
        fontSize: 15,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    crossIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    optionContainer:{
        flex: 1,
        backgroundColor:'#b4b4b4',
        padding:20,
        borderRadius:5,
        marginTop:10,
        alignItems:'center',
        color:'#fff'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default styles