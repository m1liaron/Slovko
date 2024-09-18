import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    guessWordContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        flex: 1,
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    word: {
        padding: 20,
        margin: 5,
        borderColor: '#8a8a8a',
        borderWidth: 1,
        borderRadius: 50,
    },
    wordText: {
        fontSize: 20,
    },
});

export default styles