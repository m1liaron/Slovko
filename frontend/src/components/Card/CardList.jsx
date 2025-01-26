import React, {memo, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Platform, Pressable
} from 'react-native';
import CardItem from './CardItem';
import {addCard, getCards, rangeCards, removeCard, resetFilter} from '../../redux/cardReducer/cardSlice';
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
import {useAppTheme} from "../../contexts/ThemeProvider";
import Fontisto from "react-native-vector-icons/Fontisto";
import Slider from '@react-native-community/slider';
import {Entypo} from "@expo/vector-icons";

const MemoCardItem = memo(CardItem);

const CardList = ({ groupId }) => {
    const { theme: { colors }} = useAppTheme();
    const { group } = useSelector(state => state.groups);
    const { cards, filteredCards, isLoading } = useSelector(state => state.cards);

    const [addCardMode, setAddCardMode] = useState(0);
    const [valueWords, setValueWords] = useState({});
    const [value, setValue] = useState('');
    const [answerWord, setAnswerWord] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [jsonOutput, setJsonOutput] = useState(null);
    const [wordsRangeNumber, setWordsRangeNumber] = useState(cards.length || 2);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;

            const lines = fileContent.split('\n');
            const jsonObject = {};

            lines.forEach((line, index) => {
                const [key, value] = line.split(':');
                if (key && value) {
                    jsonObject[key.trim()] = value.trim();
                } else {
                    console.warn(`Line ${index + 1} is not in the correct format: "${line}"`);
                }
            });

            setJsonOutput(jsonObject);
            setValueWords(jsonObject)
        }

        reader.readAsText(file);
    }

    useEffect(() => {
        if(group.id !== groupId) {
            dispatch(getCards({ groupId }));
        }
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

        function validateWord (word) {
            const cleanedWord = word.replace(/[^A-Za-z0-9\s]/g, '');
            const formattedWord = cleanedWord
                .split(' ')
                .filter(Boolean) // Remove any extra spaces
                .map(subWord => subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase())
                .join(' ');
    
            return formattedWord
        }

        const validatedAnswer = validateWord(answerWord) || answerWord;

        if(Object.keys(valueWords).length > 0) {
            Object.entries(valueWords).forEach(([key, value]) => {
                dispatch(addCard({
                    word: validateWord(key),
                    translateWord: value,
                    imageUri: '',
                    groupId
                }))
            });
            setValueWords({});
            alert('Cards added from file successfully!');
            return;
        }

        if(value && answerWord) {
            const cardData = {
                word: validateWord(value),
                translateWord: validatedAnswer,
                imageUri: finalImageUri || '',
                groupId
            };

            dispatch(addCard(cardData));
            setValue('');
            setAnswerWord('');
            setImageUri('');
        }
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

    const navigateToLearn = () => {
        if(wordsRangeNumber !== cards.length) {
            dispatch(rangeCards(wordsRangeNumber));
        }
        navigateTo(AppPath.Learn)
    }

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
                            <MemoCardItem item={item} onRemove={() => onRemoveCard(item.id)} groupId={groupId} />
                        )}
                        horizontal={true}
                        keyExtractor={(item) => item.id}
                        style={styles.listContainer}
                    />
                </View>
            )}

            {cards.length > 1 && (
                <View style={{ marginHorizontal: 20 }}>
                    <PressableButton onPress={navigateToLearn} text="Вчитися" />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Slider
                            style={{width: 200, height: 40}}
                            minimumValue={2}
                            maximumValue={cards.length}
                            value={wordsRangeNumber}
                            onValueChange={setWordsRangeNumber}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                        />
                        <Text style={{ color: colors.primary }}>{Math.floor(wordsRangeNumber)}</Text>
                        {filteredCards.length > cards.length && (
                            <Pressable
                                style={{
                                    padding: 5,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#bcbcbc',
                                    marginHorizontal: 10,
                                }}
                                onPress={() => dispatch(resetFilter())}
                            >
                                <Entypo name="back-in-time" size={30} color="#bcbcbc" />
                            </Pressable>
                        )}
                    </View>
                </View>
            )}
            <AddButton onPress={() => setShowAddModal(true)} />

            <DefaultModal
                isVisible={showAddModal}
                handleClose={() => setShowAddModal(false)}
            >
                <View style={styles.formContainer}>
                    <Text style={[styles.title, { color: colors.primary }]}>Додайте Карточку!</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                        <PressableButton text="Одна" onPress={() => setAddCardMode(0)} buttonStyle={{ flex: 1, backgroundColor: addCardMode === 0 ? "#002044" : "#007AFF"}}/>
                        <PressableButton text="Багато" onPress={() => setAddCardMode(1)} buttonStyle={{ flex: 1, backgroundColor: addCardMode === 1 ? "#002044" : "#007AFF"}}/>
                    </View>

                    {addCardMode ? (
                        <View style={styles.bulkAddContainer}>
                            {Platform.OS === 'web' && (
                                <View style={styles.fileInputContainer}>
                                    <Fontisto name="import" size={30} color={colors.background} />
                                    <input
                                        type="file"
                                        accept=".txt"
                                        onChange={handleFileChange}
                                        style={styles.fileInput}
                                    />
                                </View>
                            )}
                            {jsonOutput && (
                                <View style={styles.jsonTableContainer}>
                                    <View style={styles.jsonTable}>
                                        <Text style={styles.jsonTableTitle}>Дані:</Text>
                                        {Object.entries(jsonOutput).map(([key, value], index) => (
                                            <View key={index} style={styles.jsonRow}>
                                                <Text style={styles.jsonKey}>{key}</Text>
                                                <Text style={styles.jsonValue}>{value}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View>
                            <PressableButton text="Виберіть зображення з галереї" onPress={() => pickImage(imageUri, setImageUri)}/>
                            {imageUri !== '' && <Image source={{ uri: imageUri }} style={styles.image} />}

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
                        </View>
                    )}

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
    },
    modeToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    bulkAddContainer: {
        paddingVertical: 10,
    },
    fileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    fileInput: {
        marginLeft: 10,
        fontSize: 16,
    },
    jsonTableContainer: {
        marginTop: 10,
    },
    jsonTableTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    jsonTable: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
        height: 400,
        overflow: 'auto'
    },
    jsonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    jsonKey: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },
    jsonValue: {
        fontSize: 16,
        flex: 1,
        textAlign: 'right',
    },
    singleAddContainer: {
        marginTop: 10,
    },
    inputField: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginVertical: 10,
    },
    saveButton: {
        marginTop: 20,
    },
});

export default CardList;
