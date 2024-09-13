import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform, Alert, Pressable} from 'react-native'
import Swiper from "react-native-deck-swiper";
import Animated, {interpolate, useAnimatedStyle, withTiming} from "react-native-reanimated";
import {shuffleCards} from "../../redux/cardSlice";
import {AntDesign} from "@expo/vector-icons";

const LearnCards = () => {
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [learnedCards, setLearnedCards] = useState([]);
    const [learningCards, setLearningCards] = useState([...cards]);
    const [showLeftSwipeView, setShowLeftSwipeView] = useState(false);
    const [showRightSwipeView, setShowRightSwipeView] = useState(false);

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
        <View style={styles.centeredContainer}>
                <Swiper
                    cards={learningCards}
                    renderCard={(card, index) => renderCard(card, index)}
                    onSwipedRight={handleSwipeRight}
                    onSwipedLeft={handleSwipeLeft}
                    stackSize={3}
                    cardIndex={0}
                    backgroundColor={'transparent'}
                    verticalSwipe={false}
                    overlayLabels={{
                        left: {
                            title: "Don’t know",
                            style: styles.overlayLabelLeft,
                        },
                        right: {
                            title: 'Know',
                            style: styles.overlayLabelRight,
                        },
                    }}
                />
        </View>
    );
};

export default LearnCards;
