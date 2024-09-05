import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Pressable, Dimensions} from 'react-native';
import {Audio} from "expo-av";
import { FontAwesome, Entypo  } from '@expo/vector-icons';
const CardItem = ({ item, onRemove }) => {

    return (
        <View style={styles.cardContainer}>
            <View style={styles.titleContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{item.word}</Text>
                </View>
                <Entypo name="cross" onPress={onRemove} size={24} color="black" />
            </View>
            <Text style={styles.translate}>Переклад: <Text style={{fontWeight:'bold'}}>{item.translateWord}</Text></Text>
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
        width: '100%',
        height:Dimensions.get('window').height - 500,
        marginHorizontal:20,
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
});

export default CardItem;