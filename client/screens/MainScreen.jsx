import React, {useEffect} from 'react';
import { SafeAreaView  } from "react-native-safe-area-context";
import {StyleSheet, Text} from "react-native";
import BottomSheetComponent from "../components/BottomSheetComponent";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {GroupList} from "../components/Group/GroupList";
import {useDispatch} from "react-redux";
import {getUser} from "../redux/userSlice";
const MainScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, []);

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
