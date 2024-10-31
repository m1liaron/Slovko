import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable, useWindowDimensions, Image} from 'react-native'
import {AntDesign} from "@expo/vector-icons";
import styles from './LearnGuessWord.styles'
import {useSelector} from "react-redux";
import {selectCard} from "../../../redux/cardSlice";

const LearnGuessWord = ({ onComplete, handleSetDate }) => {
    const cards = useSelector(selectCard);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentGuess, setCurrentGuess] = useState([]);
    const [scrambledWord, setScrambledWord] = useState([]);
    const [letterColors, setLetterColors] = useState({});
    const [showTranslate, setShowTranslate] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const currentCard = cards[currentIndex];
    const currentWord = currentCard?.word;

    useEffect(() => {
        if (currentWord) {
            generateScrambledWord(currentWord);
            const dashes = generateDashes(currentWord);
            setCurrentGuess(dashes);
        }
    }, [currentIndex]);

    const generateDashes = (word) => {
        return Array(word.length).fill('_'); // Create an array of underscores representing dashes
    }

    const generateScrambledWord = (word) => {
        let wordArray = word.split('');
        for (let i = 0; i < 3; i++) {
            const randomLetter = getRandomLetter();
            const randomIndex = getRandomInt(0, wordArray.length);
            wordArray.splice(randomIndex, 0, randomLetter);
        }

        for(let i = wordArray.length - 1; i >= 0; i--) {
            const j = getRandomInt(0, i);

            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }

        setScrambledWord(wordArray);
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const getRandomLetter = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        return alphabet[getRandomInt(0, alphabet.length - 1)];
    };

    const handleLetterSelection = (letter, index) => {
        const firstDashIndex = currentGuess.indexOf('_');
        if (letter === currentWord[firstDashIndex]) {
            setCurrentGuess(currentGuess + letter);
            const updatedGuess = [...currentGuess];
            updatedGuess[firstDashIndex] = letter;
            setCurrentGuess(updatedGuess);
            removeLetterFromScrambled(index);
            setCorrectAnswers(prevState => [...prevState, true]);
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
        if (currentGuess.join('') === currentWord) {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
                if(correctAnswers.length % 2 === currentWord.length) {
                    handleSetDate(currentCard, true);
                } else {
                    handleSetDate(currentCard, false);
                }
                resetGameState();
            } else {
                onComplete()
            }
        }
    }, [currentGuess]);

    const resetGameState = () => {
        setCurrentGuess([]);
        setLetterColors({});
    };

    return (
        <>
            <Text style={styles.cardCount}>{currentIndex + 1}/{cards.length}</Text>
            <Text style={{ fontSize: 50, fontWeight: 'bold'}}>{currentGuess.join(' ')}</Text>
            <View>
                {currentCard.image && currentCard.image.url ? (
                    <Image
                        source={{ uri: currentCard.image.url.toString() }}
                        style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 20, borderWidth: 5, borderColor: '#000' }}
                    />
                ) : null}
            </View>

                <FlatList
                    horizontal
                    data={scrambledWord}
                    contentContainerStyle={styles.wordContainer}
                    renderItem={({ item, index }) => (
                        <Pressable
                            style={[styles.word, { backgroundColor: letterColors[index] || 'transparent' }]}
                            onPress={() => handleLetterSelection(item, index)}
                        >
                            <Text style={[styles.wordText, { color: letterColors[index] === 'red' ? '#fff' : '#000' }]}>{item}</Text>
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={true}
                />
            <Pressable onPress={() => setShowTranslate(!showTranslate)}>
                <AntDesign name="questioncircleo" size={24} color="black" />
            </Pressable>
            {showTranslate && <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{currentCard.translateWord}</Text>}
        </>
    );
};

export default LearnGuessWord;
