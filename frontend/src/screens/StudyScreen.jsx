import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, Alert, Platform, Pressable} from 'react-native';
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
import Swiper from "react-native-deck-swiper";
import { AntDesign } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width - 100;

const StudyScreen = ({ route }) => {
    const cards = useSelector(selectCard);
    const { groupId } = route.params;
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [learnedCards, setLearnedCards] = useState([]);
    const [learningCards, setLearningCards] = useState([...cards]);
    const [showLeftSwipeView, setShowLeftSwipeView] = useState(false);
    const [showRightSwipeView, setShowRightSwipeView] = useState(false);

    const dispatch = useDispatch();
    const navigation = useNavigation();
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
            width: CARD_WIDTH,
            height: '100%',
        };
    });

    const showNextCard = () => {
        if (displayedIndex < cards.length - 1) {
            setDisplayedIndex(displayedIndex + 1);
            rotation.value = 0;
        } else if (displayedIndex >= cards.length - 1) {
            leaveStudy();
        }
    };

    const leaveStudy = () => {
        const exitMessage = 'Ви впевнені що хочете вийти?';
        if (Platform.OS === 'web') {
            const confirmExit = window.confirm(exitMessage);
            if (confirmExit) navigation.navigate('group', { groupId });
        } else {
            Alert.alert(
                exitMessage,
                '',
                [
                    { text: 'Вийти', onPress: () => { dispatch(shuffleCards()); navigation.navigate('group', { groupId }); } },
                    { text: 'Скасувати', style: 'cancel' }
                ],
                { cancelable: false }
            );
        }
    };

    const saveCardToLearned = (answer) => {
        const currentCard = cards[displayedIndex];
        const updatedCard = { ...currentCard, answer };
        setLearnedCards((prev) => [...prev, updatedCard]);
    };

    const handleSwipeRight = () => {
        saveCardToLearned('know');
        setShowRightSwipeView(true);
        setTimeout(() => setShowRightSwipeView(false), 1000);
        showNextCard();
    };

    const handleSwipeLeft = () => {
        saveCardToLearned('don’t know');
        setShowLeftSwipeView(true);
        setTimeout(() => setShowLeftSwipeView(false), 1000);

        // Update the learning cards
        const currentCard = learningCards[displayedIndex];
        const remainingCards = learningCards.filter((_, idx) => idx !== displayedIndex);

        // Append current card to the end of the array
        const updatedCards = [...remainingCards, currentCard];
        setLearningCards(updatedCards);

        // // Ensure the index is properly updated
        setDisplayedIndex((prevIndex) => (prevIndex + 1) % updatedCards.length);
        rotation.value = 0;
    };

    const renderCard = (card, index) => (
        <Pressable onPress={() => handleFlipCard(index)} style={styles.cardContainer}>
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
                <Text style={styles.cardText}>{card.word}</Text>
                <Text style={styles.cardDescription}>Нажміть щоб побачити переклад</Text>
                <Pressable onPress={() => setShowDefinition(!showDefinition)}>
                    <AntDesign name="questioncircleo" size={24} color="black" />
                </Pressable>
            </Animated.View>
            <Animated.View style={[styles.card, backAnimatedStyle]}>
                <Text style={styles.cardText}>{card.translateWord}</Text>
            </Animated.View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centeredContainer}>
                <Text>{displayedIndex}/{learningCards.length}</Text>
                <Swiper
                    cards={learningCards}
                    renderCard={(card, index) => renderCard(card, index)}
                    onSwipedRight={handleSwipeRight}
                    onSwipedLeft={handleSwipeLeft}
                    stackSize={3}
                    cardIndex={0}
                    backgroundColor={'transparent'}
                    overlayLabels={{
                        left: {
                            title: "Не знаю",
                            style: {
                                label: {
                                    backgroundColor: 'red',
                                    borderColor: 'red',
                                    color: 'white',
                                    fontSize: 24,
                                    padding: 10,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 20,
                                    marginLeft: -20,
                                },
                            },
                        },
                        right: {
                            title: 'Знаю',
                            style: {
                                label: {
                                    backgroundColor: 'green',
                                    borderColor: 'green',
                                    color: 'white',
                                    fontSize: 24,
                                    padding: 10,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 20,
                                    marginLeft: 20,
                                },
                            },
                        },
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7f8fc',
        flex: 1,
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        flex: 1,
    },
    cardContainer: {
        marginVertical: 16,
        width: CARD_WIDTH,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        height: '100%',
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
        fontSize: 22,
        fontWeight: '700',
        color: '#333', // Darker text for better readability
        textAlign: 'center',
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 16,
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
        },
        wrapper: {
            justifyContent: 'flex-start',
            marginLeft: -30,
        },
    },
    overlayLabelRight: {
        title: {
            color: 'white',
            backgroundColor: '#1dd1a1',
            padding: 12,
            borderRadius: 8,
        },
        wrapper: {
            justifyContent: 'flex-start',
            marginRight: -30,
        },
    },
});

export default StudyScreen;
