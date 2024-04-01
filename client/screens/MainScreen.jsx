import React, {useEffect} from 'react';
import CardList from "../components/CardList";
import { SafeAreaView  } from "react-native-safe-area-context";
import { StyleSheet} from "react-native";
import BottomSheetComponent from "../components/BottomSheetComponent";
import {GestureHandlerRootView} from "react-native-gesture-handler";
const MainScreen = () => {
    return (
        <SafeAreaView  style={styles.container}>
            <CardList/>
            {/*<GestureHandlerRootView>*/}
            {/*    <BottomSheetComponent/>*/}
            {/*</GestureHandlerRootView>*/}
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})
export default MainScreen;
