import {Dimensions, StyleSheet} from "react-native";

const CARD_WIDTH = Dimensions.get('window').width - 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        gap: 10
    },

    // Cards
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        flex: 1,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '50%',
        height: '80%',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
        backgroundColor: '#ffffff', // Clean white card
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333', // Darker text for better readability
        textAlign: 'center',
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 14,
        color: '#777', // Lighter color for secondary information
        textAlign: 'center',
        marginTop: 8,
    },
    iconButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0', // Subtle background for icons
        borderRadius: 50,
    },
    swipeFeedbackView: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Higher opacity for clear feedback
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    swipeText: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    overlayLabelLeft: {
        title: {
            color: 'white',
            backgroundColor: '#ff6b6b',
            padding: 12,
            borderRadius: 8,
            fontSize: 16, // Adjust font size if needed
            fontWeight: '700',
        },
        wrapper: {
            justifyContent: 'flex-end', // Adjust to position the label properly
            alignItems: 'flex-start', // Align label to the left edge
            marginLeft: 20, // Adjust margin to position the label
            marginTop: 20, // Adjust margin to position the label from top
        },
    },
    overlayLabelRight: {
        title: {
            color: 'white',
            backgroundColor: '#1dd1a1',
            padding: 12,
            borderRadius: 8,
            fontSize: 16, // Adjust font size if needed
            fontWeight: '700',
        },
        wrapper: {
            justifyContent: 'flex-end', // Adjust to position the label properly
            alignItems: 'flex-end', // Align label to the right edge
            marginRight: 20, // Adjust margin to position the label
            marginTop: 20, // Adjust margin to position the label from top
        },

        // quiz
        quizContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            flex: 1,
        },
        cardCount: {
            fontSize: 18,
        },
        card: {
            borderWidth: 1,
            borderColor: '#000000',
            borderRadius: 8,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
        },
        cardText: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        cardDescription: {
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
    },
})

export default styles;