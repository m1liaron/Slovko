import React, { useState} from 'react';
import {View, Text, StyleSheet, Pressable, Dimensions, TextInput, Image} from 'react-native';
import { Entypo  } from '@expo/vector-icons';
import DefaultModal from "../DefaultModal/DefaultModal";
import Toast from "react-native-toast-message";
import {useDispatch} from "react-redux";
import {updateCard} from "../../redux/cardSlice";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import pickImage from "../../utils/pickImage";
import { useAppTheme } from '../../contexts/ThemeProvider';

const CardItem = ({ item, onRemove, groupId }) => {
    const { theme: { colors }} = useAppTheme();
    const [showEditModal, setShowEditModal] = useState(false);
    const [title, setTitle] = useState('');
    const [translate, setTranslate] = useState('');
    const [imageUri, setImageUri] = useState('');

    const dispatch = useDispatch();

    const formatReviewTime = (reviewTime) => {
        const now = new Date();
        const timeDifference = new Date(reviewTime) - now; // Now it's future time, so we subtract now from reviewTime

        const oneDay = 24 * 60 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;
        const oneMinute = 60 * 1000;

        if (timeDifference <= 0) {
            return 'Час повтору пройшов'; // If review time has passed
        }

        if (timeDifference < oneHour) {
            const minutes = Math.ceil(timeDifference / oneMinute); // Use ceil to round up for future times
            return `Через ${minutes} хвилин${minutes === 1 ? 'у' : minutes >= 3 && minutes <= 4 ? 'и' : ''}`;
        } else if (timeDifference < oneDay) {
            const hours = Math.floor(timeDifference / oneHour);
            const minutes = Math.ceil((timeDifference % oneHour) / oneMinute);
            return `Через ${hours} годин${hours === 1 ? 'у' : hours >= 3 ? 'и' : ''} та ${minutes} хвилин${minutes === 1 ? 'у' : minutes >= 3 && minutes <= 4 ? 'и' : ''}`;
        } else {
            const days = Math.floor(timeDifference / oneDay);
            const time = new Date(reviewTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `Через ${days} днів о ${time}`;
        }
    };

    const handleUpdateCard = () => {
        // Check if title and translate are empty
        if (title.trim() === '' || translate.trim() === '') {
            return Toast.show({
                type: 'error',
                text1: 'Error🔴',
                text2: 'Inputs must be filled!',
            });
        }

        // Dispatch the update card action
        dispatch(updateCard({
            id: item.id,
            word: title,
            translateWord: translate,
            imageUri,
            groupId
        }));
        setTitle('');
        setTranslate('');

        // Close the modal after updating
        setShowEditModal(false);
        Toast.show({
            type: 'success',
            text1: 'Success✅',
            text2: 'Card updated successfully!',
        });
    };

    return (
        <View style={[styles.cardContainer, { backgroundColor: colors.lightBackground}]}>
            <View style={styles.titleContainer}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.primary }]}>{item.word}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Entypo name="pencil" onPress={() => setShowEditModal(true)} size={24} color={colors.iconColor} />
                    <Entypo name="cross" onPress={onRemove} size={24} color={colors.iconColor} />
                </View>
            </View>
            <Text style={[styles.translate, { color: colors.primary }]}>Переклад: <Text style={{fontWeight:'bold'}}>{item.translateWord}</Text></Text>

            {
                item.nextReviewAt && <Text style={styles.reviewDate}>Наступний перегляд:
                    <Text style={{ fontWeight: 'bold' }}>{formatReviewTime(item.nextReviewAt)}</Text>
                </Text>
            }

            <View style={{ marginTop: 10 }}>
                {item.image && item.image.url ? (
                    <Image
                        source={{ uri: item.image.url.toString() }}
                        style={{ width: 200, height: 200, borderRadius: 10 }}
                    />
                ) : null}
            </View>

            <DefaultModal
                isVisible={showEditModal}
                handleClose={() => setShowEditModal(false)}
            >
                <View>
                    <Text>Оновити карточку!</Text>
                    <Text>Слово</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View>
                    <Text>Переклад</Text>
                    <TextInput
                        style={styles.input}
                        value={translate}
                        onChangeText={setTranslate}
                    />
                </View>

                <PressableButton text="Виберіть зображення з галереї" onPress={() => pickImage(imageUri, setImageUri)} />
                {imageUri !== '' && <Image source={{ uri: imageUri }} style={styles.image} />}

                <PressableButton text="Змінити" onPress={handleUpdateCard}/>
            </DefaultModal>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor:'#000',
        shadowOpacity: 0.2,
        shadowRadius: 5, // Adjust the radius for iOS
        height: Dimensions.get('window').height - 500,
        marginRight: 30
    },
    titleContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:"center"
    },
    flex:{
      justifyContent:'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    translate: {
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
        width:69
    },
    reviewDate: {
        fontSize: 16,
        marginTop: 10,
        color: '#007bff',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 10,
    },
});

export default CardItem;