import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TextInput, Pressable} from 'react-native'
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
    const [filterValue, setFilterValue] = useState("");
    const [showFilterInput, setShowFilterInput] = useState(false);

    useEffect(() => {
        dispatch(getResults());
    }, []);

    useEffect(() => {

    }, [showFilterInput]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginHorizontal: 60 }}>
                <View style={{ justifyContent: 'center' }}>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 40, fontWeight: 'bold' }}>2024</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 20 }}>
                            <Pressable onPress={() => setShowFilterInput(!showFilterInput)}>
                                <FontAwesome name="search" color="#000" size={40} />
                            </Pressable>
                           <Pressable>
                               <MaterialIcons name="sort" color="#000" size={40} />
                           </Pressable>
                        </View>
                    </View>
                </View>
                { showFilterInput &&
                    <View>
                        <TextInput
                            style={{
                                borderWidth: 4,
                                borderRadius: 20,
                                borderColor: '#000',
                                padding: 15,
                                width: '30%',
                                alignSelf: 'end'
                            }}
                            placeholder="Фільтр"
                            value={filterValue}
                            onChangeText={setFilterValue}
                        />
                    </View>
                }
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
            </View>
        </SafeAreaView>
    );
};

export default ResultsScreen;
