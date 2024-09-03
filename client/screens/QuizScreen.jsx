import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable, Dimensions, Alert, Platform} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import { selectCard, shuffleCards } from "../redux/cardSlice";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import {Audio} from "expo-av";

const QuizScreen = ({route}) => {
    const cards = useSelector(selectCard);
    const {groupId} = route.params;
    const cardData = cards?.filter(card => card.groupId === groupId);

    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [quizOptions, setQuizOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null)
    const [selectedOption, setSelectedOption] = useState('')

    const showingCard = cardData.slice(displayedIndex, displayedIndex + 1);
    const dispatch = useDispatch()
    const navigation = useNavigation()

    useEffect(() => {
        generateQuizOption(displayedIndex);
    }, [displayedIndex])

    const generateQuizOption = (index) => {
        const correctOption = cardData[index].data[1]; //

        const allOptions = shuffleArray([
            { text: correctOption, isCorrect: true },
            ...getIncorrectOptions(),
        ]);

        setQuizOptions(allOptions);
    }

    const getIncorrectOptions = () => {
        const incorrectOptions = cardData
                .filter((item, index) => index !== displayedIndex)
                .map(item => ({text: item.data[1], isCorrect: false})); //
        return shuffleArray(incorrectOptions).slice(0, 3);
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

    const showNextCard = () => {
        if (displayedIndex < cardData.length - 1) {
            setTimeout(() => {
                setDisplayedIndex(displayedIndex + 1);
            }, 2000)
        }
    }

    const handleOptionPress = async (newSelectedOption) => {
        const correctedOption = cardData[displayedIndex].data[1];
        setSelectedOption(newSelectedOption)

        if(newSelectedOption.text === correctedOption){
            console.log('Correct!');
            setIsCorrect(true)
            setTimeout(() => {
                setSelectedOption(null)
            }, 2000)

            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../assets/audio/success.mp3'),
                { positionMillis: 0, durationMillis: 2000 }
                );
                await sound.playAsync();
            } catch (error) {
                console.error('Error playing sound', error);
            }

                showNextCard()
            setTimeout(() => {
                generateQuizOption()
            }, 2000)
            if(displayedIndex < cardData.length - 1){
                setTimeout(() => {
                    setSelectedOption(null)
                    generateQuizOption()
                }, 2000)
            } else {
                setTimeout(() => {
                    navigation.navigate('main')
                }, 2000)
            }
        } else {
            console.log('Incorrect')
            setTimeout(() => {
                setSelectedOption(null)
            }, 1000)
            setIsCorrect(false)
        }
    }

const leaveStudy = () => {
        if(Platform.OS === 'web'){
            const request = window.confirm('Ви впевнені що хочете вийти?')
            if(request){
                navigation.navigate('main');
            }
        }
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.crossIcon}>
                <Entypo name="cross" size={40} color="black"  onPress={leaveStudy} />
                <Text style={styles.cardCount}>{displayedIndex + 1}/{cardData.length}</Text>
            </View>
            <FlatList
                data={showingCard}
                maxToRenderPerBatch={1}
                renderItem={({ item, index }) => (
                    <Pressable style={styles.card}>
                            <Text style={styles.cardText}>{item.data[0]}</Text>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
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
