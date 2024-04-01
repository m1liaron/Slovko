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
    const cardData = useSelector(selectCard);
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

    const showingCard = cardData.slice(displayedIndex, displayedIndex + 1);

    const showNextCard = () => {
        if (displayedIndex < cardData.length - 1) {
            console.log('show next')
            setDisplayedIndex(displayedIndex + 1);
            rotation.value = 0; // Reset rotation when showing the next card
        } else if(displayedIndex >= cardData.length - 1) {
            console.log('leaver')
            leaveStudy()
        }
    }

    const showPreviousCard = () => {
        if (displayedIndex > 0) {
            setDisplayedIndex(displayedIndex - 1);
            rotation.value = 0; // Reset rotation when showing the next card
        }
    }

    const leaveStudy = () => {
        if(Platform.OS === 'web'){
            const answer = window.confirm();
            return answer ? navigation.navigate('main') : false
        } else {
            Alert.alert(
                'Ви впевнені що хочете вийти?',
                '',
                [
                    {
                        text: 'Вийти',
                        onPress: () => {
                            dispatch(shuffleCards())
                            navigation.navigate('main');
                        },
                    },
                    {
                        text: 'Скасувати',
                        style: 'cancel',
                    },
                ],
                { cancelable: false }
            );
        }
    }
    console.log("learnedCards", learnedCards)

    const saveCardToLearned = (answer) => {
        const currentCard = cardData.filter((item, index) => index === displayedIndex).map(item => item);
        const updatedCard = [...currentCard[0], answer]; // Add "know" to the array
        setLearnedCards(prevState => [...prevState, updatedCard]);
        console.log('Saved card', updatedCard);
    }

    const handleSwipeRight = () => {
        saveCardToLearned('know')
        showNextCard()
    }

    const handleSwipeLeft = () => {
        saveCardToLearned('unknown')
        showNextCard();
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centeredContainer}>
                <Text style={styles.cardCount}>{displayedIndex + 1}/{cardData.length}</Text>

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
                        data={showingCard}
                        maxToRenderPerBatch={1}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <Pressable onPress={() => handleFlipCard(index)} style={styles.cardContainer}>
                                <Animated.View style={[styles.card, { width: CARD_WIDTH, height: '100%' }, frontAnimatedStyle]}>
                                    <Text style={styles.cardText}>{item[0]}</Text>
                                    <Text style={styles.cardDescription}>Нажміть щоб побачити переклад</Text>

                                    <Pressable onPress={() => setShowDefinition(!showDefinition)}>
                                        <AntDesign name="questioncircleo" size={24} color="black" />
                                    </Pressable>
                                    {showDefinition ? (
                                        <View>
                                            <Text>{item[3]}</Text>
                                        </View>
                                    ) : null}

                                </Animated.View>
                                <Animated.View style={[styles.card, { width: CARD_WIDTH, height: '100%' }, backAnimatedStyle]}>
                                    <Text style={styles.cardText}>{item[1]}</Text>
                                </Animated.View>
                            </Pressable>
                        )}
                    />
                </Swipeable>


                {/*<View style={styles.pressableContainer}>*/}
                {/*    <Pressable style={styles.button} onPress={showPreviousCard}>*/}
                {/*        <AntDesign name="arrowleft" size={24} color="white" />*/}
                {/*    </Pressable>*/}
                {/*    <Pressable style={styles.button} onPress={leaveStudy}>*/}
                {/*        <Text style={styles.buttonText}>Закінчити</Text>*/}
                {/*    </Pressable>*/}
                {/*    <Pressable style={styles.button} onPress={showNextCard}>*/}
                {/*        <AntDesign name="arrowright" size={24} color="white" />*/}
                {/*    </Pressable>*/}
                {/*</View>*/}
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