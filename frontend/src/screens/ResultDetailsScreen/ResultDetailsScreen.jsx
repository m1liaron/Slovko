import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import styles from './ResultDetailsScreen.styles';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {useDispatch, useSelector} from "react-redux";
import {getResultDetails} from "../../redux/resultReducer/resultSlice";
import Loading from "../../components/Loading";
import BackButton from "../../components/BackButton/BackButton";
import formatDMTDate from "../../utils/formatDMTDate";
import {useAppTheme} from "../../contexts/ThemeProvider";

const ResultDetailsScreen = ({ route }) => {
    const { theme: {colors} } = useAppTheme();
    const { resultId } = route.params
    const { result, isLoading } = useSelector(state => state.results);
    const dispatch = useDispatch();
    const [selectedMode, setSelectedMode] = useState(0); // 0 - flashCards, 1 - quiz, 2 - guessWord

    useEffect(() => {
        dispatch(getResultDetails(resultId));
    }, []);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 360);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const resultTime = new Date(result.completionTime) - new Date(result.startedLearn);
    const formattedTime = formatTime(resultTime);

    const calculateCorrectPercentage = () => {
        const words = result.mode ? result.mode[selectedMode].words : [];
        const totalWords = words.length;
        const correctWords = words.filter(word => word.mistakesAmount === 0).length;
        return totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
    };

    const correctPercentage = calculateCorrectPercentage();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={[styles.header, { backgroundColor: colors.lightBackground }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20}}>
                    <BackButton />
                    <Text style={[styles.title, { color: colors.primary}]}>{result.title}</Text>

                    <View style={[styles.wastedTimeContainer, { borderColor: colors.primary } ]}>
                        <Text style={[styles.title, { color: colors.primary }]}>{formattedTime}</Text>
                    </View>
                </View>
                <Text style={[styles.title, { color: colors.primary }]}>{formatDMTDate(result.createdAt)}</Text>
            </View>


                <View style={{
                    borderWidth: 4,
                    borderColor: '#fff',
                    backgroundColor: '#40FF80',
                    borderRadius: 100,
                    padding: 10
                }}>
                    <Text style={{ fontSize: 30, color: '#fff'}}>{correctPercentage}% Вірно</Text>
                </View>

            <View style={{ marginHorizontal: 100 }}>
                <View style={styles.buttonsContainer}>
                    <PressableButton text="Картки" buttonStyle={{ backgroundColor: selectedMode === 0 ? "#004da4" : "#007AFF"}} onPress={() => setSelectedMode(0)}/>
                    <PressableButton text="Вікторина" buttonStyle={{ backgroundColor: selectedMode === 1 ? "#004da4" : "#007AFF"}} onPress={() => setSelectedMode(1)}/>
                    <PressableButton text="Вгадай слово" buttonStyle={{ backgroundColor: selectedMode === 2 ? "#004da4" : "#007AFF"}} onPress={() => setSelectedMode(2)}/>
                </View>

                {isLoading && <Loading /> }
                {result.mode && (
                    <FlatList
                        data={result.mode[selectedMode].words}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={[styles.itemContainer, { backgroundColor: colors.lightBackground }]}>
                                <View style={styles.resultContainer}>
                                    <Text style={[styles.title, { color: colors.primary }]}>{item.word} - {item.translate}</Text>
                                </View>
                                <View style={styles.mistakesAmountContainer}>
                                    <Text style={[styles.title, { color: colors.primary }]}>{item.mistakesAmount}</Text>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default ResultDetailsScreen;
