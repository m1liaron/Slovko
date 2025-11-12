import { useAppDispatch } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={styles.header}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={[colors.highlightColor, colors.highlightDarkColor]}
                style={styles.iconGradient}
              >
                <Ionicons name="person-add" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>{i18n.t('registerScreen.title')}</Text>
            <Text style={styles.subtitle}>
              Create your account to get started
            </Text>
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
                placeholderTextColor="#999"
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
            <Text style={styles.footerText}>
              {i18n.t('registerScreen.switchText')}{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate(AppPath.Login)}>
              <Text
                style={[styles.footerLink, { color: colors.highlightColor }]}
              >
                {i18n.t('loginScreen.loginButton')}
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemeBackground>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    marginBottom: 5,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  inputIconContainer: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 56,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 20,
    height: 56,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  guestButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    color: '#ccc',
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
