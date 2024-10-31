import React, {useEffect, useState} from 'react';
import styles from './LearnScreen.styles';

import { Switch } from "react-native-gesture-handler";
import {View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import LearnCards from "../../components/Learn/LearnCards/LearnCards";
import LearnQuiz from "../../components/Learn/LearnQuiz/LearnQuiz";
import LearnGuessWord from "../../components/Learn/LearnGuessWord/LearnGuessWord";
import {useDispatch} from "react-redux";
import {getCards, updateCardsAfterLearn} from "../../redux/cardSlice";
import {useNavigation} from "@react-navigation/native";
import {AppPath} from "../../common/app/app";
import ExitModal from "../../components/Modals/ExitModal/ExitModal";


const LearnScreen = ({ route }) => {
    const { groupId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isQuizEnabled, setIsQuizEnabled] = useState(true);
    const [isGuessWordEnabled, setIsGuessWordEnabled] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('cards');
    const [finishedSections, setFinishedSections] = useState([]);
    const [isLessonOver, setIsLessonOver] = useState(false);

    // data
    const [flashCards, setFlashCards] = useState([]);
    const [quizCards, setQuizCards] = useState([]);
    const [guessWordCards, setGuessWordCards] = useState([]);

    const toggleSwitch = (changeFunction) => changeFunction(previousState => !previousState);

    useEffect(() => {
        dispatch(getCards({ groupId }))
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

    const handleSetData = (card) => {
        setFlashCards((prevFlashCards) => {
            // Only add card if it does not exist in flashCards already
            const cardExists = prevFlashCards.some(
                (item) => item.word === card.word && item.translate === card.translateWord
            );
            return cardExists
                ? prevFlashCards
                : [...prevFlashCards, { word: card.word, translate: card.translateWord, isCorrect: false }];
        });
    };

    const handleSaveResults = () => {

    }

    const finishLesson = () => {
        setIsQuizEnabled(true);
        setIsGuessWordEnabled(true);
        setShowSettingsModal(false);
        setFinishedSections([]);
        setCurrentSection('cards');
        setIsLessonOver(true);
        setTimeout(() => {
            navigation.navigate(AppPath.Home);
            dispatch(updateCardsAfterLearn({ groupId }));
        }, 2000);
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
                    <MaterialIcons name={iconName} size={30} color="#00" />
                    <Text>{text}</Text>
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


    console.log(flashCards)
    return (
        <SafeAreaView styles={styles.container}>
            <View style={{ padding: 20 }}>
                <Pressable onPress={() => setShowExitModal(true)}>
                    <AntDesign name="arrowleft" size={30} color="#000"/>
                </Pressable>
                {!isLessonOver ? (
                    <>
                        { currentSection === 'cards' && <View style={styles.centeredContainer}><LearnCards onComplete={handleNextSection} setFlashCards={handleSetData}/></View>}
                        { currentSection === 'quiz' && isQuizEnabled  && <View style={styles.centeredContainer}><LearnQuiz onComplete={handleNextSection}/></View>}
                        { currentSection === 'word' && isGuessWordEnabled  && <View style={styles.centeredContainer}><LearnGuessWord onComplete={handleNextSection}/></View>}

                        <ExitModal
                            modalVisible={showExitModal}
                            handleClose={() => setShowExitModal(false)}
                            text="Вийти з навчання та втратити прогрес?"
                        />

                        <DefaultModal
                            isVisible={showSettingsModal}
                            handleClose={() => toggleSwitch(setShowSettingsModal)}
                            backgroundColor="none"
                            modalStyle={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5, // for Android shadow
                            }}
                        >
                            {generateSectionContent()}
                        </DefaultModal>
                        <Pressable onPress={() => toggleSwitch(setShowSettingsModal)} style={{ alignSelf: 'flex-start' }}>
                            <AntDesign name="setting" size={30} color="#000"/>
                        </Pressable>
                    </>
                ) : (
                    <View>
                        <Text style={{ fontSize: 50, textAlign: 'center' }}>The lesson is over. Have a good day😁</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default LearnScreen;