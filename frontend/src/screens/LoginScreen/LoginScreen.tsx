import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'moti';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import PressableButton from '@/common/components/PressableButton/PressableButton';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { isValidEmail, isValidPassword } from '@/utils';
import { initToken } from '@/utils/storage/initToken';

import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import ThemeText from '../../common/components/ThemeText/ThemeText';
import { AppPath } from '../../common/enums/app/app';
import { login } from '../../redux/userReducer/userSlice';

import styles from './LoginScreen.styles';
import Loading from '@/components/Loading';

const LoginScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useAppDispatch();
  const {
    theme: { colors },
  } = useAppTheme();
  const { isLoading } = useAppSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
        initToken();
        navigation.navigate(AppPath.HomeNavigation);
      })
      .catch((error) => {
        const message = error.message || i18n.t('errors.loginFailed');
        Toast.show({
          type: 'error',
          text1: 'Невдача',
          text2: message,
        });
        console.log(error);
      });
  };

  return (
    <ThemeBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { width: screenWidth < 720 ? 'auto' : '40%' },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={styles.header}
          >
            <View>
              <LinearGradient
                colors={[colors.highlightColor, colors.highlightDarkColor]}
                style={styles.iconGradient}
              >
                <Ionicons name="person-add" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <ThemeText style={styles.title}>
              {i18n.t('registerScreen.title')}
            </ThemeText>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            style={styles.formContainer}
          >
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.highlightColor}
                />
              </View>
              <TextInput
                style={[styles.input, { color: colors.primary }]}
                placeholder={i18n.t('loginScreen.emailPlaceholder')}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.highlightColor}
                />
              </View>
              <TextInput
                style={[styles.input, { color: colors.primary }]}
                placeholder={i18n.t('loginScreen.passwordPlaceholder')}
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Entypo
                  name={showPassword ? 'eye' : 'eye-with-line'}
                  size={20}
                  color="#666"
                />
              </Pressable>
            </View>

            {/* Sign In Button */}
            {isLoading ? (
              <Loading />
            ) : (
              <PressableButton
                text={i18n.t('loginScreen.loginButton')}
                buttonStyle={styles.signUpButton}
                onPress={handleSubmit}
              />
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: colors.lightBackground },
                ]}
              />
              <Text style={styles.dividerText}>або</Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: colors.lightBackground },
                ]}
              />
            </View>

            {/* Continue Without Account */}
            <Pressable
              onPress={() => navigation.navigate(AppPath.HomeNavigation)}
              style={[
                styles.guestButton,
                {
                  backgroundColor: colors.lightBackground,
                  borderColor: colors.lightText,
                },
              ]}
            >
              <ThemeText>
                {i18n.t('registerScreen.signWithoutButton')}
              </ThemeText>
            </Pressable>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.footer}
          >
            <ThemeText style={styles.footerText}>
              {i18n.t('loginScreen.switchText')}{' '}
            </ThemeText>
            <Pressable onPress={() => navigation.navigate(AppPath.Register)}>
              <ThemeText
                style={[styles.footerLink, { color: colors.highlightColor }]}
              >
                {i18n.t('loginScreen.register')}
              </ThemeText>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemeBackground>
  );
};

export default LoginScreen;
