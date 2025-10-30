import { useAppDispatch } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import ThemeText from '../../common/components/ThemeText/ThemeText';
import { AppPath } from '../../common/enums/app/app';
import { register } from '../../redux/userReducer/userSlice';
import { isValidEmail, isValidPassword } from '@/utils';
import { useAppTheme } from '@/contexts/ThemeProvider';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import styles from '../LoginScreen/LoginScreen.styles';

const RegisterScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useAppDispatch();
  const {
    theme: { colors },
  } = useAppTheme();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [notShowPassword, setNotShowPassword] = useState<boolean>(true);

  const handleSubmit = async () => {
    if (!email.length || !password.length) {
      return Toast.show({
        type: 'error',
        text1: 'Помилка',
        text2: 'Поля мають бути заповнені!',
      });
    }
    if (password !== confirmPassword) {
      return Toast.show({
        type: 'error',
        text1: 'Помилка',
        text2: 'Паролі не збігаються!',
      });
    }

    if (!isValidEmail(email)) {
      return Toast.show({
        type: 'error',
        text1: 'Помилка',
        text2: 'Невірний формат email!',
      });
    }

    if (!isValidPassword(password)) {
      return Toast.show({
        type: 'error',
        text1: 'Помилка',
        text2: 'Пароль має містити щонайменше 6 символів!',
      });
    }

    const registerData = {
      name,
      email,
      password,
    };

    dispatch(register(registerData))
      .unwrap()
      .then(() => {
        navigation.navigate(AppPath.Home);
      })
      .catch((error) => {
        const message = error.message || i18n.t('errors.loginFailed');
        Toast.show({
          type: 'error',
          text1: 'Невдача',
          text2: message,
        });
      });
  };
  return (
    <ThemeBackground style={styles.container}>
      <Toast />
      <ThemeText style={styles.title}>
        {i18n.t('registerScreen.title')}
      </ThemeText>

      <TextInput
        style={styles.input}
        placeholder={i18n.t('registerScreen.namePlaceholder')}
        placeholderTextColor="#ccc"
        keyboardType="default"
        autoCapitalize="none"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder={i18n.t('registerScreen.emailPlaceholder')}
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('loginScreen.passwordPlaceholder')}
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
            name={notShowPassword ? 'eye' : 'eye-with-line'}
            size={20}
            color="#333"
          />
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder={i18n.t('registerScreen.confirmPasswordPlaceholder')}
        placeholderTextColor="#ccc"
        secureTextEntry={notShowPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <PressableButton
        text={i18n.t('registerScreen.signUpButton')}
        buttonStyle={styles.button}
        onPress={handleSubmit}
      />

      <Pressable onPress={() => navigation.navigate(AppPath.Login)}>
        <Text style={{ color: colors.highlightColor }}>
          {i18n.t('registerScreen.switchText')}
        </Text>
      </Pressable>
    </ThemeBackground>
  );
};

export default RegisterScreen;
