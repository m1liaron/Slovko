import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, FlatList} from 'react-native'
import styles from './StatisticsScreen.styles';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import {useDispatch, useSelector} from "react-redux";
import {selectResult} from "../../redux/resultReducer/resultSlice";
import { getResultsStatistics } from "../../redux/resultReducer/resultThunk";
import {SafeAreaView} from "react-native-safe-area-context";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import BackButton from "../../components/BackButton/BackButton";
import {useAppTheme} from "../../contexts/ThemeProvider";

const StatisticsScreen = () => {
    const { theme: { colors }} = useAppTheme();
    const { statistics } = useSelector(selectResult);
    const dispatch = useDispatch();
    const [selectedMode, setSelectedMode] = useState('flashCards');
    const [selectedWordsMode, setSelectedWordsMode] = useState('wordLength'); // Mistakes || wordLength;

    useEffect(() => {
        dispatch(getResultsStatistics());
    }, []);

    const modesButtons = [
        { text: 'Картки', mode: 'flashCards'},
        { text: 'Вікторина', mode: 'quiz'},
        { text: 'Відгадай слово', mode: 'guessWord'},
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <BackButton />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                <FlatList 
                    data={modesButtons}
                    keyExtractor={(item) => item.text}
                    renderItem={({ item: { text, mode } }) => (
                        <PressableButton buttonStyle={{ backgroundColor: selectedMode === mode ? "#004186" : "#007AFF"}} text={text} onPress={() => setSelectedMode(mode)}/>
                    )}
                />
            </View>

            <View
                style={{
                    margin: 15,
                }}
            >
                {(statistics && statistics.amountMistakesCards) && (
                    <LineChart
                        data={{
                            labels: statistics.resultsMonths,
                            datasets: [
                                {
                                    data: statistics.amountMistakesCards[selectedMode][selectedWordsMode]
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width - 200 } // from react-native
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            },
                        }}
                        renderDotContent={({ x, y, index }) => (
                            <Text
                                key={index}
                                style={{
                                    position: "absolute",
                                    top: y - 20, // Position above the circle
                                    left: x - 10, // Center horizontally
                                    fontSize: 10,
                                    color: "#000",
                                    fontWeight: "bold"
                                }}
                            >
                                {statistics.amountMistakesCards.flashCards[index]}
                            </Text>
                        )}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                )}
                <Text>Статистика:</Text>
                <PressableButton buttonStyle={{ backgroundColor: selectedWordsMode === 'mistakes' ? "#004186" : "#007AFF"}} onPress={() => setSelectedWordsMode('mistakes')} text="Помилок"/>
                <PressableButton buttonStyle={{ backgroundColor: selectedWordsMode === 'wordLength' ? "#004186" : "#007AFF"}} onPress={() => setSelectedWordsMode('wordLength')} text="Кількість слів"/>
            </View>
        </SafeAreaView>
    );
};

export default StatisticsScreen;
