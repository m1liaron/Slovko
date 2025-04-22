import ThemeText from "@/common/components/ThemeText/ThemeText";
import { AppPath } from "@/common/enums/app/AppPath";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import {
	convertBlobToBase64,
	convertImageToBase64,
	pickImage,
} from "@/utils/utils";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import React from "react";
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
import AvatarImage from "../../../assets/images/avatar.png";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { logout, selectUser } from "../../redux/userReducer/userSlice";
import { updateUser } from "../../redux/userReducer/userThunk";
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

	const { language, setLanguage } = useLanguage();

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

	const toggleLanguage = () => {
		setLanguage(language === "en" ? "uk" : "en");
	};

	return (
		<ThemeBackground style={{ paddingHorizontal: 40 }}>
			<ThemeText style={styles.title}>
				{i18n.t("profileScreen.profileTitle")}
			</ThemeText>

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
								<ThemeText style={styles.title}>{user.name}</ThemeText>
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
										<ThemeText>{user.points}</ThemeText>
									</View>
									<ThemeText>{i18n.t("profileScreen.points")}</ThemeText>
								</View>
							</View>
						)}
						<Pressable onPress={onEditInfo}>
							<Text style={styles.editTitle}>
								{i18n.t("profileScreen.edit")}
							</Text>
						</Pressable>
						{!isEditing && (
							<ThemeText style={styles.textInfo}>
								{i18n.t("profileScreen.personalInfo")}
							</ThemeText>
						)}
						{isEditing && (
							<View>
								<Text style={styles.keyName}>
									{i18n.t("profileScreen.name")}
								</Text>
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
										<ThemeText style={styles.keyName}>
											{i18n.t("profileScreen.email")}
										</ThemeText>
									</View>
									<ThemeText style={styles.userInfoText}>
										{user.email}
									</ThemeText>
								</View>
							</>
						) : (
							<>
								<Text style={styles.keyName}>
									{i18n.t("profileScreen.email")}
								</Text>
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
								<ThemeText style={styles.textInfo}>
									{i18n.t("profileScreen.interaction")}
								</ThemeText>
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
										<ThemeText style={styles.keyName}>
											{i18n.t("profileScreen.logout")}
										</ThemeText>
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
										<ThemeText style={styles.keyName}>
											{i18n.t("profileScreen.changeTheme")}
										</ThemeText>
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
										<ThemeText>
											{language === "en" ? "🇬🇧 EN" : "🇺🇦 UK"}
										</ThemeText>
										<ThemeText style={styles.keyName}>
											{i18n.t("profileScreen.changeLanguage")}
										</ThemeText>
									</View>
									<Switch
										value={language === "uk"}
										onValueChange={toggleLanguage}
										trackColor={{
											false: colors.background,
											true: colors.primary,
										}}
										thumbColor={
											language === "uk"
												? colors.primary
												: colors.lightBackground
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
								text={i18n.t("profileScreen.saveChanges")}
								onPress={handleUpdateUser}
							/>
						)}
					</View>
				) : (
					<View>
						<ThemeText>{i18n.t("profileScreen.noUserInfo")}</ThemeText>
					</View>
				)}
			</View>
		</ThemeBackground>
	);
}
