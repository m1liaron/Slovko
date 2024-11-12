import React, {useEffect} from 'react';
import {FlatList, Text, View} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppTheme} from "../../contexts/ThemeProvider";
import {useDispatch, useSelector} from "react-redux";
import {getAllSharedGroups} from "../../redux/sharedGroup";
import styles from './SharedGroupScreen.styles';

const SharedGroupScreen = () => {
    const { theme: { colors } } = useAppTheme();
    const dispatch = useDispatch();
    const sharedGroups = useSelector(state => state.sharedGroups.sharedGroups);

    useEffect(() => {
        dispatch(getAllSharedGroups());
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <FlatList
                data={sharedGroups}
                contentContainerStyle={{
                    flexDirection: 'column',
                    gap: 20,
                    padding: 10
                }}
                renderItem={({ item }) => (
                    <View style={styles.container}>
                        <Text style={{ color: colors.primary }}>{item.title}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default SharedGroupScreen;
