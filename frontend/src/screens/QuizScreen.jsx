import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable, Dimensions, Alert, Platform} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import { selectCard, shuffleCards } from "../redux/cardSlice";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import {Audio} from "expo-av";

const QuizScreen = () => {
    const cards = useSelector(selectCard);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [quizOptions, setQuizOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null)
    const [selectedOption, setSelectedOption] = useState('')

    const currentCard = cards[displayedIndex];
    const dispatch = useDispatch()
    const navigation = useNavigation()

    useEffect(() => {
        generateQuizOption();
    }, [displayedIndex])

    const generateQuizOption = () => {
        if(!currentCard) return;
        const correctOption = { text: currentCard.translateWord, isCorrect: true };
        const incorrectOptions = getIncorrectOptions();
        const shuffledOptions = shuffleArray([correctOption, ...incorrectOptions]);
        setQuizOptions(shuffledOptions);
    }

    const getIncorrectOptions = () => {
        return cards
                .filter((item, index) => index !== displayedIndex)
                .map(item => ({text: item.translateWord, isCorrect: false}))
                .slice(0, 3)
    }

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const moveToNextCard  = () => {
        if (displayedIndex < cards.length - 1) {
            setTimeout(() => {
                setDisplayedIndex(displayedIndex + 1);
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

    const leaveStudy = () => {
        if (Platform.OS === 'web' ? window.confirm('Ви впевнені що хочете вийти?') : true) {
            Alert.alert('Ви впевнені що хочете вийти?', '', [
                { text: 'Вийти', onPress: () => { dispatch(shuffleCards()); navigation.navigate('main'); } },
                { text: 'Скасувати', style: 'cancel' }
            ]);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.crossIcon}>
                    <Entypo name="cross" size={40} color="black"  onPress={leaveStudy} />
                    <Text style={styles.cardCount}>{displayedIndex + 1}/{cards.length}</Text>
                </View>
                <Pressable style={styles.card}>
                    <Text style={styles.cardText}>{currentCard.word}</Text>
                </Pressable>
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
                                                ? '#a1dc93'
                                                : isCorrect === false
                                                    ? '#df5151'
                                                    : '#8e8e8e'
                                            : '#d0d0d0',
                                },
                            ]} onPress={() => handleOptionPress(item)}>
                            <Text>{item.text}</Text>
                        </Pressable>
                    )}
                    style={styles.listContainer}
                    keyExtractor={(item, index) => index.toString()}
                />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        padding:20
    },
    cardCount: {
        fontSize: 18,
    },
    card: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width - 40, // Adjust the width as needed
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 15,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    listContainer:{
    },
    crossIcon: {
        flexDirection: 'row', // Enable horizontal layout
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Ensure the container takes the full width
        paddingHorizontal: 20, // Add padding for better spacing
    },
    optionContainer:{
        backgroundColor:'#b4b4b4',
        padding:20,
        borderRadius:5,
        marginTop:10,
        width:200,
        alignItems:'center',
        color:'#fff'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default QuizScreen;
