import { useAppDispatch } from "@/hooks/redux.hooks";
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
			<ThemeText style={styles.title}>Реєстрація</ThemeText>

			<TextInput
				style={styles.input}
				placeholder="Ім'я"
				placeholderTextColor="#ccc"
				keyboardType="default"
				autoCapitalize="none"
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				style={styles.input}
				placeholder="Пошта"
				placeholderTextColor="#ccc"
				keyboardType="email-address"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
			/>

			<View style={styles.passwordContainer}>
				<TextInput
					style={[styles.input, { flex: 1 }]}
					placeholder="Пароль"
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
				placeholder="Пітвердіть Пароль"
				placeholderTextColor="#ccc"
				secureTextEntry={notShowPassword}
				value={confirmPassword}
				onChangeText={setConfirmPassword}
			/>

			<Pressable style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>Sign Up</Text>
			</Pressable>

			<Pressable onPress={() => navigation.navigate(AppPath.Login)}>
				<Text style={styles.switchText}>Already have an account? Login</Text>
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
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		marginBottom: 20,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		maxWidth: 400,
		marginBottom: 20,
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
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	switchText: {
		color: "#3498db",
		fontSize: 14,
	},
});

export default RegisterScreen;
