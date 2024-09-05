import React, { useState } from 'react';
import {View, Text, StyleSheet, FlatList, Pressable, Dimensions, Alert, Platform} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import { selectCard, shuffleCards } from "../redux/cardSlice";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

const CARD_WIDTH = Dimensions.get('window').width - 100; // Set the card width dynamically based on screen width

const StudyScreen = () => {
    const cards = useSelector(selectCard);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [learnedCards, setLearnedCards] = useState([]);

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const rotation = useSharedValue(0);

    const handleFlipCard = (index) => {
        setFlippedIndex(index === flippedIndex ? null : index);

        rotation.value = withTiming(rotation.value === 0 ? 180 : 0, { duration: 500 });
    };

    const frontAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, Math.PI])}rad` }],
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [Math.PI, 0])}rad` }],
            position: 'absolute',
            top: 0,
            left: 0,
            backfaceVisibility: 'hidden',
            width: CARD_WIDTH, // Set the width to be the same as the front side
            height: '100%', // Set the height to be the same as the front side
        };
    });

    const showingCard = cards.slice(displayedIndex, displayedIndex + 1);

    const showNextCard = () => {
        if (displayedIndex < cards.length - 1) {
            setDisplayedIndex(displayedIndex + 1);
            rotation.value = 0; // Reset rotation when showing the next card
        } else if(displayedIndex >= cards.length - 1) {
            leaveStudy()
        }
    }

    const leaveStudy = () => {
        const exitMessage = 'Ви впевнені що хочете вийти?';
        if (Platform.OS === 'web') {
            const confirmExit = window.confirm(exitMessage);
            if (confirmExit) navigation.navigate('group');
        } else {
            Alert.alert(
                exitMessage,
                '',
                [
                    { text: 'Вийти', onPress: () => { dispatch(shuffleCards()); navigation.navigate('group'); } },
                    { text: 'Скасувати', style: 'cancel' }
                ],
                { cancelable: false }
            );
        }
    }

    const saveCardToLearned = (answer) => {
        const currentCard = cards[displayedIndex];
        const updatedCard = { ...currentCard, answer };
        setLearnedCards((prev) => [...prev, updatedCard]);
    }

    const handleSwipeRight = () => {
        saveCardToLearned('know')
        showNextCard()
    }

    const handleSwipeLeft = () => {
        saveCardToLearned('unknown')
        showNextCard();
    };

    const renderCard = ({ item, index }) => (
        <Pressable onPress={() => handleFlipCard(index)} style={styles.cardContainer}>
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
                <Text style={styles.cardText}>{item.word}</Text>
                <Text style={styles.cardDescription}>Нажміть щоб побачити переклад</Text>
                <Pressable onPress={() => setShowDefinition(!showDefinition)}>
                    <AntDesign name="questioncircleo" size={24} color="black" />
                </Pressable>
            </Animated.View>
            <Animated.View style={[styles.card, backAnimatedStyle]}>
                <Text style={styles.cardText}>{item.translateWord}</Text>
            </Animated.View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centeredContainer}>
                <Text style={styles.cardCount}>{displayedIndex + 1}/{cards.length}</Text>

                <Swipeable
                    containerStyle={styles.swipeableContainer}
                    renderRightActions={() => (
                        <RectButton style={styles.rightAction}>
                            <Text style={styles.rightActionText}>Знаю</Text>
                        </RectButton>
                    )}
                    renderLeftActions={() => (
                        <RectButton style={styles.leftAction}>
                            <Text style={styles.leftActionText}>Не знаю</Text>
                        </RectButton>
                    )}
                    overshootRight={false} // Disable overshooting right
                    overshootLeft={false} // Disable overshooting left
                    onSwipeableRightOpen={handleSwipeRight}
                    onSwipeableLeftOpen={handleSwipeLeft}
                >
                    <FlatList
                        data={cards.slice(displayedIndex, displayedIndex + 1)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderCard}
                        maxToRenderPerBatch={1}
                    />
                </Swipeable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    cardContainer: {
        marginVertical: 20,
        width: CARD_WIDTH, // Add this line to ensure the card has a fixed width
        flex: 1, // Add this line to allow the cardContainer to take the available height
    },
    cardCount: {
        fontSize: 18,
        marginBottom: 10,
    },
    card: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 20,
        height:200
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 15,
    },
    pressableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center horizontally
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    disabledButton:{
        backgroundColor: '#808284',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    swipeableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightAction: {
        backgroundColor: '#28a745',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    leftAction: {
        backgroundColor: '#dc3545',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    rightActionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    leftActionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default StudyScreen;