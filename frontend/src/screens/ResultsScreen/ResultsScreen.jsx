import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TextInput, Pressable} from 'react-native'
import styles from './ResultsScreen.styles';
import {useDispatch, useSelector} from "react-redux";
import {filterResults, getResults, resetResults, sortResults} from "../../redux/resultsSlice";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "@react-navigation/native";
import {AppPath} from "../../common/app/app";
import formatDMTDate from "../../utils/formatDMTDate";
import {FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import {useAppTheme} from "../../contexts/ThemeProvider";

const ResultsScreen = () => {
    const dispatch = useDispatch();
    const { theme } = useAppTheme();
    const { results } = useSelector(state => state.results);
    const [filterValue, setFilterValue] = useState("");
    const [showFilterInput, setShowFilterInput] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        dispatch(getResults());
    }, []);

    const handleSort = () => {
        dispatch(sortResults({ key: 'title', direction: sortOrder }));
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{ marginHorizontal: 60 }}>
                <View style={{ justifyContent: 'center' }}>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 40, fontWeight: 'bold', color: theme.colors.primary }}>2024</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 20 }}>
                            <Pressable onPress={() => setShowFilterInput(!showFilterInput)}>
                                <FontAwesome name="search" color={theme.colors.iconColor} size={40} />
                            </Pressable>
                            <Pressable onPress={handleSort}>
                                <FontAwesome name={sortOrder === 'asc' ? "sort-alpha-asc" : "sort-alpha-desc"} color={theme.colors.iconColor} size={40} />
                            </Pressable>
                        </View>
                    </View>
                </View>
                { showFilterInput &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
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
                        <Pressable
                            style={{
                                borderWidth: 4,
                                borderRadius: 20,
                                borderColor: '#000',
                                padding: 15,
                                alignSelf: 'end'
                            }}
                            onPress={() => dispatch(filterResults(filterValue))}
                        >
                            <Text>Фільтрувати</Text>
                        </Pressable>
                        <Pressable
                            style={{
                                borderWidth: 4,
                                borderRadius: 20,
                                borderColor: '#000',
                                padding: 15,
                                alignSelf: 'end'
                            }}
                            onPress={() => dispatch(resetResults())}
                        >
                            <FontAwesome6 name="arrow-rotate-left" />
                        </Pressable>
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
