import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image
} from 'react-native';
import CardItem from './CardItem';
import {addCard, getCards, removeCard, selectCard} from '../../redux/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast, {ErrorToast, BaseToast} from "react-native-toast-message";
import {AppPath} from "../../common/app/app";
import noCardsImage from '../../assets/images/no-cards.png';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import AddInput from "../../common/components/AddInput/AddInput";

const CardList = ({groupId}) => {
    const cards = useSelector(selectCard);
    const [value, setValue] = useState('');
    const [answerWord, setAnswerWord] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCards({groupId}));
    }, [dispatch])


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
        navigation.navigate(name, {groupId});
    };

    return (
        <View style={styles.container}>
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

                <PressableButton onPress={onSaveCard} text="Додати"/>
            </View>

            {!cards.length ? (
                <View style={{
                    justifyContent:'center',
                    alignItems: 'center'
                }}>
                    <Image source={noCardsImage} />
                </View>
            ) : (
                <View>
                    <FlatList
                        data={cards}
                        renderItem={({ item, index }) => (
                            <CardItem item={item} onRemove={() => onRemoveCard(item.id)} groupId={groupId} />
                        )}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.listContainer}
                    />
                </View>
            )}

            {cards.length > 1 && (
                <View style={{ marginVertical: 20}}>
                        <PressableButton onPress={() => navigateTo(AppPath.Learn)} text="Вчитися"/>
                </View>
            )}
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
    flex:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        flexWrap:'wrap'
    },
    listContainer:{
        gap: 10
    }
});

export default CardList;
