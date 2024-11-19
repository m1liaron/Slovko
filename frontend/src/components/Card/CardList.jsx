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
import { addCard, getCards, removeCard, selectCard } from '../../redux/cardReducer/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppPath } from "../../common/enums/app/app";
import noCardsImage from '../../assets/images/no-cards.png';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import AddInput from "../../common/components/AddInput/AddInput";
import AddButton from "../../common/components/AddButton/AddButton";
import DefaultModal from "../DefaultModal/DefaultModal";
import pickImage from "../../utils/pickImage";
import Loading from "../Loading";

const CardList = ({ groupId }) => {
    const { cards, isLoading } = useSelector(state => state.cards);
    const [value, setValue] = useState('');
    const [answerWord, setAnswerWord] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCards({ groupId }));
    }, [dispatch, groupId]);

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

    const onSaveCard = async () => {
        let finalImageUri = imageUri;

        if (Platform.OS === 'web' && imageUri.startsWith('blob:')) {
            try {
                finalImageUri = await convertBlobToBase64(imageUri);
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

    return (
        <View style={styles.container}>
            {isLoading && <Loading/>}
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
                <View style={{ marginHorizontal: 20 }}>
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

                    <PressableButton text="Pick an image from camera roll" onPress={() => pickImage(imageUri, setImageUri)} />
                    {imageUri !== '' && <Image source={{ uri: imageUri }} style={styles.image} />}

                    <PressableButton onPress={onSaveCard} text="Додати" />
                </View>
            </DefaultModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        marginHorizontal: 30,
        gap: 10
    }
});

export default CardList;
