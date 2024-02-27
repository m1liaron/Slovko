import React from 'react';
import CardList from "../components/CardList";
import { SafeAreaView  } from "react-native-safe-area-context";
import { StyleSheet} from "react-native";
const MainScreen = () => {
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
