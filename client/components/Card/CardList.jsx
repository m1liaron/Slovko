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
import {addCard, fetchCards, removeCard, selectCard} from '../../redux/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import Toast, {ErrorToast, BaseToast} from "react-native-toast-message";
import BottomSheetComponent from "../BottomSheetComponent";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CardList = ({groupId}) => {
    const cardData = useSelector(selectCard);
    const currentCards = cardData.filter(card => card.groupId === groupId);
    const [value, setValue] = useState('');
    const navigation = useNavigation();

    const dispatch = useDispatch();

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
            const token = await AsyncStorage.getItem('token');
            console.log(token);
            const cardData = {
                word: value,
                language: 'uk',
                user: token
            };

        dispatch(addCard(cardData));
        setValue('');
    };

    const onRemoveCard = async (index, word) => {
        try{
            await  axios.delete(`http://192.168.31.196:8000/card/${word}`)
                .then(response => {
                    console.log(response)
                    dispatch(removeCard(index));
                    setValue('');
                })
        } catch (error){
            console.log(error)
        }
    };

    const navigateTo = (name) => {
        if (currentCards.length > 1) {
            navigation.navigate(name);
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
                    onChangeText={(text) => setValue(text)}
                    style={styles.input}
                    placeholder="Введіть англійське слово"
                />

                <Pressable onPress={onSaveCard} style={styles.button}>
                    <Text style={styles.buttonText}>Додати</Text>
                </Pressable>
            </View>

            {/*<Pressable onPress={showToast}>*/}
            {/*    <Text>Show Toast</Text>*/}
            {/*</Pressable>*/}

            <FlatList
                data={currentCards}
                renderItem={({ item, index }) => (
                    <CardItem item={item} onRemove={() => onRemoveCard(index, item.word)} />
                )}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                style={styles.listContainer}
            />
            <View style={styles.formContainer}>
            <View style={styles.flex}>
                <Pressable onPress={() => navigateTo('study')} style={styles.button}>
                    <Text style={styles.buttonText}>Картки</Text>
                </Pressable>

                <Pressable onPress={() => navigateTo('quiz')} style={styles.button}>
                    <Text style={styles.buttonText}>Вікторина</Text>
                </Pressable>

                <Pressable onPress={() => navigateTo('word')} style={styles.button}>
                    <Text style={styles.buttonText}>Слово</Text>
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
