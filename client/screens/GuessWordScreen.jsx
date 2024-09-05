import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCard } from '../redux/cardSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GuessWordScreen = () => {
    const cards = useSelector(selectCard);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [scrambledWord, setScrambledWord] = useState([]);
    const [letterColors, setLetterColors] = useState({});
    const [showWord, setShowWord] = useState(false);
    const navigation = useNavigation();
    const currentWord = cards[currentIndex]?.word;

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
                navigation.navigate('home');
            }
        }
    }, [currentGuess]);

    const resetGameState = () => {
        setCurrentGuess('');
        setLetterColors({});
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.cardCount}>{currentIndex + 1}/{cards.length}</Text>
            <Text>{currentGuess}</Text>
            <FlatList
                horizontal
                data={scrambledWord}
                contentContainerStyle={styles.wordContainer}
                renderItem={({ item, index }) => (
                    <Pressable
                        style={[styles.word, { backgroundColor: letterColors[index] }]}
                        onPress={() => handleLetterSelection(item, index)}
                    >
                        <Text style={styles.wordText}>{item}</Text>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <Pressable onPress={() => setShowWord(!showWord)}>
                <AntDesign name="questioncircleo" size={24} color="black" />
            </Pressable>
            {showWord && <Text>{currentWord}</Text>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    word: {
        padding: 20,
        margin: 5,
        borderColor: '#8a8a8a',
        borderWidth: 1,
        borderRadius: 50,
    },
    wordText: {
        fontSize: 20,
    },
    cardCount: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default GuessWordScreen;
