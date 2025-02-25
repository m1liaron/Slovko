import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { register } from "../../redux/userReducer/userSlice";
import { Entypo } from "@expo/vector-icons";
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import ThemeText from '../../common/components/ThemeText/ThemeText';
import { AppPath } from '../../common/enums/app/app';
import { useAppTheme } from '../../contexts/ThemeProvider';

const RegisterScreen = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();

	const { theme: { colors }} = useAppTheme()
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [notShowPassword, setNotShowPassword] = useState(true);

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
			const error = response.payload || "Registration failed";
			return Toast.show({
				type: "error",
				text1: "Помилка",
				text2: error,
			});
		}
		navigation.navigate(AppPath.Home);
	};
	return (
		<ThemeBackground style={styles.container}>
			<Toast/>
			<ThemeText style={styles.title}>Реєстрація</ThemeText>

			<TextInput
				style={styles.input}
				placeholder="Ім'я"
				keyboardType="default"
				autoCapitalize="none"
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				style={styles.input}
				placeholder="Пошта"
				keyboardType="email-address"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
			/>

			<View style={styles.input}>
				<TextInput
					placeholder="Пароль"
					style={{ paddingVertical: 10, paddingRight: 10 }}
					secureTextEntry={notShowPassword}
					value={password}
					onChangeText={setPassword}
				/>
				<Pressable
					onPress={() => setNotShowPassword(!notShowPassword)}
				>
					<Entypo
						name={notShowPassword ? "eye" : "eye-with-line"}
						size={30}
						color={colors.background}
					/>
				</Pressable>
			</View>

			<TextInput
				style={styles.input}
				placeholder="Пітвердіть Пароль"
				secureTextEntry={notShowPassword}
				value={confirmPassword}
				onChangeText={setConfirmPassword}
			/>

			<Pressable style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>Зареєструватися</Text>
			</Pressable>

			<Pressable onPress={() => navigation.navigate(AppPath.Login)}>
				<Text style={styles.switchText}>Вже маєте акаунт? Увійти</Text>
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
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
