import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import styles from './ResultDetailsScreen.styles';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {useDispatch, useSelector} from "react-redux";
import {getResultDetails} from "../../redux/resultsSlice";
import Loading from "../Loading";
import BackButton from "../../components/BackButton/BackButton";

const ResultDetailsScreen = ({ route }) => {
    const { resultId } = route.params
    const { result, isLoading } = useSelector(state => state.results);
    const dispatch = useDispatch();
    const [selectedMode, setSelectedMode] = useState(0); // 0 - flashCards, 1 - quiz, 2 - guessWord

    useEffect(() => {
        dispatch(getResultDetails(resultId));
    }, []);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const millisecondsRemainder = Math.floor((milliseconds % 1000) / 10); // Get the last two digits of milliseconds

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(millisecondsRemainder).padStart(2, '0')}`;
    };

    // Calculate the result time
    const resultTime = new Date(result.completionTime) - new Date(result.startedLearn);
    const formattedTime = formatTime(resultTime);
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <BackButton />
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{result.title}</Text>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Витрачений час: {formattedTime}</Text>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{result.createdAt}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <PressableButton text="Картки" buttonStyle={{ backgroundColor: selectedMode === 0 ? "#004da4" : "#007AFF"}} onPress={() => setSelectedMode(0)}/>
                <PressableButton text="Вікторина" buttonStyle={{ backgroundColor: selectedMode === 1 ? "#004da4" : "#007AFF"}} onPress={() => setSelectedMode(1)}/>
                <PressableButton text="Вгадай слово" buttonStyle={{ backgroundColor: selectedMode === 2 ? "#004da4" : "#007AFF"}} onPress={() => setSelectedMode(2)}/>
            </View>
            {isLoading && <Loading /> }
            {result.mode ? (
                <View>
                    <FlatList
                        data={result.mode[selectedMode].words}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <View style={styles.resultContainer}>
                                    <Text style={styles.title}>{item.word}</Text>
                                    <Text style={styles.title}> - {item.translate}</Text>
                                </View>
                                <View>
                                    <View style={styles.mistakesAmountContainer}>
                                        <Text style={styles.title}>{item.mistakesAmount}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={{justifyContent: 'center', flex: 1, margin: 20, gap: 20}}
                    />
                </View>
            ) : null}

        </SafeAreaView>
    );
};

export default ResultDetailsScreen;
