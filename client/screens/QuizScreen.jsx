import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { useSelector } from "react-redux";
import { selectCard } from "../redux/cardSlice";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
const QuizScreen = () => {
    const cardData = useSelector(selectCard);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [quizOptions, setQuizOptions] = useState([]);

    const showingCard = cardData.slice(displayedIndex, displayedIndex + 1);


    const generateQuizOption = () => {
        const correctOption = cardData[displayedIndex].title;
        // const incorctOption =
    }

    const getRandomOptions = (options, count) => {
        const shuffledOptions = shuffleArray(options);
        return shuffledOptions.slice(0, count);
    }

    const shuffleArray = (array) => {
        const shuffledArray = [...array]; // Копіює масив
        for(let i = shuffledArray.length - 1; i > 0; i--){ // цикл від кінця до початку
            const j = Math.floor(Math.random() * (i + 1));  // отримання випадкогового числ
            // Ліва частина виразу [shuffledArray[i], shuffledArray[j]]: Це створення масиву з двох елементів - елемента, який знаходиться на позиції i у shuffledArray, та елемента, який знаходиться на позиції j у shuffledArray.
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
            // Права частина виразу [shuffledArray[j], shuffledArray[i]]: Це створення іншого масиву, але з оберненим порядком елементів - елемента на позиції j тепер стоїть на місці i, і навпаки.
        }
        return shuffledArray;

    }


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={showingCard}
                maxToRenderPerBatch={1}
                renderItem={({ item, index }) => (
                    <Pressable style={styles.card}>
                            <Text style={styles.cardText}>{item.title}</Text>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default QuizScreen;
