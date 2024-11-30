import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    avatarPhotoContainer: {
        
    },
    avatarPhoto: {
        borderRadius: 100,
        height: 200,
        marginRight: 8,
        width: 200,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    editInputContainer: {
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        borderRadius: 20,
        flexDirection: 'row',
        gap: 10,
        padding: 15,
    },
    editTitle: {
        color: '#828282',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    flex: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    infoItem: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    keyName: {
        color: '#828282',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#d2d2d2',
        borderRadius: 10,
        padding: 10,
        textAlign: 'center',
    },
    textContainer: {},
    textInfo: {
        alignItems: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        textAlign: 'left',
    },
    textInputStyle: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
    userInfo: {
        alignItems: 'center',
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align to the right
    },
    userInfoText: {
        fontSize: 17,
    },
});

export default styles