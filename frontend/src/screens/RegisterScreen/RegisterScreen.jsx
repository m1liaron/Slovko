import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useDispatch} from "react-redux";
import Toast from "react-native-toast-message";
import { register} from "../../redux/userReducer/userSlice";
import {Entypo} from "@expo/vector-icons";

const RegisterScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notShowPassword, setNotShowPassword] = useState(true);

    const handleSubmit = async () => {
        if(!email.length || !password.length) {
            return Toast.show({
                type: 'error',
                text1: 'Fail',
                text2: 'Inputs must be filled!'
            })
        }
        if(password !== confirmPassword) {
            return Toast.show({
                type: 'error',
                text1: 'Fail',
                text2: 'Passwords do not match!'
            })
        }

        const registerData = {
            name,
            email,
            password
        }

        const response = await dispatch(register(registerData));
        if(register.rejected.match(response)) {
            const error = response.payload || 'Registration failed';
            return Toast.show({
                type: 'error',
                text1: 'Fail',
                text2: error
            })
        }
        navigation.navigate('home');
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#ccc"
                keyboardType="default"
                autoCapitalize="none"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    secureTextEntry={notShowPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <Pressable onPress={() => setNotShowPassword(!notShowPassword)} style={styles.iconContainer}>
                    <Entypo name={notShowPassword ? "eye" : "eye-with-line"} size={20} color="#333" />
                </Pressable>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#ccc"
                secureTextEntry={notShowPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('login')}>
                <Text style={styles.switchText}>Already have an account? Login</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        width: '100%',
        maxWidth: 400,
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
    },
    iconContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        maxWidth: 400,
        height: 50,
        backgroundColor: '#3498db',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchText: {
        color: '#3498db',
        fontSize: 14,
    },
});

export default RegisterScreen;
