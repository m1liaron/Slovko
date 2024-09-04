import {FlatList, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getAllGroups, selectGroup} from "../../redux/groupSlice";
import {GroupItem} from "./GroupItem";
import {useEffect} from "react";

export const GroupList = () => {
    const groups = useSelector(selectGroup);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllGroups());
    }, []);

    return (
        <View style={{padding:10, justifyContent:'center', alignSelf:'center'}}>
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