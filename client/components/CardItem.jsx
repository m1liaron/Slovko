import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Pressable, Dimensions} from 'react-native';
import {Audio} from "expo-av";
import { FontAwesome, Entypo  } from '@expo/vector-icons';
const CardItem = ({ item, onRemove }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const playUrl = async () => {
        const sound = new Audio.Sound();

        try {
            setIsPlaying(!isPlaying)
            await sound.loadAsync({ uri: 'http://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3' });

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    sound.unloadAsync(); // Unload the audio after playback finishes
                }
            });


            await sound.playAsync();
        } catch (error) {
            console.error('Error loading or playing the audio', error);
        }
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.titleContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Pressable onPress={playUrl} >
                        <FontAwesome name="file-audio-o" size={30} color={isPlaying ? "red" : "black"} />
                    </Pressable>
                </View>
                <Entypo name="cross" onPress={onRemove} size={24} color="black" />
            </View>

            <Text style={styles.translate}>{item.translate}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor:'#000',
        shadowOpacity: 0.2,
        shadowRadius: 5, // Adjust the radius for iOS
        width:Dimensions.get('window').width - 70,
        height:Dimensions.get('window').height - 500,
        marginHorizontal: 20
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