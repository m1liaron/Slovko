import appLogo from "@/assets/images/favicon.png";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	Linking,
	Platform,
	Pressable,
	Text,
	View,
} from "react-native";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { AppPath } from "../../common/enums/app/app";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import { GroupList } from "../../components/Group/GroupList/GroupList";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	getRepeatedCards,
	getRepeatedCardsFromIds,
} from "../../redux/cardReducer/cardSlice";
import { getUser, logout, selectUser } from "../../redux/userReducer/userSlice";
import {
	requestNotificationPermission,
	scheduleNotification,
} from "../../utils/notifications";
import styles from "./MainScreen.styles";

const MainScreen = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigation<StackNavigation>();
	const { user } = useAppSelector(selectUser);
	const { theme } = useAppTheme();
	const [daysPassed, setDaysPassed] = useState("");
	const [showRepeatedModal, setShowRepeatedModal] = useState<boolean>(false);
	const repeatedGroupsIds = useAppSelector(
		(state) => state.cards.repeatedCards,
	);
	const repeatedCardsLength = repeatedGroupsIds.reduce(
		(prev, curr) => prev + curr.cards.length,
		0,
	);

	useEffect(() => {
		if (Platform.OS === "android" || Platform.OS === "ios") {
			const setupNotifications = async () => {
				const hasPermission = await requestNotificationPermission();
				if (!hasPermission) {
					console.log("Notifications permission not granted");
				}
			};
			setupNotifications();
		}
	}, []);

	useEffect(() => {
		const notificationText = `У вас є ${repeatedGroupsIds.length} для повторення.`;
		if (Platform.OS === "android" || Platform.OS === "ios") {
			if (repeatedGroupsIds.length > 0) {
				scheduleNotification("Час для повторення!", notificationText, {
					seconds: 5,
				});
			}
		} else {
			sendNotification();
		}
	}, [repeatedGroupsIds]);

	const sendNotification = () => {
		if (!("Notification" in window)) {
			throw new Error("Ваш браузер не підтримує повідомлення");
		}

		if (Notification.permission !== "granted") {
			Notification.requestPermission().then((permission) => {
				if (repeatedCardsLength) {
					if (permission === "granted") {
						const appLogoUri = Image.resolveAssetSource(appLogo).uri;
						const notificationOptions = {
							body: `У вас є ${repeatedCardsLength} слова для повторення.`,
							icon: appLogoUri,
						};
						new Notification("Push Notification", notificationOptions);
					} else {
						alert("Дозвольте надсилати повідомлення про слова для повторення");
						console.log("Повідомлення заблоковані користувачем.");
					}
				}
			});
		}
	};

	useEffect(() => {
		dispatch(getRepeatedCards());
	}, [dispatch]);

	const daysSince = useCallback((dateString: string) => {
		const targetDate = new Date(dateString).getTime();
		const now = new Date().getTime();

		const totalDays = Math.floor((now - targetDate) / (1000 * 3600 * 24));
		return `${totalDays} днів`;
	}, []);

	useEffect(() => {
		const days = daysSince("2022-02-24");
		setDaysPassed(days);
	}, [daysSince]);

	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	const openLink = () => {
		Linking.openURL("https://savelife.in.ua/en/");
	};

	const navigateToLearn = () => {
		navigate.navigate(AppPath.Learn);
		setShowRepeatedModal(false);
	};

	const learnAllRepeatedCards = () => {
		const allIds =
			repeatedGroupsIds.length > 1
				? repeatedGroupsIds.flatMap((group) => group.cards.map((id) => id))
				: repeatedGroupsIds[0].cards;
		dispatch(getRepeatedCardsFromIds(allIds));
		navigateToLearn();
	};

	const learnGroupRepeatedCards = (cardsIds: string[]) => {
		dispatch(getRepeatedCardsFromIds(cardsIds));
		navigateToLearn();
	};

	if (!user) {
		return <ActivityIndicator />;
	}

	const isStreakFire =
		new Date(user.lastReviewAt).toDateString() === new Date().toDateString() &&
		user.streak > 0;
	const streakColor = isStreakFire
		? "#F5712A"
		: user.frozen
			? "#2aaef5"
			: theme.colors.iconColor;

	return (
		<ThemeBackground>
			<Pressable
				style={{
					flexDirection: "row",
					justifyContent: "flex-start",
					alignItems: "center",
					paddingHorizontal: 20,
				}}
				onPress={() => navigate.navigate(AppPath.Streak)}
			>
				<FontAwesome6 name="fire-flame-simple" size={30} color={streakColor} />
				<Text style={{ color: streakColor, fontSize: 35 }}>{user?.streak}</Text>
			</Pressable>
			<Text style={styles.timePassedText}>
				Вже минуло {daysPassed} з початку війни.
			</Text>

			{repeatedGroupsIds.length ? (
				<Pressable
					style={styles.repeatButton}
					onPress={() => setShowRepeatedModal(true)}
				>
					<Text style={{ color: theme.colors.primary, fontSize: 30 }}>
						Повторити слова - {repeatedCardsLength}
					</Text>
				</Pressable>
			) : null}

			<GroupList />
			<View style={styles.anouncement}>
				<Pressable onPress={openLink}>
					<Text style={styles.title}>Save Ukraine!</Text>
				</Pressable>
			</View>

			<DefaultModal
				isVisible={showRepeatedModal}
				handleClose={() => setShowRepeatedModal(!showRepeatedModal)}
			>
				<FlatList
					data={repeatedGroupsIds}
					contentContainerStyle={{ overflow: "visible", height: 500 }}
					keyExtractor={(item) => item.title}
					renderItem={({ item }) => (
						<Pressable
							key={item.title}
							style={[
								styles.item,
								{ backgroundColor: theme.colors.lightBackground },
							]}
							onPress={() => learnGroupRepeatedCards(item.cards)}
						>
							<Text style={{ color: theme.colors.primary, fontSize: 30 }}>
								{item.title}
							</Text>
							<Text style={{ color: theme.colors.primary, fontSize: 30 }}>
								{item.cards.length}
							</Text>
						</Pressable>
					)}
				/>
				<PressableButton text="Повторити усі" onPress={learnAllRepeatedCards} />
			</DefaultModal>
		</ThemeBackground>
	);
};

export default MainScreen;
