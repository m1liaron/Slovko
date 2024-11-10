import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {Linking, Pressable, StyleSheet, Text, View} from "react-native";
import { GroupList } from "../components/Group/GroupList";
import {useDispatch, useSelector} from "react-redux";
import {getUser, selectUser} from "../redux/userSlice";
import {FontAwesome6} from "@expo/vector-icons";
import {useAppTheme} from "../contexts/ThemeProvider";

const MainScreen = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(selectUser);
    const { theme } = useAppTheme();
    const [daysPassed, setDaysPassed] = useState('');

    function daysSince(dateString) {
        const targetDate = new Date(dateString);
        const now = new Date();

        const totalDays = Math.floor((now - targetDate) / (1000 * 3600 * 24));
        return `${totalDays} днів`;
    }

    useEffect(() => {
        const days = daysSince('2022-02-24');
        setDaysPassed(days);
    }, []);

    useEffect(() => {
        dispatch(getUser());
    }, []);

    const openLink = () => {
        Linking.openURL('https://savelife.in.ua/en/');
    };

    const isStreakFire = new Date(user.lastReviewAt).toDateString() === new Date().toDateString();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: 20
            }}>
                <FontAwesome6 name="fire-flame-simple" size={30} color={isStreakFire ? "#F5712A" : theme.colors.iconColor} />
                <Text style={{ color: isStreakFire ? "#F5712A" : theme.colors.primary, fontSize: 35 }}>{user.streak}</Text>
            </View>
            <Text style={styles.timePassedText}>Вже минуло {daysPassed} з початку війни.</Text>
            <GroupList/>
            <View style={styles.anouncement}>
                <Pressable onPress={openLink}>
                    <Text style={styles.title}>Save Ukraine!</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6', // Світлий фон
    },
    anouncement: {
        backgroundColor: '#FFD700',
        width: '100%',
        padding: 10
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0033A0', // Синій колір
        marginTop: 20,
    },
    subtitle: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        color: '#FFD700', // Жовтий колір
        marginBottom: 10,
    },
    timePassedText: {
        textAlign: 'center',
        fontSize: 24,
        backgroundColor: '#FFD700', // Жовтий
        color: '#0033A0', // Синій текст
        padding: 15,
        borderRadius: 10,
        margin: 20,
        fontWeight: 'bold',
    },
});

export default MainScreen;
