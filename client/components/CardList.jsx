import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Button,
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

const CardList = () => {
    const cardData = useSelector(selectCard);
    const [value, setValue] = useState('');
    const [translate, setTranslate] = useState('');
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const {loading, error, request} = useFetch

    useEffect(() => {
        dispatch(fetchCards())
    }, [])

    console.log(cardData.cards)
    const onSaveCard = async () => {
            const cardData = {
                word: value,
                language: 'uk',
                id: uuid(),
            };

    try{
        await  axios.post('http://localhost:8000/add_card', cardData)
            .then(response => {
                console.log(response)
                dispatch(addCard(response.data));
                setValue('');
                setTranslate('');
            })
            } catch (error1){
                console.log(error)
            }
    };

    const onRemoveCard = async (index, word) => {
        try{
            await  axios.delete(`http://localhost:8000/card/${word}`)
                .then(response => {
                    console.log(response)
                    dispatch(removeCard(index));
                    setValue('');
                    setTranslate('');
                })
        } catch (error1){
            console.log(error)
        }
    };

    const navigateTo = (name) => {
        if (cardData.cards.length > 1) {
            navigation.navigate(name);
        } else {
            Alert.alert('Додайте як найменше 2 картки');
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Англійською</Text>
                <TextInput
                    value={value}
                    onChangeText={(text) => setValue(text)}
                    style={styles.input}
                    placeholder="Введіть англійське слово"
                />

                <Text style={styles.title}>Українською</Text>
                <TextInput
                    value={translate}
                    onChangeText={(text) => setTranslate(text)}
                    style={styles.input}
                    placeholder="Введіть переклад"
                />
                <Pressable onPress={onSaveCard} style={styles.button}>
                    <Text style={styles.buttonText}>Додати</Text>
                </Pressable>
            </View>

            <FlatList
                data={cardData.cards}
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

                <Pressable onPress={() => navigateTo('sentence')} style={styles.button}>
                    <Text style={styles.buttonText}>Речення</Text>
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
