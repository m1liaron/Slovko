import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Pressable, Dimensions} from 'react-native';
import {Audio} from "expo-av";
import { FontAwesome, Entypo  } from '@expo/vector-icons';
const CardItem = ({ item, onRemove }) => {
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

    return (
        <View style={styles.cardContainer}>
            <View style={styles.titleContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{item.word}</Text>
                </View>
                <Entypo name="cross" onPress={onRemove} size={24} color="black" />
            </View>
            <Text style={styles.translate}>Переклад: <Text style={{fontWeight:'bold'}}>{item.translateWord}</Text></Text>
            {item.nextReviewAt && <Text style={styles.reviewDate}>Наступний перегляд: <Text style={{ fontWeight: 'bold' }}>{formatReviewTime(item.nextReviewAt)}</Text></Text>}
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
    reviewDate: {
        fontSize: 16,
        marginTop: 10,
        color: '#007bff',
    },
});

export default CardItem;