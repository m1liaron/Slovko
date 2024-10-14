import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Platform
} from 'react-native';
import CardItem from './CardItem';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { addCard, getCards, removeCard, selectCard } from '../../redux/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppPath } from "../../common/app/app";
import noCardsImage from '../../assets/images/no-cards.png';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import AddInput from "../../common/components/AddInput/AddInput";
import AddButton from "../../common/components/AddButton/AddButton";
import DefaultModal from "../DefaultModal/DefaultModal";

const CardList = ({ groupId }) => {
    const cards = useSelector(selectCard);
    const [value, setValue] = useState('');
    const [answerWord, setAnswerWord] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCards({ groupId }));
    }, [dispatch, groupId]);

    const onSaveCard = async () => {
        let finalImageUri = imageUri;

        if (Platform.OS === 'web' && imageUri.startsWith('blob:')) {
            try {
                finalImageUri = await convertBlobToBase64(imageUri);
            } catch (error) {
                console.error('Error converting blob to base64:', error);
                return;
            }
        }

        const cardData = {
            word: value,
            translateWord: answerWord,
            imageUri: finalImageUri,
            groupId
        };

        dispatch(addCard(cardData));
        setValue('');
        setAnswerWord('');
        setImageUri('');
    };

    const onRemoveCard = async (courseId) => {
        dispatch(removeCard(courseId));
    };

    const navigateTo = (name) => {
        navigation.navigate(name, { groupId });
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            const compressedResult = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 800 } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
            );

            if (Platform.OS === 'web') {
                const response = await fetch(compressedResult.uri);
                const blob = await response.blob();
                const imageUri = URL.createObjectURL(blob);
                setImageUri(imageUri);
                console.log('Image processed for web:', imageUri);
            } else {
                const localUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;

                try {
                    await FileSystem.moveAsync({
                        from: compressedResult.uri,
                        to: localUri,
                    });
                    setImageUri(localUri);
                    console.log('Image saved locally at:', localUri);
                } catch (error) {
                    console.error('Error saving image locally:', error);
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            {!cards.length ? (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={noCardsImage} />
                </View>
            ) : (
                <View style={{ marginVertical: 10 }}>
                    <FlatList
                        data={cards}
                        renderItem={({ item }) => (
                            <CardItem item={item} onRemove={() => onRemoveCard(item.id)} groupId={groupId} />
                        )}
                        horizontal={true}
                        keyExtractor={(item) => item.id}
                        style={styles.listContainer}
                    />
                </View>
            )}

            {cards.length > 1 && (
                <View style={{ marginVertical: 20 }}>
                    <PressableButton onPress={() => navigateTo(AppPath.Learn)} text="Вчитися" />
                </View>
            )}
            <AddButton onPress={() => setShowAddModal(true)} />

            <DefaultModal
                isVisible={showAddModal}
                handleClose={() => setShowAddModal(false)}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Додайте Карточку!</Text>
                    <AddInput
                        value={value}
                        onChangeText={setValue}
                        style={styles.input}
                        placeholder="Слово..."
                    />

                    <AddInput
                        value={answerWord}
                        onChangeText={setAnswerWord}
                        style={styles.input}
                        placeholder="Відповідь..."
                    />

                    <PressableButton text="Pick an image from camera roll" onPress={pickImage} />
                    {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

                    <PressableButton onPress={onSaveCard} text="Додати" />
                </View>
            </DefaultModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 10,
    },
    listContainer: {
        gap: 10
    }
});

export default CardList;
