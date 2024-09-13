import React, { useState} from 'react';
import styles from './LearnScreen.styles';

import { Switch } from "react-native-gesture-handler";
import {View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import LearnCards from "../../components/Learn/LearnCards/LearnCards";
import LearnQuiz from "../../components/Learn/LearnQuiz/LearnQuiz";
import LearnGuessWord from "../../components/Learn/LearnGuessWord/LearnGuessWord";


const LearnScreen = ({ route }) => {
    const { groupId } = route.params;

    // settings
    const [isQuizEnabled, setIsQuizEnabled] = useState(true);
    const [isGuessWordEnabled, setIsGuessWordEnabled] = useState(true);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const toggleSwitch = (changeFunction) => changeFunction(previousState => !previousState);

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
            <LearnCards />
            <LearnQuiz />
            <LearnGuessWord />

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