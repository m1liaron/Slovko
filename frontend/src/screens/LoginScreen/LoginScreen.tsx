import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import ThemeText from "../../common/components/ThemeText/ThemeText";
import { AppPath } from "../../common/enums/app/app";
import { login } from "../../redux/userReducer/userSlice";
import styles from "./LoginScreen.styles";

const LoginScreen = () => {
	const navigation = useNavigation<StackNavigation>();
	const dispatch = useAppDispatch();
	const isConnected = useAppSelector((state) => state.network.isConnected);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [notShowPassword, setNotShowPassword] = useState(true);

	const handleSubmit = async () => {
		if (!email.length || !password.length) {
			return Toast.show({
				type: "error",
				text1: "Помилка",
				text2: "Поля мають бути заповнені!",
			});
		}

		const response = dispatch(login({ email, password }));
		if (login.rejected.match(response)) {
			// const error = response.payload || "Login failed";

			Toast.show({
				type: "error",
				text1: "Невдача",
				text2: "Login failed",
			});
		}
	};

	return (
		<ThemeBackground style={styles.container}>
			<Toast />
			<ThemeText style={styles.title}>{i18n.t("loginScreen.title")}</ThemeText>
			<TextInput
				style={styles.input}
				placeholder={i18n.t("loginScreen.emailPlaceholder")}
				placeholderTextColor="#ccc"
				keyboardType="email-address"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
			/>

			<View style={styles.passwordContainer}>
				<TextInput
					style={[styles.input, { flex: 1 }]}
					placeholder={i18n.t("loginScreen.passwordPlaceholder")}
					placeholderTextColor="#ccc"
					secureTextEntry={notShowPassword}
					value={password}
					onChangeText={setPassword}
				/>
				<Pressable
					onPress={() => setNotShowPassword(!notShowPassword)}
					style={styles.iconContainer}
				>
					<Entypo
						name={notShowPassword ? "eye" : "eye-with-line"}
						size={20}
						color="#333"
					/>
				</Pressable>
			</View>

			<Pressable style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>
					{i18n.t("loginScreen.loginButton")}
				</Text>
			</Pressable>

			<Pressable onPress={() => navigation.navigate(AppPath.Register)}>
				<Text style={styles.switchText}>
					{i18n.t("loginScreen.switchText")}
				</Text>
			</Pressable>
		</ThemeBackground>
	);
};

export default LoginScreen;
