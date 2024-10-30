import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import styles from './ResultDetailsScreen.styles';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {useDispatch, useSelector} from "react-redux";
import {getResultDetails, selectResult} from "../../redux/resultsSlice";

const ResultDetailsScreen = ({ route }) => {
    const { resultId } = route.params
    const { results } = useSelector(selectResult);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getResultDetails(resultId));
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}></View>
            <View style={styles.buttonsContainer}>
                <PressableButton text="Картки"/>
                <PressableButton text="Вікторина"/>
                <PressableButton text="Вгадай слово"/>
            </View>
            <View>
                <FlatList
                    data={results}
                    renderItem={({ item }) => (
                        <View style={[styles.resultContainer, { backgroundColor: item.isCorrect ? "41ff12" : "f50000"}]}></View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default ResultDetailsScreen;
