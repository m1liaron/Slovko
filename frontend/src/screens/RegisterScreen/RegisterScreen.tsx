import { useAppDispatch } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import ThemeText from "../../common/components/ThemeText/ThemeText";
import { AppPath } from "../../common/enums/app/app";
import { register } from "../../redux/userReducer/userSlice";

const RegisterScreen = () => {
	const navigation = useNavigation<StackNavigation>();
	const dispatch = useAppDispatch();

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [notShowPassword, setNotShowPassword] = useState<boolean>(true);

	const handleSubmit = async () => {
		if (!email.length || !password.length) {
			return Toast.show({
				type: "error",
				text1: "Помилка",
				text2: "Поля мають бути заповнені!",
			});
		}
		if (password !== confirmPassword) {
			return Toast.show({
				type: "error",
				text1: "Помилка",
				text2: "Паролі не збігаються!",
			});
		}

		const registerData = {
			name,
			email,
			password,
		};

		const response = await dispatch(register(registerData));
		if (register.rejected.match(response)) {
			// const error = response.payload || "Registration failed";
			// !Todo make type for error
			return Toast.show({
				type: "error",
				text1: "Помилка",
				text2: "Registration failed",
			});
		}
		navigation.navigate(AppPath.Home);
	};
	return (
		<ThemeBackground style={styles.container}>
			<Toast />
			<ThemeText style={styles.title}>
				{i18n.t("registerScreen.title")}
			</ThemeText>

			<TextInput
				style={styles.input}
				placeholder={i18n.t("registerScreen.namePlaceholder")}
				placeholderTextColor="#ccc"
				keyboardType="default"
				autoCapitalize="none"
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				style={styles.input}
				placeholder={i18n.t("registerScreen.emailPlaceholder")}
				placeholderTextColor="#ccc"
				keyboardType="email-address"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
			/>

			<View style={styles.passwordContainer}>
				<TextInput
					style={[styles.input, { flex: 1 }]}
					placeholder={i18n.t("registerScreen.passwordPlaceholder")}
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

			<TextInput
				style={styles.input}
				placeholder={i18n.t("registerScreen.confirmPasswordPlaceholder")}
				placeholderTextColor="#ccc"
				secureTextEntry={notShowPassword}
				value={confirmPassword}
				onChangeText={setConfirmPassword}
			/>

			<Pressable style={styles.button} onPress={handleSubmit}>
				<ThemeText style={styles.buttonText}>
					{i18n.t("registerScreen.signUpButton")}
				</ThemeText>
			</Pressable>

			<Pressable onPress={() => navigation.navigate(AppPath.Login)}>
				<Text style={styles.switchText}>
					{i18n.t("registerScreen.switchText")}
				</Text>
			</Pressable>
		</ThemeBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 30,
	},
    input: {
        width: "100%",
        maxWidth: 400,
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: "#fff",
        fontSize: 16,
        borderWidth: 0
    },
    passwordContainer: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        width: "100%",
        maxWidth: 400,
        marginBottom: 20,
        alignItems: "center"
    },
	iconContainer: {
		paddingHorizontal: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		width: "100%",
		maxWidth: 400,
		height: 50,
		backgroundColor: "#3498db",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "bold",
	},
	switchText: {
		color: "#3498db",
		fontSize: 14,
	},
});

export default RegisterScreen;
