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
import {addCard, fetchCards, removeCard, selectCard} from '../redux/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { useNavigation } from '@react-navigation/native';
import useFetch from "../hooks/useFetch";
import axios from "axios";
import Toast from "react-native-toast-message";
import BottomSheetComponent from "./BottomSheetComponent";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CardList = () => {
    const cardData = useSelector(selectCard);
    const [value, setValue] = useState('');
    const navigation = useNavigation();

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchCards())
    }, [])

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2:'Description'
        });
    }

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
        if (cardData.length > 1) {
            navigation.navigate(name);
        } else {
            Alert.alert('Додайте як найменше 2 картки');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Англійською</Text>
                <Toast
                    position='top'
                    style={{ borderLeftColor: 'pink' }}
                    text1Style={{
                        fontSize: 15,
                        fontWeight: '400'
                    }}
                />
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

            <Pressable onPress={showToast}>
                <Text>Show Toast</Text>
            </Pressable>

            <FlatList
                data={cardData}
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
        alignItems:'center'
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
