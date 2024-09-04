import {FlatList, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {selectGroup} from "../../redux/groupSlice";
import {GroupItem} from "./GroupItem";

export const GroupList = () => {
    const groups = useSelector(selectGroup);

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