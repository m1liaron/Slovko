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
    const [finishedSections, setFinishedSections] = useState([]); // Cards || Quiz || Word

    const toggleSwitch = (changeFunction) => changeFunction(previousState => !previousState);

    useEffect(() => {
        dispatch(getCards({ groupId }))
    }, []);

    const handleNextSection = () => {
        if(currentSection === 'cards') {
            setCurrentSection('quiz');
        } else if(currentSection === 'quiz') {
            setCurrentSection('word');
        } else {
            navigation.navigate(AppPath.Home);
        }
    }

    useEffect(() => {
        if(currentSection === 'word') {
            navigation.navigate(AppPath.Home);
        }
    }, [])

    const generateSectionContent = () => {
        const sections = [
            {
                text: 'Quiz mode',
                iconName: 'quiz',
                state: isQuizEnabled,
                changeState:setIsQuizEnabled,
            },
            {
                text: 'Guess Word mode',
                iconName: 'wordpress',
                state: isGuessWordEnabled,
                changeState: setIsGuessWordEnabled,
            }
        ];

        return sections.map((section, idx) => (
            <View style={styles.sectionContainer} key={idx}>
                <View style={styles.sectionContainer}>
                    <MaterialIcons name={section.iconName} size={30} color="#00" />
                    <Text>{section.text}</Text>
                </View>
                <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={section.state ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch(section.changeState)}
                    value={section.state}
                />
            </View>
        ))
    }
    return (
        <SafeAreaView styles={styles.container}>
            { currentSection === 'cards' && <LearnCards onComplete={handleNextSection}/>}
            { currentSection === 'quiz' && <LearnQuiz onComplete={handleNextSection}/>}
            { currentSection === 'word' && <LearnGuessWord onComplete={handleNextSection}/>}

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
        </SafeAreaView>
    )
}

export default LearnScreen;