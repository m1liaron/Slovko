import { Alert, Platform } from "react-native";

export const showConfirmAlert = (
	message: string,
	onConfirm: () => boolean,
	onCancel: () => boolean,
) => {
	if (Platform.OS === "web") {
		const confirmed = window.confirm(message);
		if (confirmed) {
			onConfirm();
		} else {
			onCancel();
		}
	} else {
		Alert.alert(
			"Confirm Action",
			message,
			[
				{
					text: "No",
					onPress: onCancel,
					style: "cancel",
				},
				{
					text: "Yes",
					onPress: onConfirm,
				},
			],
			{ cancelable: false },
		);
	}
};
