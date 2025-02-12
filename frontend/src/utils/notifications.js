import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export const requestNotificationPermission = async () => {
	const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	if (status !== "granted") {
		const { status: newStatus } = await Permissions.askAsync(
			Permissions.NOTIFICATIONS,
		);
		return newStatus === "granted";
	}
	return true;
};

export const scheduleNotification = async (title, body, trigger) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			sound: true,
		},
		trigger,
	});
};
