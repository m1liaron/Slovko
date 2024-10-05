import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {Linking, Pressable, StyleSheet, Text, View} from "react-native";
import { GroupList } from "../components/Group/GroupList";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";
import {Link} from "@react-navigation/native";

const MainScreen = () => {
    const dispatch = useDispatch();
    const [daysPassed, setDaysPassed] = useState('');

    function daysSince(dateString) {
        const targetDate = new Date(dateString);
        const now = new Date();

        // Визначаємо кількість днів, що минули
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Слава Україні!</Text>
            <Text style={styles.subtitle}>Героям слава!</Text>
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
