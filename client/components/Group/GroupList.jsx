import {FlatList, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {addGroup, getAllGroups, selectGroup} from "../../redux/groupSlice";
import {GroupItem} from "./GroupItem";
import {useEffect, useState} from "react";
import Toast from "react-native-toast-message";

export const GroupList = () => {
    const groups = useSelector(selectGroup);
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");

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
        console.log('add group')
        dispatch(addGroup({ title }));
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#A0A0A0"
                value={title}
                onChangeText={setTitle}
            />

            <Pressable style={styles.button} onPress={handleAddGroup}>
                <Text style={styles.buttonText}>Add Group</Text>
            </Pressable>

            <FlatList
                data={groups}
                renderItem={({item}) => <GroupItem item={item} />}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '90%',
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#FFF',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,  // Android shadow
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});