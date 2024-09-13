import React, {useEffect, useState} from 'react';
import styles from './LearnScreen.styles';

import { Switch } from "react-native-gesture-handler";
import {View, Text, Pressable, Platform, Alert, Dimensions, FlatList, useWindowDimensions} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {AntDesign, Entypo, MaterialIcons} from "@expo/vector-icons";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import {useDispatch, useSelector} from "react-redux";
import {selectCard, shuffleCards} from "../../redux/cardSlice";
import {useNavigation} from "@react-navigation/native";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Swiper from "react-native-deck-swiper";
import {Audio} from "expo-av";
import {AppPath} from "../../common/app/app";

const CARD_WIDTH = Dimensions.get('window').width - 100;

const LearnScreen = ({ route }) => {
    const { groupId } = route.params;
    const cards = useSelector(selectCard);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const rotation = useSharedValue(0);
    const { width } = useWindowDimensions();

    // cards
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [learnedCards, setLearnedCards] = useState([]);
    const [learningCards, setLearningCards] = useState([...cards]);
    const [showLeftSwipeView, setShowLeftSwipeView] = useState(false);
    const [showRightSwipeView, setShowRightSwipeView] = useState(false);

    // quiz
    const [displayedQuizIndex, setDisplayedQuizIndex] = useState(0);
    const [quizOptions, setQuizOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null)
    const [selectedOption, setSelectedOption] = useState('')
    const currentCard = cards[displayedQuizIndex];

    // guess word
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [scrambledWord, setScrambledWord] = useState([]);
    const [letterColors, setLetterColors] = useState({});
    const [showWord, setShowWord] = useState(false);
    const currentWord = cards[currentIndex]?.word;

    // settings
    const [isQuizEnabled, setIsQuizEnabled] = useState(true);
    const [isGuessWordEnabled, setIsGuessWordEnabled] = useState(true);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const toggleSwitch = (changeFunction) => changeFunction(previousState => !previousState);

    const generateSectionContent = () => {
        const sections = [
            {
                text: 'Quiz mode',
                iconName: 'quiz',
                state: isQuizEnabled,
                changeState:setIsQuizEnabled,
            },
            {
                text: 'Guess Word mode',
                iconName: 'wordpress',
                state: isGuessWordEnabled,
                changeState: setIsGuessWordEnabled,
            }
        ];

        return sections.map((section, idx) => (
            <View style={styles.sectionContainer} key={idx}>
                <View style={styles.sectionContainer}>
                    <MaterialIcons name={section.iconName} size={30} color="#00" />
                    <Text>{section.text}</Text>
                </View>
                <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={section.state ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch(section.changeState)}
                    value={section.state}
                />
            </View>
        ))
    }

    // cards functions

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

    // quiz functions

    useEffect(() => {
        generateQuizOption();
    }, [displayedQuizIndex])

    const generateQuizOption = () => {
        if(!currentCard) return;
        const correctOption = { text: currentCard.translateWord, isCorrect: true };
        const incorrectOptions = getIncorrectOptions();
        const shuffledOptions = shuffleArray([correctOption, ...incorrectOptions]);
        setQuizOptions(shuffledOptions);
    }

    const getIncorrectOptions = () => {
        return cards
            .filter((item, index) => index !== displayedQuizIndex)
            .map(item => ({text: item.translateWord, isCorrect: false}))
            .slice(0, 3)
    }

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const moveToNextCard  = () => {
        if (displayedQuizIndex < cards.length - 1) {
            setTimeout(() => {
                setDisplayedQuizIndex(displayedQuizIndex + 1);
                setIsCorrect(null);
            }, 2000)
        } else {
            navigation.navigate('home');
        }
    }

    const handleOptionPress = async (option) => {
        setSelectedOption(option);
        if (option.isCorrect) {
            await playSuccessSound();
            setIsCorrect(true);
            moveToNextCard();
        } else {
            setIsCorrect(false);
        }

        setTimeout(() => {
            setSelectedOption(null);
        }, 1000);
    };

    const playSuccessSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/audio/success.mp3'),
                { positionMillis: 0, durationMillis: 2000 }
            );
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    }

    // quess words functions

    useEffect(() => {
        if (currentWord) generateScrambledWord(currentWord);
    }, [currentIndex]);

    const generateScrambledWord = (word) => {
        let wordArray = word.split('');
        for (let i = 0; i < 3; i++) {
            const randomLetter = getRandomLetter();
            const randomIndex = getRandomInt(0, wordArray.length);
            wordArray.splice(randomIndex, 0, randomLetter);
        }
        setScrambledWord(wordArray);
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const getRandomLetter = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        return alphabet[getRandomInt(0, alphabet.length - 1)];
    };

    const handleLetterSelection = (letter, index) => {
        if (letter === currentWord[currentGuess.length]) {
            setCurrentGuess(currentGuess + letter);
            removeLetterFromScrambled(index);
        } else {
            highlightIncorrectLetter(index);
        }
    };

    const removeLetterFromScrambled = (index) => {
        const updatedWord = [...scrambledWord];
        updatedWord.splice(index, 1);
        setScrambledWord(updatedWord);
    };

    const highlightIncorrectLetter = (index) => {
        setLetterColors({ ...letterColors, [index]: 'red' });
        setTimeout(() => setLetterColors({}), 1000);
    };

    useEffect(() => {
        if (currentGuess === currentWord) {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
                resetGameState();
            } else {
                navigation.navigate(AppPath.Home);
            }
        }
    }, [currentGuess]);

    const resetGameState = () => {
        setCurrentGuess('');
        setLetterColors({});
    };

    return (
        <SafeAreaView styles={styles.container}>
            {/*<View style={styles.centeredContainer}>*/}
            {/*    <Swiper*/}
            {/*        cards={learningCards}*/}
            {/*        renderCard={(card, index) => renderCard(card, index)}*/}
            {/*        onSwipedRight={handleSwipeRight}*/}
            {/*        onSwipedLeft={handleSwipeLeft}*/}
            {/*        stackSize={3}*/}
            {/*        cardIndex={0}*/}
            {/*        backgroundColor={'transparent'}*/}
            {/*        verticalSwipe={false}*/}
            {/*        overlayLabels={{*/}
            {/*            left: {*/}
            {/*                title: "Don’t know",*/}
            {/*                style: styles.overlayLabelLeft,*/}
            {/*            },*/}
            {/*            right: {*/}
            {/*                title: 'Know',*/}
            {/*                style: styles.overlayLabelRight,*/}
            {/*            },*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</View>*/}

            {/*<View style={styles.centeredContainer} >*/}
            {/*    <Pressable style={styles.quizCard}>*/}
            {/*        <Text style={styles.quizCardText}>{currentCard.word}</Text>*/}
            {/*    </Pressable>*/}
            {/*    <FlatList*/}
            {/*        data={quizOptions}*/}
            {/*        renderItem={({ item }) => (*/}
            {/*            <Pressable*/}
            {/*                style={[*/}
            {/*                    styles.optionContainer,*/}
            {/*                    {*/}
            {/*                        backgroundColor:*/}
            {/*                            selectedOption === item*/}
            {/*                                ? isCorrect === true*/}
            {/*                                    ? '#a1dc93'*/}
            {/*                                    : isCorrect === false*/}
            {/*                                        ? '#df5151'*/}
            {/*                                        : '#8e8e8e'*/}
            {/*                                : '#d0d0d0',*/}
            {/*                    },*/}
            {/*                ]} onPress={() => handleOptionPress(item)}>*/}
            {/*                <Text>{item.text}</Text>*/}
            {/*            </Pressable>*/}
            {/*        )}*/}
            {/*        keyExtractor={(item, index) => index.toString()}*/}
            {/*    />*/}
            {/*</View>*/}

            <View style={styles.centeredContainer}>
                <Text style={styles.cardCount}>{currentIndex + 1}/{cards.length}</Text>
                <Text>{currentGuess}</Text>
                <View style={{ flexDirection: 'row', overflow: 'hidden' }}>
                    <FlatList
                        horizontal
                        data={scrambledWord}
                        contentContainerStyle={[styles.wordContainer, { paddingHorizontal: 20, width: width - 100 }]} // Add padding
                        renderItem={({ item, index }) => (
                            <Pressable
                                style={[styles.word, { backgroundColor: letterColors[index] || 'transparent' }]}
                                onPress={() => handleLetterSelection(item, index)}
                            >
                                <Text style={styles.wordText}>{item}</Text>
                            </Pressable>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <Pressable onPress={() => setShowWord(!showWord)}>
                    <AntDesign name="questioncircleo" size={24} color="black" />
                </Pressable>
                {showWord && <Text>{currentWord}</Text>}
            </View>

            <DefaultModal
                isVisible={showSettingsModal}
                handleClose={() => toggleSwitch(setShowSettingsModal)}
                backgroundColor="none"
                modalStyle={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5, // for Android shadow
                }}
            >
                {generateSectionContent()}
            </DefaultModal>
            <Pressable onPress={() => toggleSwitch(setShowSettingsModal)} style={{ alignSelf: 'flex-start' }}>
                <AntDesign name="setting" size={30} color="#000"/>
            </Pressable>
        </SafeAreaView>
    )
}

export default LearnScreen;