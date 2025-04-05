import { AppPath } from "@/common/enums/app/AppPath";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
	Alert,
	Image,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { Switch } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import AvatarImage from "../../../assets/images/avatar.png";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { logout, selectUser } from "../../redux/userReducer/userSlice";
import { updateUser } from "../../redux/userReducer/userThunk";
import pickImage from "../../utils/pickImage";
import styles from "./ProfileScreen.styles";

export default function ProfileScreen() {
	const { user } = useAppSelector(selectUser);
	const { theme, toggleTheme } = useAppTheme();
	const colors = theme.colors;
	const navigation = useNavigation<StackNavigation>();
	const dispatch = useAppDispatch();
	const [image, setImage] = useState<string>("");
	const [userName, setUserName] = useState<string>("");
	const [userEmail, setUserEmail] = useState<string>("");

	const [isThemeDark, setThemeDark] = useState(theme.dark === true);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (user) {
			setUserName(user.name);
			setUserEmail(user.email);
			setImage(user.image || "");
		}
	}, [user]);

	const handleLogout = async () => {
		if (Platform.OS === "web") {
			const answer = confirm("Are you sure you want to log out?");
			if (answer) {
				dispatch(logout());
			}
		} else {
			Alert.alert(
				"Confirm Logout",
				"Are you sure you want to log out?",
				[
					{ text: "Cancel", onPress: () => {} },
					{
						text: "Logout",
						onPress: async () => {
							await AsyncStorage.removeItem("token");
							navigation.navigate(AppPath.Login);
						},
					},
				],
				{ cancelable: true }, // Allow dismissing the alert by tapping outside
			);
		}
	};

	const convertBlobToBase64 = (blobUri: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			fetch(blobUri)
				.then((response) => response.blob())
				.then((blob) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						if (typeof reader.result !== "string") {
							return reject(new Error("Result is not a string"));
						}
						resolve(reader.result);
					};
					reader.onerror = () =>
						reject(new Error("Failed to convert blob to base64"));
					reader.readAsDataURL(blob);
				})
				.catch((error) => reject(error));
		});
	};

	const convertImageToBase64 = async (uri: string): Promise<string> => {
		const response = await fetch(uri);
		const blob = await response.blob();
		const reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onloadend = () => {
				if (
					typeof reader.result === "string" &&
					reader.result &&
					reader.result
				) {
					const base64data = reader.result.split(",")[1]; // Get the Base64 part
					resolve(base64data);
				} else {
					reject(new Error("Result is not a string"));
				}
			};
			reader.onerror = () =>
				reject(new Error("Failed to convert image to base64"));
			reader.readAsDataURL(blob);
		});
	};

	const handleUpdateUser = async () => {
		let finalImageUri: string = image;

		if (Platform.OS === "web" && image.startsWith("blob:")) {
			try {
				finalImageUri = await convertBlobToBase64(image);
			} catch (error) {
				console.error("Error converting blob to base64:", error);
				return;
			}
		} else if (finalImageUri) {
			try {
				const base64Image = await convertImageToBase64(finalImageUri);
				finalImageUri = base64Image;
			} catch (error) {
				console.error("Error converting image to base64:", error);
				return;
			}
		}

		const data = {
			image: finalImageUri,
			name: userName,
			email: userEmail,
		};
		if (user) {
			dispatch(updateUser({ data, id: user.id }));
			setIsEditing(false);
		}
	};

	const onEditInfo = () => {
		setIsEditing(!isEditing);
	};

	const changeTheme = () => {
		setThemeDark(!isThemeDark);
		toggleTheme();
	};

	return (
		<ThemeBackground style={{ paddingHorizontal: 40 }}>
			<Text style={[styles.title, { color: colors.primary }]}>Ваш профіль</Text>

			<View>
				{user ? (
					<View>
						{!isEditing ? (
							<View style={{ alignSelf: "center" }}>
								<Image
									style={styles.avatarPhoto}
									source={image ? { uri: image } : AvatarImage}
								/>
							</View>
						) : (
							<Pressable
								onPress={() => pickImage(image, setImage)}
								style={{ alignSelf: "center" }}
							>
								<Image
									style={styles.avatarPhoto}
									source={image ? { uri: image } : AvatarImage}
								/>
							</Pressable>
						)}
						{!isEditing && (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									gap: 10,
								}}
							>
								<Text style={[styles.title, { color: colors.primary }]}>
									{user.name}
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										gap: 5,
									}}
								>
									<View
										style={{
											padding: 10,
											backgroundColor: "#e8fc41",
											alignSelf: "center",
											borderRadius: 10,
										}}
									>
										<Text>{user.points}</Text>
									</View>
									<Text style={{ color: colors.primary }}>Очків</Text>
								</View>
							</View>
						)}
						<Pressable onPress={onEditInfo}>
							<Text style={styles.editTitle}>Редагувати</Text>
						</Pressable>
						{!isEditing && (
							<Text style={[styles.textInfo, { color: colors.primary }]}>
								Особиста інформація
							</Text>
						)}
						{isEditing && (
							<View>
								<Text style={styles.keyName}>Ім'я</Text>
								<View
									style={[
										styles.editInputContainer,
										{ backgroundColor: colors.lightBackground },
									]}
								>
									<MaterialIcons
										name="supervised-user-circle"
										size={35}
										color={colors.iconColor}
									/>
									<TextInput
										style={[
											styles.textInputStyle,
											{
												color: colors.primary,
											},
										]}
										value={userName}
										onChangeText={(text) => setUserName(text)}
									/>
								</View>
							</View>
						)}

						{!isEditing ? (
							<>
								<View
									style={[
										styles.infoItem,
										{ backgroundColor: colors.lightBackground },
									]}
								>
									<View style={styles.flex}>
										<MaterialIcons
											name="email"
											size={35}
											color={colors.iconColor}
										/>
										<Text style={[styles.keyName, { color: colors.primary }]}>
											Пошта
										</Text>
									</View>
									<Text
										style={[styles.userInfoText, { color: colors.primary }]}
									>
										{user.email}
									</Text>
								</View>
							</>
						) : (
							<>
								<Text style={styles.keyName}>Пошта</Text>
								<View
									style={[
										styles.editInputContainer,
										{ backgroundColor: colors.lightBackground },
									]}
								>
									<MaterialIcons
										name="email"
										size={35}
										color={colors.iconColor}
									/>
									<TextInput
										style={[styles.textInputStyle, { color: colors.primary }]}
										value={userEmail}
										onChangeText={(text) => setUserEmail(text)}
									/>
								</View>
							</>
						)}

						{!isEditing ? (
							<View>
								<Text style={[styles.textInfo, { color: colors.primary }]}>
									Взаємодія
								</Text>
								<Pressable
									style={[
										styles.infoItem,
										{ backgroundColor: colors.lightBackground },
									]}
									onPress={handleLogout}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 10,
										}}
									>
										<MaterialIcons
											name="exit-to-app"
											size={35}
											color={colors.iconColor}
										/>
										<Text style={[styles.keyName, { color: colors.primary }]}>
											Вийти з акаунту
										</Text>
									</View>
									<AntDesign
										name="arrowright"
										size={35}
										color={colors.iconColor}
									/>
								</Pressable>

								<View
									style={[
										styles.infoItem,
										{ backgroundColor: colors.lightBackground },
									]}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 10,
										}}
									>
										{isThemeDark ? (
											<Feather name="moon" size={35} color={colors.iconColor} />
										) : (
											<Feather name="sun" size={35} color={colors.iconColor} />
										)}
										<Text style={[styles.keyName, { color: colors.primary }]}>
											Змінити тему
										</Text>
									</View>
									<Switch
										value={isThemeDark}
										onValueChange={changeTheme}
										trackColor={{
											false: colors.background,
											true: colors.primary,
										}}
										thumbColor={
											isThemeDark ? colors.primary : colors.lightBackground
										}
										ios_backgroundColor={colors.lightBackground}
										style={{
											transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
										}}
									/>
								</View>
							</View>
						) : (
							<PressableButton
								text="Зберегти зміни"
								onPress={handleUpdateUser}
							/>
						)}
					</View>
				) : (
					<View>
						<Text style={{ color: colors.primary }}>
							Немає інформації про данного користувача, перезайдіть у застосунок
							або в акаунт.
						</Text>
					</View>
				)}
			</View>
		</ThemeBackground>
	);
}
