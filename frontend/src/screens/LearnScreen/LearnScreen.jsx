import React, {useEffect, useState} from 'react';
import styles from './LearnScreen.styles';

import { Switch } from "react-native-gesture-handler";
import {View, Text, Pressable, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {AntDesign, Entypo, MaterialIcons} from "@expo/vector-icons";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import LearnCards from "../../components/Learn/LearnCards/LearnCards";
import LearnQuiz from "../../components/Learn/LearnQuiz/LearnQuiz";
import LearnGuessWord from "../../components/Learn/LearnGuessWord/LearnGuessWord";
import {useDispatch, useSelector} from "react-redux";
import {getRepeatedCards, updateCardsAfterLearn} from "../../redux/cardReducer/cardSlice";
import {AppPath, DataStatus} from "../../common/enums/app/app";
import ExitModal from "../../components/Modals/ExitModal/ExitModal";
import {saveResults} from "../../redux/resultReducer/resultSlice";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {useAppTheme} from "../../contexts/ThemeProvider";
import {selectGroup} from "../../redux/groupReducer/groupSlice";
import {useNavigation} from "@react-navigation/native";
import Loading from "../../components/Loading";
import {updateUserStreak} from "../../redux/userReducer/userSlice";
import {formatTime} from "../../utils/formatTime";


const LearnScreen = ({ route }) => {
    const { theme } = useAppTheme();
    const { groupId } = route.params || {};
    const groups = useSelector(selectGroup);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { repeatedCards, cards, status } = useSelector(state => state.cards);

    const [isQuizEnabled, setIsQuizEnabled] = useState(true);
    const [isGuessWordEnabled, setIsGuessWordEnabled] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('cards');
    const [finishedSections, setFinishedSections] = useState([]);
    const [isLessonOver, setIsLessonOver] = useState(false);

    const [flashCards, setFlashCards] = useState([]);
    const [quizCards, setQuizCards] = useState([]);
    const [guessWordCards, setGuessWordCards] = useState([]);
    const [startLearnDate, setStartLearnDate] = useState(null);
    const [elapsedTime, setElapsedTime] = useState('');

    const projectName = groups?.find(group => group.id === groupId)?.title;

    useEffect(() => {
        setStartLearnDate(new Date());
    }, [dispatch, groupId]);

    const toggleSwitch = (changeFunction) => changeFunction(previousState => !previousState);

    const handleNextSection = () => {
        const transitions = {
            cards: isQuizEnabled ? 'quiz' : isGuessWordEnabled ? 'word' : 'finish',
            quiz: isGuessWordEnabled ? 'word' : 'finish',
            word: finishedSections.includes('quiz') ? 'finish' : 'quiz',
        };
        const nextSection = transitions[currentSection] || 'finish';
        if(nextSection === 'finish') {
            finishLesson();
        } else {
            setFinishedSections((prev) => [...prev, currentSection]);
            setCurrentSection(nextSection);
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
            title: projectName || new Date(),
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

        if(groupId) {
            dispatch(updateCardsAfterLearn({ groupId }));
        } else {
            const repeatedCardsIds = cards.map(card => card.map(id => id));
            dispatch(updateCardsAfterLearn(repeatedCardsIds))
        }
        dispatch(updateUserStreak());
        handleSaveResults();
        if(repeatedCards.length) {
           dispatch(getRepeatedCards());
        }
    };

    const leaveStudy = () => {
        navigation.navigate(AppPath.Main);
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

    if(Platform.OS === 'web') {
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
    }

    const resultsData = [...flashCards, ...quizCards, ...guessWordCards];
    const correctAnswersAmount = resultsData.filter(item => item.mistakesAmount === 0).length;
    const accuracy  = Math.floor((correctAnswersAmount / resultsData.length) * 100);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ padding: 20}}>
                {!isLessonOver ? (
                    <View style={{ justifyContent:'center', paddingHorizontal: 20 }}>
                        <Pressable onPress={() => setShowExitModal(true)}>
                            <Entypo name="cross" size={35} color={theme.colors.iconColor}/>
                        </Pressable>

                        {status === DataStatus.PENDING ? (
                             <Loading/>
                        ) : (
                            <View style={styles.centeredContainer}>
                                { currentSection === 'cards' && <LearnCards onComplete={handleNextSection} setFlashCards={handleSetData}/>}
                                { currentSection === 'quiz' && isQuizEnabled  && <LearnQuiz onComplete={handleNextSection} handleSetData={handleSetData}/>}
                                { currentSection === 'word' && isGuessWordEnabled  && <LearnGuessWord onComplete={handleNextSection} handleSetDate={handleSetData}/>}

                                <Pressable onPress={() => toggleSwitch(setShowSettingsModal)} style={{ alignSelf: 'flex-start' }}>
                                    <AntDesign name="setting" size={30} color={theme.colors.iconColor} />
                                </Pressable>
                            </View>
                        )}

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
                    </View>
                ) : (
                    <>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                            <Text style={{ color: theme.colors.primary, textAlign: 'center', fontSize: 30 }}>Молодець! Гарно позаймався/лась</Text>

                            <View style={{ marginBottom: 30 }}>
                                <View style={[styles.resultItemContainer, { borderColor: theme.colors.primary}]}>
                                    <Text style={{ color: theme.colors.primary, fontSize: 30 }}>{elapsedTime}</Text>
                                </View>

                                <View style={[styles.resultItemContainer, { borderColor: theme.colors.primary}]}>
                                    <Text style={{ color: theme.colors.primary, fontSize: 30 }}>{correctAnswersAmount * 10} очок</Text>
                                </View>
                                <View style={[styles.resultItemContainer, { borderColor: theme.colors.primary}]}>
                                    <Text style={{ color: theme.colors.primary, fontSize: 30 }}>{accuracy}% точність</Text>
                                </View>
                            </View>
                        </View>
                        <PressableButton text="Продовжити" onPress={leaveStudy} />
                    </>
                )
                }
            </View>
        </SafeAreaView>
    )
}

export default LearnScreen;