import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native'
import styles from './ResultsScreen.styles';
import {useDispatch, useSelector} from "react-redux";
import {getResults} from "../../redux/resultsSlice";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "@react-navigation/native";
import {AppPath} from "../../common/app/app";
import formatDMTDate from "../../utils/formatDMTDate";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";

const ResultsScreen = () => {
    const dispatch = useDispatch();
    const { results } = useSelector(state => state.results);

    useEffect(() => {
        dispatch(getResults());
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ justifyContent: 'center' }}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold' }}>2024</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 20 }}>
                        <FontAwesome name="search" color="#000" size={40} />
                        <MaterialIcons name="sort" color="#000" size={40} />
                    </View>
                </View>
            </View>
            <FlatList
                data={results}
                renderItem={({ item }) => (
                    <Link style={styles.itemContainer} to={{screen: AppPath.ResultDetails, params:{resultId: item.id}}}>
                        <View style={styles.flex}>
                            <Text>{item.title}</Text>
                            <Text>{formatDMTDate(item.createdAt)}</Text>
                        </View>
                    </Link>
                )}
            />
            <Text></Text>
        </SafeAreaView>
    );
};

export default ResultsScreen;
