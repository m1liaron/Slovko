import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native'
import styles from './LearnQuiz.styles';
import {Audio} from "expo-av";
import { useSelector} from "react-redux";
import {selectCard} from "../../../redux/cardSlice";
import {useAppTheme} from "../../../contexts/ThemeProvider";
import ProgressContainer from "../../ProgressContainer/ProgressContainer";

const LearnQuiz = ({ onComplete, handleSetData }) => {
    const cards = useSelector(selectCard);
    const { theme: { colors } } = useAppTheme();

    const [displayedQuizIndex, setDisplayedQuizIndex] = useState(0);
    const [quizOptions, setQuizOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null)
    const [selectedOption, setSelectedOption] = useState('')
    const currentCard = cards[displayedQuizIndex];

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
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(item => ({text: item.translateWord, isCorrect: false}))
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
            onComplete();
        }
    }

    const handleOptionPress = async (option) => {
        setSelectedOption(option);
        if (option.isCorrect) {
            await playSuccessSound();
            setIsCorrect(true);
            moveToNextCard();
            handleSetData(currentCard, true)
        } else {
            setIsCorrect(false);
            handleSetData(currentCard, false)
        }

        setTimeout(() => {
            setSelectedOption(null);
        }, 1000);
    };

    const playSuccessSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../../assets/audio/success.mp3'),
                { positionMillis: 0, durationMillis: 2000 }
            );

            await sound.setVolumeAsync(0.2);

            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    }

    if (!cards || cards.length === 0 || !currentCard) {
        return <Text>No cards available</Text>;  // Add a fallback in case of no data
    }

    return (
        <>
            <ProgressContainer index={displayedQuizIndex} length={cards.length} />
            <View style={styles.card}>
                <Text style={[styles.cardText, { color: colors.primary, borderColor: colors.primary }]}>{currentCard.word}</Text>
            </View>
            <FlatList
                data={quizOptions}
                renderItem={({ item }) => (
                    <Pressable
                        style={[
                            styles.optionContainer,
                            {
                                backgroundColor:
                                    selectedOption === item
                                        ? isCorrect === true
                                            ? '#7eac73'
                                            : isCorrect === false
                                                ? '#a03030'
                                                : '#8e8e8e'
                                        : colors.lightBackground,
                            },
                        ]}
                        onPress={() => handleOptionPress(item)}>
                        <Text style={{ fontSize: 30, color: colors.primary }}>{item.text}</Text>
                    </Pressable>
                )}
                style={{ flexGrow: 1 }}
                keyExtractor={(item, index) => index.toString()}
            />
        </>
    );
};

export default LearnQuiz;
