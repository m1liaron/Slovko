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
import {Audio} from "expo-av";
import {AppPath} from "../../common/app/app";
import LearnCards from "../../components/Learn/LearnCards/LearnCards";
import LearnQuiz from "../../components/Learn/LearnQuiz/LearnQuiz";

const CARD_WIDTH = Dimensions.get('window').width - 100;

const LearnScreen = ({ route }) => {
    const { groupId } = route.params;
    const cards = useSelector(selectCard);
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

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
            <LearnCards/>
            <LearnQuiz/>

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