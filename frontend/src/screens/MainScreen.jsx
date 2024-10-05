import React, { useState, useEffect} from 'react';
import { SafeAreaView  } from "react-native-safe-area-context";
import {StyleSheet, Text} from "react-native";
import {GroupList} from "../components/Group/GroupList";
import {useDispatch} from "react-redux";
import {getUser} from "../redux/userSlice";
import AddButton from "../common/components/AddButton/AddButton";
const MainScreen = () => {
const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <SafeAreaView  style={styles.container}>
            <GroupList/>
            <AddButton/>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})
export default MainScreen;
