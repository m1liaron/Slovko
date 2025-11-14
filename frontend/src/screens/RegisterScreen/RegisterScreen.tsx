import { useAppDispatch } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import ThemeText from '../../common/components/ThemeText/ThemeText';
import { AppPath } from '../../common/enums/app/app';
import { register } from '../../redux/userReducer/userSlice';
import { isValidEmail, isValidPassword } from '@/utils';
import { useAppTheme } from '@/contexts/ThemeProvider';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import styles from '../LoginScreen/LoginScreen.styles';

const RegisterScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useAppDispatch();
  const {
    theme: { colors },
  } = useAppTheme();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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
    <ThemeBackground>
      <Toast />
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
            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.highlightColor}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('registerScreen.namePlaceholder')}
                placeholderTextColor="#ccc"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>

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
                style={styles.input}
                placeholder={i18n.t('registerScreen.emailPlaceholder')}
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
                style={styles.input}
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

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.highlightColor}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder={i18n.t(
                  'registerScreen.confirmPasswordPlaceholder',
                )}
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Entypo
                  name={showConfirmPassword ? 'eye' : 'eye-with-line'}
                  size={20}
                  color="#666"
                />
              </Pressable>
            </View>

            {/* Sign Up Button */}
            <PressableButton
              text={i18n.t('registerScreen.signUpButton')}
              buttonStyle={styles.signUpButton}
              onPress={handleSubmit}
            />

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
              onPress={() => navigation.navigate(AppPath.Main)}
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
              {i18n.t('registerScreen.switchText')}{' '}
            </ThemeText>
            <Pressable onPress={() => navigation.navigate(AppPath.Login)}>
              <ThemeText
                style={[styles.footerLink, { color: colors.highlightColor }]}
              >
                {i18n.t('loginScreen.loginButton')}
              </ThemeText>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemeBackground>
  );
};

export default RegisterScreen;
