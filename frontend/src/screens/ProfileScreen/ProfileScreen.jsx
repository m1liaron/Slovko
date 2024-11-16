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
import {updateUser} from "../../redux/userReducer/userThunk";
import pickImage from "../../utils/pickImage";

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

    const convertBlobToBase64 = (blobUri) => {
        return new Promise((resolve, reject) => {
            fetch(blobUri)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
                    reader.readAsDataURL(blob);
                })
                .catch(error => reject(error));
        });
    };

    const convertImageToBase64 = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1]; // Get the Base64 part
                resolve(base64data);
            };
            reader.onerror = () => reject(new Error('Failed to convert image to base64'));
            reader.readAsDataURL(blob);
        });
    };

    const handleUpdateUser = async () => {
        let finalImageUri = image;

        if (Platform.OS === 'web' && image.startsWith('blob:')) {
            try {
                finalImageUri = await convertBlobToBase64(image);
            } catch (error) {
                console.error('Error converting blob to base64:', error);
                return;
            }
        } else if (finalImageUri) {
            try {
                const base64Image = await convertImageToBase64(finalImageUri);
                finalImageUri = base64Image;
            } catch (error) {
                console.error('Error converting image to base64:', error);
                return;
            }
        }

        const data = {
            image: finalImageUri,
            name: userName,
            email: userEmail,
        };
        dispatch(updateUser({data, id: user.id}));
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
                            {!isEditing ? (
                                <View
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center'
                                    }}
                                >
                                    <Image
                                        style={styles.avatarPhoto}
                                        source={image ? { uri: image } : user.image}
                                    />
                                </View>
                            ) : (
                                <Pressable
                                   onPress={() => pickImage(image, setImage)}
                                   style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}>
                                    <Image
                                        style={styles.avatarPhoto}
                                        source={image ? { uri: image } : user.image}
                                    />
                                </Pressable>
                            )}
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