import React, { useState} from 'react';
import {View, Text, Pressable, Image} from 'react-native'
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
    const [isSwipeDisabled, setIsSwipeDisabled] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const rotation = useSharedValue(0);

    const handleFlipCard = (index) => {
        // Use the current state of flippedCards
        setFlippedCards((prevFlippedCards) => {
            // Check if the card has already been flipped
            if (prevFlippedCards[index]) {
                return prevFlippedCards; // Return the same state if the card is already flipped
            }

            // Flip the card and update the state
            setFlippedIndex(index === flippedIndex ? null : index);
            setIsSwipeDisabled(true);
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
        };
    });

    const handleSwipeRight = () => {
        setShowRightSwipeView(true);
        setTimeout(() => setShowRightSwipeView(false), 1000);
        setIsSwipeDisabled(false);
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
    };

    const handleSwipeLeft = (index) => {
        setShowLeftSwipeView(true);
        setTimeout(() => setShowLeftSwipeView(false), 1000);

        const currentCard = learningCards[index];
        const updatedCards = [...learningCards];

        updatedCards.push(currentCard);

        // Update the learningCards state
        setLearningCards(updatedCards);

        setCurrentCardIndex(index);
        setIsSwipeDisabled(false);
    };

    const renderCard = (card, index) => (
        <Pressable onPress={() => handleFlipCard(index)} style={styles.cardContainer}>
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
                <View style={{ marginTop: 10 }}>
                    {card.image && card.image.url && (
                        <Image
                            source={{ uri: card.image.url.toString() }}
                            style={{ width: 400, height: 400, borderRadius: 10 }}
                        />
                    )}
                </View>
                <Text style={styles.cardText}>{card.word}</Text>
            </Animated.View>
            <Animated.View style={[styles.card, backAnimatedStyle]}>
                <Text style={styles.cardText}>{card.translateWord}</Text>
            </Animated.View>
        </Pressable>
    );

    return (
            <Swiper
                horizontalSwipe={isSwipeDisabled}
                cards={learningCards}
                renderCard={(card, index) => renderCard(card, index)}
                keyExtractor={(card) => card.id}
                onSwipedRight={handleSwipeRight}
                onSwipedLeft={handleSwipeLeft}
                onSwipedAll={onComplete}
                stackSize={3}
                cardIndex={currentCardIndex}
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
    );
};

export default LearnCards;
