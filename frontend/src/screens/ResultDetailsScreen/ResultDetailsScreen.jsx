import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import styles from './ResultDetailsScreen.styles';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {useDispatch, useSelector} from "react-redux";
import {getResultDetails, selectResult} from "../../redux/resultsSlice";
import Loading from "../Loading";

const ResultDetailsScreen = ({ route }) => {
    const { resultId } = route.params
    const { results, isLoading } = useSelector(state => state.results);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getResultDetails(resultId));
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}></View>
            <View style={styles.buttonsContainer}>
                <PressableButton text="Картки"/>
                <PressableButton text="Вікторина"/>
                <PressableButton text="Вгадай слово"/>
            </View>
            {isLoading && <Loading /> }
            {results.mode ? (
                <View>
                    <FlatList
                        data={results.mode[0].words}
                        renderItem={({ item }) => (
                            <View style={[styles.resultContainer, { backgroundColor: item.isCorrect ? "41ff12" : "f50000"}]}>
                                <Text>{item.word}</Text>
                            </View>
                        )}
                    />
                </View>
            ) : null}

        </SafeAreaView>
    );
};

export default ResultDetailsScreen;
