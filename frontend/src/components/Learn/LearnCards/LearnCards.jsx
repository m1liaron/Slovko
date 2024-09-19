import React, { useState} from 'react';
import {View, Text,  Pressable} from 'react-native'
import Swiper from "react-native-deck-swiper";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {selectCard} from "../../../redux/cardSlice";
import {AntDesign} from "@expo/vector-icons";
import styles from './LearnCards.styles';
import {useSelector} from "react-redux";

const LearnCards = ({ onComplete }) => {
    const cards = useSelector(selectCard);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [showDefinition, setShowDefinition] = useState(false);
    const [learningCards, setLearningCards] = useState([...cards]);
    const [showLeftSwipeView, setShowLeftSwipeView] = useState(false);
    const [showRightSwipeView, setShowRightSwipeView] = useState(false);
    const [flippedCards, setFlippedCards] = useState({});

    const rotation = useSharedValue(0);

    const handleFlipCard = (index) => {
        // Use the current state of flippedCards
        setFlippedCards((prevFlippedCards) => {
            // Check if the card has already been flipped
            if (prevFlippedCards[index]) {
                console.log('CARD ALREADY FLIPPED, STOP!');
                return prevFlippedCards; // Return the same state if the card is already flipped
            }

            // Flip the card and update the state
            setFlippedIndex(index === flippedIndex ? null : index);
            rotation.value = withTiming(rotation.value === 0 ? 180 : 0, { duration: 500 });

            // Update the flipped cards state
            return { ...prevFlippedCards, [index]: true };
        });
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
            height: '100%',
        };
    });

    const handleSwipeRight = () => {
        setShowRightSwipeView(true);
        setTimeout(() => setShowRightSwipeView(false), 1000);
    };

    const handleSwipeLeft = (index) => {
        setShowLeftSwipeView(true);
        setTimeout(() => setShowLeftSwipeView(false), 1000);
        const currentCard = learningCards[index];
        const updatedCards = [...learningCards];
        updatedCards.splice(index, 1);
        updatedCards.push(currentCard);
        setLearningCards(updatedCards);
    };

    console.log(learningCards)

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
                    keyExtractor={(card) => card.id}
                    onSwipedRight={handleSwipeRight}
                    onSwipedLeft={handleSwipeLeft}
                    onSwipedAll={onComplete}
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
