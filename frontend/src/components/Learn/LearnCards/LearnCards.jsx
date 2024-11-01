import React, { useState} from 'react';
import {View, Text, Pressable, Image} from 'react-native'
import Swiper from "react-native-deck-swiper";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {selectCard} from "../../../redux/cardSlice";
import styles from './LearnCards.styles';
import {useSelector} from "react-redux";
import * as Speech from 'expo-speech';

const LearnCards = ({ onComplete, setFlashCards }) => {
    const cards = useSelector(selectCard);
    const [flippedIndex, setFlippedIndex] = useState(null);
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

            if (prevFlippedCards[index]) {
                return prevFlippedCards;
            }
            // Flip the card and update the state
            setFlippedIndex(index === flippedIndex ? null : index);
            setIsSwipeDisabled(true);
            rotation.value = withTiming(rotation.value === 0 ? 180 : 0, { duration: 500 });

            // Speech.speak(learningCards[index].word);

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
        setIsSwipeDisabled(false);
        setShowRightSwipeView(true);
        setTimeout(() => setShowRightSwipeView(false), 1000);
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
        setFlashCards(learningCards[currentCardIndex], true)
    };

    const handleSwipeLeft = (index) => {
        setIsSwipeDisabled(false);
        setShowLeftSwipeView(true);
        setTimeout(() => setShowLeftSwipeView(false), 1000);

        const currentCard = learningCards[index];
        const updatedCards = [...learningCards];

        updatedCards.push(currentCard);

        // Update the learningCards state
        setLearningCards(updatedCards);

        setCurrentCardIndex(index);
        setFlashCards(learningCards[currentCardIndex], false)
    };

    const renderCard = (card, index) => (
        <Pressable onPress={() => handleFlipCard(index)} style={styles.cardContainer}>
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
                <View style={{ marginTop: 10 }}>
                    {card.image && card.image.url ? (
                        <Image
                            source={{ uri: card.image.url.toString() }}
                            style={{ width: '50%', height: '50%', borderRadius: 10 }}
                        />
                    ) : null}
                </View>
                <Text style={styles.cardText} selectable={false}>{card.word}</Text>
            </Animated.View>
            <Animated.View style={[styles.card, backAnimatedStyle]}>
                <View style={{ marginTop: 10 }}>
                    {card.image && card.image.url ? (
                        <Image
                            source={{ uri: card.image.url.toString() }}
                            style={{ width: 300, height: 300, borderRadius: 10 }}
                        />
                    ) : null}
                </View>
                <Text style={styles.cardText} selectable={false}>{card.translateWord}</Text>
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
                        title: "Не знаю",
                        style: styles.overlayLabelLeft,
                    },
                    right: {
                        title: 'Знаю',
                        style: styles.overlayLabelRight,
                    },
                }}
            />
    );
};

export default LearnCards;
