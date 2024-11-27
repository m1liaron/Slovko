import React, {useEffect, useState} from 'react';
import styles from './LearnScreen.styles';

import { Switch } from "react-native-gesture-handler";
import {View, Text, Pressable, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {AntDesign, Entypo, MaterialIcons} from "@expo/vector-icons";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import LearnCards from "../../components/Learn/LearnCards/LearnCards";
import LearnQuiz from "../../components/Learn/LearnQuiz/LearnQuiz";
import LearnGuessWord from "../../components/Learn/LearnGuessWord/LearnGuessWord";
import {useDispatch, useSelector} from "react-redux";
import {getCards, updateCardsAfterLearn} from "../../redux/cardReducer/cardSlice";
import {useNavigation} from "@react-navigation/native";
import {AppPath} from "../../common/enums/app/app";
import ExitModal from "../../components/Modals/ExitModal/ExitModal";
import {saveResults} from "../../redux/resultReducer/resultSlice";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {useAppTheme} from "../../contexts/ThemeProvider";
import {selectGroup} from "../../redux/groupReducer/groupSlice";


const LearnScreen = ({ route }) => {
    const { theme } = useAppTheme();
    const { groupId } = route.params;
    const groups = useSelector(selectGroup);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isQuizEnabled, setIsQuizEnabled] = useState(true);
    const [isGuessWordEnabled, setIsGuessWordEnabled] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('cards');
    const [finishedSections, setFinishedSections] = useState([]);
    const [isLessonOver, setIsLessonOver] = useState(false);

    // results data
    const [resultModal, setResulModal] = useState(false);
    const [flashCards, setFlashCards] = useState([]);
    const [quizCards, setQuizCards] = useState([]);
    const [guessWordCards, setGuessWordCards] = useState([]);
    const [startLearnDate, setStartLearnDate] = useState(null);
    const [elapsedTime, setElapsedTime] = useState('');

    const { title: projectName } = groups?.filter(group => group.id === groupId);

    const toggleSwitch = (changeFunction) => changeFunction(previousState => !previousState);

    useEffect(() => {
        setStartLearnDate(new Date());
        dispatch(getCards({ groupId }));
    }, [dispatch, groupId]);

    const handleNextSection = () => {
        switch (currentSection) {
            case 'cards':
                if (isQuizEnabled) {
                    setCurrentSection('quiz');
                } else if (isGuessWordEnabled) {
                    setCurrentSection('word');
                } else {
                    finishLesson();
                }
                break;
            case 'quiz':
                if (isGuessWordEnabled) {
                    setFinishedSections(prevState => [...prevState, 'quiz']);
                    setCurrentSection('word');
                } else if (isQuizEnabled) {
                    setCurrentSection('quiz');
                } else {
                    finishLesson();
                }
                break;
            case 'word':
                if(isQuizEnabled && !finishedSections.includes('quiz')) {
                    setCurrentSection('quiz');
                } else {
                    finishLesson();
                }
                break;
            default:
                finishLesson();
                break;
        }
    };

    const handleSetData = (card, isCorrect) => {
        let newCard = { wordId: card.id, word: card.word, translateWord: card.translateWord, mistakesAmount: 0 };
        if(!isCorrect) {
            newCard.mistakesAmount = 1;
        }

        const updateOrAddCard = (cards, setCards) => {
            setCards((prev) => {
                const existingCardIndex = prev.findIndex(item => item.wordId === card.id);

                if(existingCardIndex !== -1 && isCorrect) {
                    return prev;
                }
                if (existingCardIndex !== -1) {
                    // If card exists, increment mistakesAmount
                    const updatedCards = [...prev];
                    updatedCards[existingCardIndex] = {
                        ...updatedCards[existingCardIndex],
                        mistakesAmount: updatedCards[existingCardIndex].mistakesAmount + 1,
                    };
                    return updatedCards;
                } else {
                    return [...prev, newCard];
                }
            });
        };

        if (currentSection === 'cards') {
            updateOrAddCard(flashCards, setFlashCards);
        } else if (currentSection === 'quiz') {
            updateOrAddCard(quizCards, setQuizCards);
        } else if (currentSection === 'word') {
            updateOrAddCard(guessWordCards, setGuessWordCards);
        }
    };

    const handleSaveResults = () => {
        const resultData = {
            title: projectName,
            flashCards,
            quiz: quizCards,
            guessWord: guessWordCards,
            startedLearn: startLearnDate,
            completionTime: new Date()
        }
        dispatch(saveResults(resultData));
    }

    const finishLesson = () => {
        setIsQuizEnabled(true);
        setIsGuessWordEnabled(true);
        setShowSettingsModal(false);
        setFinishedSections([]);
        setCurrentSection('cards');
        setIsLessonOver(true);

        const endLearnDate = new Date();
        const totalLearnedTime = endLearnDate - startLearnDate; // in milliseconds
        setElapsedTime(formatTime(totalLearnedTime));
        setResulModal(true)
    };

    const saveLessonResults = () => {
        setResulModal(false);
        navigation.navigate(AppPath.Home);
        dispatch(updateCardsAfterLearn({ groupId }));
        handleSaveResults();
    }

    const switchSection = (changeState, sectionName) => {
        toggleSwitch(changeState);

        if (currentSection === sectionName) {
            handleNextSection();
        }
    }

    const generateSectionContent = () => {
        const sections = [
            {
                text: 'Quiz mode',
                iconName: 'quiz',
                state: isQuizEnabled,
                changeState:setIsQuizEnabled,
                sectionName: 'quiz'
            },
            {
                text: 'Guess Word mode',
                iconName: 'wordpress',
                state: isGuessWordEnabled,
                changeState: setIsGuessWordEnabled,
                sectionName: 'word'
            }
        ];

        return sections.map(({iconName, text, state, changeState, sectionName}, idx) => (
            <View style={styles.sectionContainer} key={idx}>
                <View style={styles.sectionContainer}>
                    <MaterialIcons name={iconName} size={30} color={theme.colors.iconColor} />
                    <Text style={{ color: theme.colors.primary }}>{text}</Text>
                </View>
                <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={state ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => switchSection(changeState, sectionName)}
                    value={state}
                />
            </View>
        ))
    }

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const millisecondsPart = Math.floor((milliseconds % 1000) / 10); // two decimal places

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(millisecondsPart).padStart(2, '0')}`;
    };


    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();

            event.returnValue = 'Ваш прогрес буде не збережен, якщо ви покинете цю сторінку.'
            return 'Ваш прогрес буде не збережен, якщо ви покинете цю сторінку.'
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ padding: 20 }}>
                <Pressable onPress={() => setShowExitModal(true)}>
                    <Entypo name="cross" size={35} color={theme.colors.iconColor}/>
                </Pressable>
                {!isLessonOver ? (
                    <>
                        { currentSection === 'cards' && <View style={styles.centeredContainer}><LearnCards onComplete={handleNextSection} setFlashCards={handleSetData}/></View>}
                        { currentSection === 'quiz' && isQuizEnabled  && <View style={styles.centeredContainer}><LearnQuiz onComplete={handleNextSection} handleSetData={handleSetData}/></View>}
                        { currentSection === 'word' && isGuessWordEnabled  && <View style={styles.centeredContainer}><LearnGuessWord onComplete={handleNextSection} handleSetDate={handleSetData}/></View>}

                        <Pressable onPress={() => toggleSwitch(setShowSettingsModal)} style={{ alignSelf: 'flex-start' }}>
                            <AntDesign name="setting" size={30} color={theme.colors.iconColor} />
                        </Pressable>

                        <ExitModal
                            modalVisible={showExitModal}
                            handleClose={() => setShowExitModal(false)}
                            text="Вийти з навчання та втратити прогрес?"
                        />

                        <DefaultModal
                            isVisible={showSettingsModal}
                            handleClose={() => toggleSwitch(setShowSettingsModal)}
                            modalStyle={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}
                        >
                            {generateSectionContent()}
                        </DefaultModal>
                    </>
                ) : (
                    <View>
                        <DefaultModal
                            isVisible={resultModal}
                            modalStyle={{ width: '60%' }}
                            backgroundColor={theme.colors.background}
                            handleClose={saveLessonResults}
                        >
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: theme.colors.primary }}>Молодець! Гарно позаймався/лась</Text>
                                </View>
                                <Text style={{ color: theme.colors.primary, fontSize: 30 }}>Ви займались: {elapsedTime}</Text>
                            </View>
                            <PressableButton text="Зберегти" onPress={saveLessonResults}/>
                        </DefaultModal>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default LearnScreen;