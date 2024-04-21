import React from 'react';
import { SafeAreaView  } from "react-native-safe-area-context";
import { StyleSheet} from "react-native";
import BottomSheetComponent from "../components/BottomSheetComponent";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import CardList from "../components/Card/CardList";
import {GroupList} from "../components/Group/GroupList";
const MainScreen = () => {

    return (
        <SafeAreaView  style={styles.container}>
            <GroupList/>
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
