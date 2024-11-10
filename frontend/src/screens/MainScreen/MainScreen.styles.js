import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    anouncement: {
        backgroundColor: '#FFD700',
        width: '100%',
        padding: 10
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0033A0',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        color: '#FFD700',
        marginBottom: 10,
    },
    timePassedText: {
        textAlign: 'center',
        fontSize: 24,
        backgroundColor: '#FFD700',
        color: '#0033A0',
        padding: 15,
        borderRadius: 10,
        margin: 20,
        fontWeight: 'bold',
    },
});

export default styles