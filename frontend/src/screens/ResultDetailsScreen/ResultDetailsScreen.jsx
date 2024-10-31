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
    const { results, isLoading } = useSelector(state => state.results);
    const dispatch = useDispatch();
    const [selectedMode, setSelectedMode] = useState(0); // 0 - flashCards, 1 - quiz, 2 - guessWord


    useEffect(() => {
        dispatch(getResultDetails(resultId));
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <BackButton />
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{results.title}</Text>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{results.createdAt}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <PressableButton text="Картки" onPress={() => setSelectedMode(0)}/>
                <PressableButton text="Вікторина" onPress={() => setSelectedMode(1)}/>
                <PressableButton text="Вгадай слово" onPress={() => setSelectedMode(2)}/>
            </View>
            {isLoading && <Loading /> }
            {results.mode ? (
                <View>
                    <FlatList
                        data={results.mode[selectedMode].words}
                        renderItem={({ item }) => (
                            <View style={[styles.resultContainer, { backgroundColor: item.isCorrect ? "#32ba11" : "#f50000"}]}>
                                <Text style={{ color: '#fff'}}>{item.word}</Text>
                                <Text style={{ color: '#fff'}}> - {item.translate}</Text>
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
