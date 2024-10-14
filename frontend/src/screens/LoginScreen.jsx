import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable, Dimensions, Button} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useDispatch} from "react-redux";
import {login} from "../redux/userSlice";
import Toast from "react-native-toast-message";
import {Entypo} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notShowPassword, setNotShowPassword] = useState(true);

    const handleSubmit = async () => {
        if (!email.length || !password.length) {
            return Toast.show({
                type: 'error',
                text1: 'Fail',
                text2: 'Inputs must be filled!',
            });
        }
        
        const response = await dispatch(login({ email, password }));
        if (login.rejected.match(response)) {
            const error = response.payload || 'Login failed';
            console.log(response.payload);
            
            Toast.show({
                type: 'error',
                text1: 'Fail',
                text2: error,
            });
        } else {
            navigation.navigate('home');
        }
    };

    const showToast = () => {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: 'This is some something 👋'
        });
      }

    return (
        <SafeAreaView style={styles.container}>
            <Toast/>
            <Text style={styles.title}>Login</Text>
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

            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('register')}>
                <Text style={styles.switchText}>Don't have an account? Register</Text>
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f7f7f7',
        width: '100%',
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

export default LoginScreen;
