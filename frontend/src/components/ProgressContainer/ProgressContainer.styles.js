import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    progressContainer: {
        borderRadius: 20,
        borderWidth: 2,
        width: '80%',
        height: 60,
        justifyContent: 'flex-start',
        overflow: 'hidden',
        marginBottom: 20
    },

    progressInsideContainer: {
        backgroundColor: '#e5e511',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
});

export default styles