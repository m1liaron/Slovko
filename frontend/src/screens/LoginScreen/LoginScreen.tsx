import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import ThemeText from '../../common/components/ThemeText/ThemeText';
import { AppPath } from '../../common/enums/app/app';
import { login } from '../../redux/userReducer/userSlice';
import styles from './LoginScreen.styles';
import { isValidEmail, isValidPassword } from '@/utils';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import { useAppTheme } from '@/contexts/ThemeProvider';

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useAppDispatch();
  const {
    theme: { colors },
  } = useAppTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleSubmit = async () => {
    if (!email.length || !password.length) {
      return Toast.show({
        type: 'error',
        text1: 'Помилка',
        text2: 'Поля мають бути заповнені!',
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

    dispatch(login({ email, password }))
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
      <ThemeText style={styles.title}>{i18n.t('loginScreen.title')}</ThemeText>
      <TextInput
        style={styles.input}
        placeholder={i18n.t('loginScreen.emailPlaceholder')}
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
          secureTextEntry={isPasswordHidden}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          onPress={() => setIsPasswordHidden(!isPasswordHidden)}
          style={styles.iconContainer}
        >
          <Entypo
            name={isPasswordHidden ? 'eye' : 'eye-with-line'}
            size={20}
            color="#333"
          />
        </Pressable>
      </View>

      <PressableButton
        buttonStyle={styles.button}
        onPress={handleSubmit}
        text={i18n.t('loginScreen.loginButton')}
      />

      <Pressable onPress={() => navigation.navigate(AppPath.Register)}>
        <Text style={{ color: colors.highlightColor }}>
          {i18n.t('loginScreen.switchText')}
        </Text>
      </Pressable>
    </ThemeBackground>
  );
};

export default LoginScreen;
