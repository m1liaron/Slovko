import React from 'react';
import {View, Text, StyleSheet, Button, Pressable} from 'react-native';

const CardItem = ({ item, onRemove }) => {
    return (
        <View style={styles.cardContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.translate}>{item.translate}</Text>

            <Pressable onPress={onRemove} className='bg-black' >
                <Text style={styles.removeButton}>Remove</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    title: {
        fontSize: 18,
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