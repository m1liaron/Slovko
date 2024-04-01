import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSelector } from "react-redux";
import { selectCard } from "../redux/cardSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import {AntDesign} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

const GuessWordScreen = () => {
    const cardData = useSelector(selectCard);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [rightWord, setRightWord] = useState('');
    const [newWord, setNewWord] = useState([]);
    const [selectedLetterColor, setSelectedLetterColor] = useState({});
    const [showWord, setShowWord] = useState(false);
    const navigation = useNavigation()

    useEffect(() => {
        // Generate initial word when component mounts
        generateNewWord();
    }, [wordIndex]); // Call generateNewWord whenever displayedIndex changes

    const currentWord = cardData[wordIndex][0]
    const generateNewWord = () => {
        const wordArray = currentWord.split('');
        const tempWord = [...wordArray];

        // Insert 3 random letters into the word array
        for (let i = 0; i < 3; i++) {
            const randomLetter = getRandomLetter();
            const randomIndex = getRandomInt(0, tempWord.length);
            tempWord.splice(randomIndex, 0, randomLetter);
        }

        setNewWord(tempWord);
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomLetter = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const randomIndex = getRandomInt(0, alphabet.length - 1);
        return alphabet[randomIndex];
    };

    const showNextWord = () => {
        if(rightWord === currentWord && wordIndex < cardData.length - 1){
            setWordIndex(wordIndex + 1)
            setRightWord('')
            setDisplayedIndex(0)
        } else if(displayedIndex >= cardData.length - 1){
            navigation.navigate('main')
        }
    }

    useEffect(() => {
        showNextWord()
    },[])

    useEffect(() => {
        if(rightWord === currentWord){
            setWordIndex(wordIndex + 1)
            setRightWord('')
            setDisplayedIndex(0)
        }
    }, [displayedIndex])
    const selectedOption = (selectedLetter, index) => {
        if (selectedLetter === currentWord[displayedIndex]) {
            console.log('Correct');
            setDisplayedIndex(displayedIndex + 1);
            setRightWord(rightWord + selectedLetter);

            // Remove the correct letter from newWord
            const updatedWord = [...newWord];
                updatedWord.splice(index, 1);
            setNewWord(updatedWord);
        } else {
            console.log('Incorrect');
            // Set selected letter color to red
            setSelectedLetterColor({ ...selectedLetterColor, [index]: 'red' });

            // Reset selected letter color after 2 seconds
            setTimeout(() => {
                setSelectedLetterColor({});
            }, 1000);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.cardCount}>{wordIndex + 1}/{cardData.length}</Text>
            <Text>{rightWord}</Text>
            <FlatList
                horizontal
                data={newWord}
                contentContainerStyle={styles.wordContainer}
                renderItem={({ item, index }) => (
                    <Pressable
                        style={[styles.word, { backgroundColor: selectedLetterColor[index] }]}
                        onPress={() => selectedOption(item, index)}
                    >
                        <Text style={styles.wordText}>{item}</Text>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <Pressable onPress={() => setShowWord(!showWord)}>
                <AntDesign name="questioncircleo" size={24} color="black" />
            </Pressable>

            {showWord ? (<Text>{currentWord}</Text>) : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
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
        borderRadius: 50
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
