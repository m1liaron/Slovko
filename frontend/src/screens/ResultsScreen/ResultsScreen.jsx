import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, TextInput, Pressable } from 'react-native'
import styles from './ResultsScreen.styles';
import {useDispatch, useSelector} from "react-redux";
import {filterResults, getResults, resetResults, sortResults} from "../../redux/resultReducer/resultSlice";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "@react-navigation/native";
import {AppPath} from "../../common/enums/app/app";
import formatDMTDate from "../../utils/formatDMTDate";
import {FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import {useAppTheme} from "../../contexts/ThemeProvider";

const ResultsScreen = () => {
    const dispatch = useDispatch();
    const { theme: { colors } } = useAppTheme();
    const { results } = useSelector(state => state.results);
    const [filterValue, setFilterValue] = useState("");
    const [showFilterInput, setShowFilterInput] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [groupedResults, setGroupedResults] = useState({});

    useEffect(() => {
        if (results.length > 0) {
            const groupedData = groupResultsByDay(results);
            setGroupedResults(groupedData);
        }
    }, [results]);

    const groupResultsByDay = (results) => {
        return results.reduce((groups, item) => {
            const date = new Date(item.createdAt).toISOString().split('T')[0]; // Format as YYYY-MM-DD
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(item);
            return groups;
        }, {});
    };

    console.log(Object.entries(groupedResults))

    useEffect(() => {
        dispatch(getResults());
    }, []);

    const handleSort = () => {
        dispatch(sortResults({ key: 'title', direction: sortOrder }));
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:colors.background }}>
                <View style={{ justifyContent: 'center' }}>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 40, fontWeight: 'bold', color: colors.primary }}>2024</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 20 }}>
                            <Pressable onPress={() => setShowFilterInput(!showFilterInput)}>
                                <FontAwesome name="search" color={colors.iconColor} size={40} />
                            </Pressable>
                            <Pressable onPress={handleSort}>
                                <FontAwesome name={sortOrder === 'asc' ? "sort-alpha-asc" : "sort-alpha-desc"} color={colors.iconColor} size={40} />
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
                                borderColor: colors.primary,
                                padding: 15,
                                width: '30%',
                                alignSelf: 'end',
                                color: colors.primary,
                            }}
                            placeholder="Фільтр"
                            placeholderTextColor={colors.primary}
                            value={filterValue}
                            onChangeText={setFilterValue}
                        />
                        <Pressable
                            style={{
                                borderWidth: 4,
                                borderRadius: 20,
                                borderColor: colors.primary,
                                padding: 15,
                                alignSelf: 'end'
                            }}
                            onPress={() => dispatch(filterResults(filterValue))}
                        >
                            <Text style={{ color: colors.primary }}>Фільтрувати</Text>
                        </Pressable>
                        <Pressable
                            style={{
                                borderWidth: 4,
                                borderRadius: 20,
                                borderColor: colors.primary,
                                padding: 15,
                                alignSelf: 'end'
                            }}
                            onPress={() => dispatch(resetResults())}
                        >
                            <FontAwesome6 name="arrow-rotate-left" color={colors.iconColor}/>
                        </Pressable>
                    </View>
                }

                <FlatList
                    data={Object.entries(groupedResults)}
                    keyExtractor={(item) => item[0]}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 25, color: colors.lightBackground, fontWeight: 'bold', textAlign: 'center' }}>
                                {item[0]} {/* Date */}
                            </Text>
                            {item[1].map(result => (
                                <Link
                                    key={result.id}
                                    style={[styles.itemContainer, { backgroundColor: colors.lightBackground }]}
                                    to={{ screen: AppPath.ResultDetails, params: { resultId: result.id } }}
                                >
                                    <View style={styles.flex}>
                                        <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 30 }}>
                                            {result.title}
                                        </Text>
                                        <Text style={{ color: colors.primary }}>
                                            {new Date(result.createdAt).toLocaleTimeString()} {/* Show time */}
                                        </Text>
                                    </View>
                                </Link>
                            ))}
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
        </SafeAreaView>
    );
};

export default ResultsScreen;
