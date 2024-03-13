import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import {addUser, selectUser} from "../redux/userSlice";
import {useDispatch, useSelector} from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const GreetingScreen = () => {
    const user = useSelector(selectUser);
    const [name, setName] = useState('');

    const navigation = useNavigation()
    const dispatch = useDispatch();

    const handlePress = async () => {
        if(name.length > 0){
            try{
                AsyncStorage.setItem('token',name)
                console.log('The name is', name)
                dispatch(addUser(name))
                navigation.navigate('main')
            } catch (error) {
                console.log(error);
            }
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Greeting Form</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                onChangeText={(text) => setName(text)}
                value={name}
            />

            <Button
                title="Greet Me"
                onPress={handlePress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        width: 200,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
    },
});

export default GreetingScreen;
