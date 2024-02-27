import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Button,
    TextInput, Pressable, Alert,
} from 'react-native';
import CardItem from './CardItem';
import {addCard, removeCard, selectCard} from "../redux/cardSlice";
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuid } from 'uuid';
import { useNavigation } from "@react-navigation/native";

const CardList = () => {
    const cardData = useSelector(selectCard);
    const [value, setValue] = useState('');
    const [translate, setTranslate] = useState('');
    const navigation = useNavigation()

    const dispatch = useDispatch();

    const onSaveCard = () => {
        if(value.length > 0 && translate.length > 0) {
            const data = {
                title: value,
                translate: translate,
                id: uuid()
            }
            dispatch(addCard(data));
            setValue('');
            setTranslate('');
        }
    };

    const onRemoveCard = (index) => {
        dispatch(removeCard(index))
    };

    const navigateToStudy = () => {
        if(cardData.length > 1) {
            navigation.navigate('study')
        } else {
            Alert.alert('Додайте як найменше 2 картки');
        }
    }


    return (
        <View style={styles.container}>
            <Pressable onPress={navigateToStudy}>
                <Text>Вчити</Text>
            </Pressable>
            <Text style={styles.title}>Англійською</Text>
            <TextInput
                value={value}
                onChangeText={(text) => setValue(text)}
                style={styles.input}
            />

            <Text style={styles.title}>Українською</Text>
            <TextInput
                value={translate}
                onChangeText={(text) => setTranslate(text)}
                style={styles.input}
            />
            <Button title='Додати' onPress={onSaveCard} style={styles.button} />

            <FlatList
                data={cardData}
                renderItem={({ item, index }) => (
                    <CardItem item={item} onRemove={() => onRemoveCard(item.id)} />
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: 5,
        padding: 10,
    },
});

export default CardList;