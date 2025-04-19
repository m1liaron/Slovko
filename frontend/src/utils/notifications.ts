import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const requestNotificationPermission = async () => {
	const { status } = await Notifications.getPermissionsAsync();
	if (status !== "granted") {
		const { status: newStatus } = await Notifications.requestPermissionsAsync();
		return newStatus === "granted";
	}
	return true;
};

const scheduleNotification = async (
	title: string,
	body: string,
	trigger: Notifications.NotificationTriggerInput,
) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			sound: true,
		},
		trigger,
	});
};


export { requestNotificationPermission, scheduleNotification };