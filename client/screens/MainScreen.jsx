import React, {useEffect} from 'react';
import CardList from "../components/CardList";
import { SafeAreaView  } from "react-native-safe-area-context";
import { StyleSheet} from "react-native";
import axios from "axios";
const MainScreen = () => {
    // useEffect(() => {
    //     axiosRequest()
    // }, []);

    // const axiosRequest = () => {
    //     axios.post('http://localhost:8000/add_card', {word: 'bleach', language:'uk'})
    //         .then(response => {
    //         console.log(response)
    //     })
    // }

    return (
        <SafeAreaView  style={styles.container}>
            <CardList/>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})
export default MainScreen;
