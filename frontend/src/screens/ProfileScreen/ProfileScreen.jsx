import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Platform,
    Alert,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {logout, selectUser} from '../../redux/userReducer/userSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import {useAppTheme} from "../../contexts/ThemeProvider";
import {Switch} from "react-native-gesture-handler";
import {Feather} from "@expo/vector-icons";
import styles from './ProfileScreen.styles';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import AvatarImage from '../../../assets/images/avatar.png'

export default function ProfileScreen() {
    const { user } = useSelector(selectUser);
    const { theme, toggleTheme } = useAppTheme();
    const colors = theme.colors;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [image, setImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [isThemeDark, setThemeDark] = useState(theme.dark === true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setUserName(user.name);
            setUserEmail(user.email);
        }
    }, [user]);

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const answer = confirm('Are you sure you want to log out?');
            if (answer) {
                dispatch(logout());
            }
        } else {
            Alert.alert(
                'Confirm Logout',
                'Are you sure you want to log out?',
                [
                    { text: 'Cancel', onPress: () => {} },
                    {
                        text: 'Logout',
                        onPress: async () => {
                            await AsyncStorage.removeItem('token');
                            navigation.navigate('login');
                        },
                    },
                ],
                { cancelable: true }, // Allow dismissing the alert by tapping outside
            );
        }
    };

    const uploadImage = async (mode) => {
        try {
            let result = {};

            if (mode === 'gallery') {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.getMediaLibraryPermissionsAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            }

            if (!result.canceled) {
                await onSaveImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error(error);
            setModalVisible(false);
        }
    };

    const onSaveImage = async (image) => {
        try {
            setImage(image);
            setModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    const removeImage = async () => {
        try {
            onSaveImage(null);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleUpdateUser = () => {
        const data = {
            name: userName,
            email: userEmail,
        };
        dispatch(updateUser({ data, id: user._id }));
        setIsEditing(false);
    };

    const onEditInfo = () => {
        setIsEditing(!isEditing);
    };

    const changeTheme = () => {
        setThemeDark(!isThemeDark);
        toggleTheme();
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.primary }]}>Ваш профіль</Text>

                <View style={styles.container}>
                    {user ? (
                        <View>
                            <Pressable onPress={uploadImage} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}>
                                <Image
                                    style={styles.avatarPhoto}
                                    source={image ? { uri: image } : AvatarImage}
                                />
                            </Pressable>
                            {!isEditing && <Text style={[styles.title, { color: colors.primary }]}>{user.name}</Text> }
                            <Pressable onPress={onEditInfo}>
                                <Text style={styles.editTitle}>Редагувати</Text>
                            </Pressable>
                            {!isEditing && <Text style={[styles.textInfo, { color: colors.primary } ]}>Особиста інформація</Text> }
                            {isEditing && (
                                <View>
                                    <Text style={styles.keyName}>Ім'я</Text>
                                    <View style={[styles.editInputContainer, { backgroundColor: colors.lightBackground}]}>
                                        <MaterialIcons
                                            name="supervised-user-circle"
                                            size={35}
                                            color={colors.iconColor}
                                        />
                                        <TextInput
                                            style={[styles.textInputStyle, { textDecorationStyle: colors.primary, color: colors.primary }]}
                                            value={userName}
                                            onChangeText={(text) => setUserName(text)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!isEditing ? (
                                <>
                                    <View style={[styles.infoItem, { backgroundColor: colors.lightBackground }]}>
                                        <View style={styles.flex}>
                                            <MaterialIcons name="email" size={35} color={colors.iconColor} />
                                            <Text style={[styles.keyName, { color: colors.primary}]}>Пошта</Text>
                                        </View>
                                        <Text style={[styles.userInfoText, { color: colors.primary}]}>{user.email}</Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.keyName}>Пошта</Text>
                                    <View style={[styles.editInputContainer, { backgroundColor: colors.lightBackground} ]}>
                                        <MaterialIcons name="email" size={35} color={colors.iconColor} />
                                        <TextInput
                                            style={[styles.textInputStyle, { textDecorationStyle: colors.primary, color: colors.primary }]}
                                            value={userEmail}
                                            onChangeText={(text) => setUserEmail(text)}
                                        />
                                    </View>
                                </>
                            )}

                            {!isEditing ? (
                                <View>
                                    <Text style={[styles.textInfo, { color: colors.primary }]}>Взаємодія</Text>
                                    <Pressable
                                        style={[styles.infoItem, { backgroundColor: colors.lightBackground }]}
                                        onPress={handleLogout}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                        >
                                            <MaterialIcons
                                                name="exit-to-app"
                                                size={35}
                                                color={colors.iconColor}
                                            />
                                            <Text style={[styles.keyName, { color: colors.primary }]}>Вийти з акаунту</Text>
                                        </View>
                                        <AntDesign name="arrowright" size={35} color={colors.iconColor} />
                                    </Pressable>

                                    <View
                                        style={[styles.infoItem, { backgroundColor: colors.lightBackground }]}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                        >
                                            {isThemeDark ?
                                                <Feather name="moon"  size={35} color={colors.iconColor} />
                                                        :
                                                <Feather name="sun" size={35} color={colors.iconColor} />
                                            }
                                            <Text style={[styles.keyName, { color: colors.primary }]}>Змінити тему</Text>
                                        </View>
                                        <Switch
                                            value={isThemeDark}
                                            onValueChange={changeTheme}
                                            trackColor={{
                                                false: colors.background,
                                                true: colors.primary,
                                            }}
                                            thumbColor={isThemeDark ? colors.primary : colors.lightBackground}
                                            ios_backgroundColor={colors.lightBackground}
                                            style={{
                                                transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                                            }}
                                        />
                                    </View>
                                </View>
                            ) : <PressableButton text="Зберегти зміни" onPress={handleUpdateUser}/>}
                        </View>
                    ) : (
                        <View>
                            <Text style={{ color: colors.primary }}>Немає інформації про данного користувача, перезайдіть у застосунок або в акаунт.</Text>
                        </View>
                    )}
                </View>
        </SafeAreaView>
    );
}