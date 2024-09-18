import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable, useWindowDimensions} from 'react-native'
import {AntDesign} from "@expo/vector-icons";
import styles from './LearnGuessWord.styles'
import {useSelector} from "react-redux";
import {selectCard} from "../../../redux/cardSlice";
import {useNavigation} from "@react-navigation/native";

const LearnGuessWord = ({ onComplete }) => {
    const cards = useSelector(selectCard);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [scrambledWord, setScrambledWord] = useState([]);
    const [letterColors, setLetterColors] = useState({});
    const [showWord, setShowWord] = useState(false);
    const navigation = useNavigation();
    const currentWord = cards[currentIndex]?.word;
    const { width } = useWindowDimensions();

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
                onComplete()
            }
        }
    }, [currentGuess]);

    const resetGameState = () => {
        setCurrentGuess('');
        setLetterColors({});
    };

    return (
        <View style={styles.guessWordContainer}>
            <Text style={styles.cardCount}>{currentIndex + 1}/{cards.length}</Text>
            <Text style={{ fontSize: 50, fontWeight: 'bold'}}>{currentGuess}</Text>
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
    );
};

export default LearnGuessWord;
