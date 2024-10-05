import {FlatList, Pressable, Text, TextInput, View, StyleSheet, Image} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {addGroup, getAllGroups, selectGroup} from "../../redux/groupSlice";
import {GroupItem} from "./GroupItem";
import React, {useEffect, useState} from "react";
import Toast from "react-native-toast-message";
import noGroupsImage from '../../assets/images/no_groups.png';
import PressableButton from "../../common/components/PressableButton/PressableButton";
import AddInput from "../../common/components/AddInput/AddInput";
import AddButton from "../../common/components/AddButton/AddButton";
import DefaultModal from "../DefaultModal/DefaultModal";

export const GroupList = () => {
    const groups = useSelector(selectGroup);
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        dispatch(getAllGroups());
    }, []);

    const handleAddGroup = () => {
        if(!title.length) {
            Toast.show({
                type: "error",
                text1: "Please enter a title",
            })
        }
        dispatch(addGroup({ title }));
        setTitle('');
        setShowAddModal(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.groupListContainer}>
                {!groups.length ? (
                    <View style={styles.noGroupsContainer}>
                        <Image source={noGroupsImage}/>
                    </View>
                ) : (
                    <FlatList
                        data={groups}
                        renderItem={({item}) => <GroupItem item={item} />}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </View>
            <AddButton onPress={() => setShowAddModal(true)}/>

            <DefaultModal
                isVisible={showAddModal}
                handleClose={() => setShowAddModal(false)}
            >
                <AddInput
                    placeholder="Назва Групи"
                    placeholderTextColor="#A0A0A0"
                    value={title}
                    onChangeText={setTitle}
                />

                <PressableButton onPress={handleAddGroup} text="Додати групу" />
            </DefaultModal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '90%',
        flex: 1
    },
    groupListContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    noGroupsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});