import React, { useState } from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import { useSelector } from "react-redux";
import { selectCard } from "../redux/cardSlice";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import {useNavigation} from "@react-navigation/native";

const CARD_WIDTH = 500; // Set your desired card width

const StudyScreen = () => {
    const cardData = useSelector(selectCard);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [displayedIndex, setDisplayedIndex] = useState(0);

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
            width: CARD_WIDTH, // Set the width for the back side
            backfaceVisibility: 'hidden',
        };
    });

    const showingCard = cardData.slice(displayedIndex, displayedIndex + 1);

    const showNextCard = () => {
        if (displayedIndex < cardData.length - 1) {
            setDisplayedIndex(displayedIndex + 1);
            rotation.value = 0; // Reset rotation when showing the next card
        }
    }

    const showPreviousCard = () => {
        if (displayedIndex > 0) {
            setDisplayedIndex(displayedIndex - 1);
            rotation.value = 0; // Reset rotation when showing the next card
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <FlatList
                    data={showingCard}
                    maxToRenderPerBatch={1}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={() => handleFlipCard(index)} style={styles.cardContainer}>
                            <Animated.View style={[styles.card, { width: CARD_WIDTH }, frontAnimatedStyle]}>
                                <Text style={styles.cardText}>{item.title}</Text>
                                <Text style={styles.cardDescription}>Нажміть щоб побачити переклад</Text>
                            </Animated.View>
                            <Animated.View style={[styles.card, backAnimatedStyle]}>
                                <Text style={styles.cardText}>{item.translate}</Text>
                            </Animated.View>
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.pressableContainer}>

                    <Pressable style={styles.button} onPress={showPreviousCard}>
                        <Text style={styles.buttonText}>Previous card</Text>
                    </Pressable>

                    <Pressable style={styles.button} onPress={() => navigation.navigate('home')}>
                        <Text style={styles.buttonText}>End</Text>
                    </Pressable>

                    <Pressable style={styles.button} onPress={showNextCard}>
                        <Text style={styles.buttonText}>Next card</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {

    },
    container: {
        flex: 1, alignItems: 'center'
    },
    card: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 200,
        marginBottom: 20
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 15
    },
    pressableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default StudyScreen;
