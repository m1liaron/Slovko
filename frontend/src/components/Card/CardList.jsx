import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Pressable,
    Alert,
} from 'react-native';
import CardItem from './CardItem';
import {addCard, getCards, removeCard, selectCard} from '../../redux/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import Toast, {ErrorToast, BaseToast} from "react-native-toast-message";
import BottomSheetComponent from "../BottomSheetComponent";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {AppPath} from "../../common/app/app";

const CardList = ({groupId}) => {
    const cards = useSelector(selectCard);
    const [value, setValue] = useState('');
    const [answerWord, setAnswerWord] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCards({groupId}));
    }, [dispatch])


    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: 'pink' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400'
                }}
            />
        ),
        error: (props) => (
            <ErrorToast
                {...props}
                text1={'Не можна!'}
                text2={'Створіть як найменше 2 картки щоб їх вчити'}
                text1Style={{
                    fontSize: 17
                }}
                text2Style={{
                    fontSize: 12
                }}
            />
        ),
        tomatoToast: ({ text1, props }) => (
            <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
                <Text>{text1}</Text>
                <Text>{props.uuid}</Text>
            </View>
        )
    };

    const onSaveCard = async () => {
            const cardData = {
                word: value,
                translateWord: answerWord,
                groupId
            };

        dispatch(addCard(cardData));
        setValue('');
        setAnswerWord('');
    };

    const onRemoveCard = async (courseId) => {
        dispatch(removeCard(courseId));
    };

    const navigateTo = (name) => {
        if (cards.length > 1) {
            navigation.navigate(name, {groupId});
        } else {
            Toast.show({
                type: 'error'
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Англійською</Text>
                <Toast config={toastConfig}/>
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    style={styles.input}
                    placeholder="Word..."
                />

                <TextInput
                    value={answerWord}
                    onChangeText={setAnswerWord}
                    style={styles.input}
                    placeholder="Answer..."
                />

                <Pressable onPress={onSaveCard} style={styles.button}>
                    <Text style={styles.buttonText}>Додати</Text>
                </Pressable>
            </View>

            {/*<Pressable onPress={showToast}>*/}
            {/*    <Text>Show Toast</Text>*/}
            {/*</Pressable>*/}

            <View>
                <FlatList
                    data={cards}
                    renderItem={({ item, index }) => (
                        <CardItem item={item} onRemove={() => onRemoveCard(item.id)} />
                    )}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listContainer}
                />
            </View>

            <View style={styles.formContainer}>
            <View style={styles.flex}>
                <Pressable onPress={() => navigateTo(AppPath.Learn)} style={styles.button}>
                    <Text style={styles.buttonText}>Вчитися</Text>
                </Pressable>
            </View>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer:{
      padding:20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
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
    flex:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        flexWrap:'wrap'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer:{
        gap: 10
    }
});

export default CardList;
