import {FlatList, Pressable, Text, TextInput, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getAllGroups, selectGroup} from "../../redux/groupSlice";
import {GroupItem} from "./GroupItem";
import {useEffect, useState} from "react";

export const GroupList = () => {
    const groups = useSelector(selectGroup);
    const dispatch = useDispatch();
    const [word, setWord] = useState("");
    const [translate, setTranslate] = useState("");

    useEffect(() => {
        dispatch(getAllGroups());
    }, []);

    return (
        <View style={{padding:10, justifyContent:'center', alignSelf:'center'}}>
            <TextInput
                placeholderTextColor="Write word..."
                value={word}
                onChangeText={setWord}
            />

            <TextInput
                placeholderTextColor="Write translate/answer"
                value={translate}
                onChangeText={setTranslate}
            />

            <Pressable>
                <Text>Hello,</Text>
            </Pressable>

            <FlatList
                data={groups}
                renderItem={(item) =>
                    <GroupItem
                        item={item}
                    />
                }
            />
        </View>
    )
}