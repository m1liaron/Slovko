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
import {getCards} from "../../redux/cardSlice";
import {useNavigation} from "@react-navigation/native";
import {AppPath} from "../../common/app/app";


const LearnScreen = ({ route }) => {
    const { groupId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isQuizEnabled, setIsQuizEnabled] = useState(true);
    const [isGuessWordEnabled, setIsGuessWordEnabled] = useState(true);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('cards');
    const [finishedSections, setFinishedSections] = useState([]);
    const [isLessonOver, setIsLessonOver] = useState(false);

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
                    console.log('Finish lesson in cards');
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
                    console.log('Finish lesson in quiz');
                    finishLesson();
                }
                break;
            case 'word':
                if(isQuizEnabled && !finishedSections.includes('quiz')) {
                    setCurrentSection('quiz');
                } else {
                    console.log('Finish lesson in word');
                    finishLesson();
                }
                break;
            default:
                finishLesson();
                break;
        }
    };

    const finishLesson = () => {
        setIsQuizEnabled(true);
        setIsGuessWordEnabled(true);
        setFinishedSections([]);
        setIsLessonOver(true);
        setInterval(() => {
            navigation.navigate(AppPath.Home);
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

    return (
        <SafeAreaView styles={styles.container}>
            {!isLessonOver ? (
                <>
                    { currentSection === 'cards' && <LearnCards onComplete={handleNextSection}/>}
                    {  currentSection === 'quiz' && isQuizEnabled  && <LearnQuiz onComplete={handleNextSection}/>}
                    { currentSection === 'word' && isGuessWordEnabled  && <LearnGuessWord onComplete={handleNextSection}/>}

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
        </SafeAreaView>
    )
}

export default LearnScreen;