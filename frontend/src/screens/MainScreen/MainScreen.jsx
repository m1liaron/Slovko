import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {Linking, Pressable, Text, View} from "react-native";
import { GroupList } from "../../components/Group/GroupList";
import {useDispatch, useSelector} from "react-redux";
import {getUser, selectUser} from "../../redux/userReducer/userSlice";
import {FontAwesome6} from "@expo/vector-icons";
import {useAppTheme} from "../../contexts/ThemeProvider";
import styles from './MainScreen.styles';
import {getRepeatedCards, getRepeatedCardsFromIds} from "../../redux/cardReducer/cardSlice";
import {useNavigation} from "@react-navigation/native";
import {AppPath} from "../../common/enums/app/app";
import {requestNotificationPermission, scheduleNotification} from "../../utils/notifications";

const MainScreen = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(selectUser);
    const { theme } = useAppTheme();
    const [daysPassed, setDaysPassed] = useState('');
    const repeatedCardsIds = useSelector(state => state.cards.repeatedCards);
    const navigate = useNavigation();

    useEffect(() => {
        const setupNotifications = async () => {
            const hasPermission = await requestNotificationPermission();
            if (!hasPermission) {
                console.log('Notifications permission not granted');
            }
        };
        setupNotifications();
    }, []);

    useEffect(() => {
        if(repeatedCardsIds.length > 0) {
            scheduleNotification(
                'Час для повторення!',
                `У вас є ${repeatedCardsIds.length} для повторення.`,
                { seconds: 5 }
            )
        }
    }, [repeatedCardsIds]);

    useEffect(() => {
        dispatch(getRepeatedCards());
    }, []);

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

    const learnRepeatedCards = () => {
        dispatch(getRepeatedCardsFromIds(repeatedCardsIds));
        navigate.navigate(AppPath.Learn);
    }


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

            {repeatedCardsIds.length &&
                <Pressable style={styles.repeatButton} onPress={learnRepeatedCards}>
                    <Text style={{ color: theme.colors.primary, fontSize: 30 }}>Повторити слова - {repeatedCardsIds.length}</Text>
                </Pressable>
            }

            <GroupList/>
            <View style={styles.anouncement}>
                <Pressable onPress={openLink}>
                    <Text style={styles.title}>Save Ukraine!</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default MainScreen;
