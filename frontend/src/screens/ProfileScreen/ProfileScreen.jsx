import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Platform,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { user } = useSelector(selectUser);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [image, setImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setUserName(user.name);
            setUserEmail(user.email);
        }
    }, [user]);

    const logout = async () => {
        if (Platform.OS === 'web') {
            const answer = confirm('Are you sure you want to log out?');
            if (answer) {
                AsyncStorage.removeItem('token');
                navigation.navigate('login');
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Ваш профіль</Text>

                <View style={styles.container}>
                    {user ? (
                        <View>
                            {!isEditing ? (
                                    <Text style={styles.title}>{user.name}</Text>
                            ) : null}
                            <Pressable onPress={onEditInfo}>
                                <Text style={styles.editTitle}>Редагувати</Text>
                            </Pressable>
                            {!isEditing ? (
                                <Text style={styles.textInfo}>Особиста інформація</Text>
                            ) : null}
                            {isEditing ? (
                                <View>
                                    <Text style={styles.keyName}>Ім'я</Text>
                                    <View style={styles.editInputContainer}>
                                        <MaterialIcons
                                            name="supervised-user-circle"
                                            size={35}
                                            color="#000"
                                        />
                                        <TextInput
                                            style={styles.textInputStyle}
                                            value={userName}
                                            onChangeText={(text) => setUserName(text)}
                                        />
                                    </View>
                                </View>
                            ) : null}

                            {!isEditing ? (
                                <View style={styles.infoList}>
                                    <View style={styles.infoItem}>
                                        <View style={styles.flex}>
                                            <MaterialIcons name="email" size={35} color="#000" />
                                            <Text style={styles.keyName}>Пошта</Text>
                                        </View>
                                        <Text style={styles.userInfoText}>{user.email}</Text>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.keyName}>Пошта</Text>
                                    <View style={styles.editInputContainer}>
                                        <MaterialIcons name="email" size={35} color="#000" />
                                        <TextInput
                                            style={styles.textInputStyle}
                                            value={userEmail}
                                            onChangeText={(text) => setUserEmail(text)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!isEditing ? (
                                <View style={styles.infoList}>
                                    <Text style={styles.textInfo}>Utilities</Text>
                                    <Pressable
                                        style={[styles.infoItem, { backgroundColor: '#dcdcdc' }]}
                                        onPress={() => logout()}
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
                                                color="#000"
                                            />
                                            <Text style={styles.keyName}>Вийти з акаунту</Text>
                                        </View>
                                        <AntDesign name="arrowright" size={35} color="#000" />
                                    </Pressable>
                                </View>
                            ) : (
                                <View>
                                    <Pressable
                                        style={styles.saveButton}
                                        onPress={handleUpdateUser}
                                    >
                                        <Text>Зберегти зміни</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    ) : null}
                </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    avatarPhoto: {
        borderRadius: 100,
        height: 200,
        marginRight: 8,
        width: 200,
    },
    container: {
        justifyContent: 'center',
        padding: 10,
    },
    editInputContainer: {
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        borderRadius: 20,
        flexDirection: 'row',
        gap: 10,
        padding: 15,
    },
    editTitle: {
        color: '#828282',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    flex: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    infoItem: {
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    infoList: {},
    keyName: {
        color: '#828282',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#d2d2d2',
        borderRadius: 10,
        padding: 10,
        textAlign: 'center',
    },
    textContainer: {},
    textInfo: {
        alignItems: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        textAlign: 'left',
    },
    textInputStyle: {
        textDecorationColor: '#000',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
    userInfo: {
        alignItems: 'center',
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align to the right
    },
    userInfoText: {
        fontSize: 17,
    },
});