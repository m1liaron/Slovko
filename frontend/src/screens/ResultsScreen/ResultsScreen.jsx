import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native'
import styles from './ResultsScreen.styles';
import {useDispatch, useSelector} from "react-redux";
import {getResults} from "../../redux/resultsSlice";
import {SafeAreaView} from "react-native-safe-area-context";

const ResultsScreen = () => {
    const dispatch = useDispatch();
    const { results } = useSelector(state => state.results);

    useEffect(() => {
        dispatch(getResults());
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={results}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.flex}>
                            <Text>{item.title}</Text>
                            <Text>{item.createdAt}</Text>
                        </View>
                    </View>
                )}
            />
            <Text></Text>
        </SafeAreaView>
    );
};

export default ResultsScreen;
