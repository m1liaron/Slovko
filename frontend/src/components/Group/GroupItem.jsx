import {Text, View, StyleSheet, Pressable} from "react-native";
import {Link, useNavigation} from "@react-navigation/native";
import {Entypo} from "@expo/vector-icons";
import {useDispatch} from "react-redux";
import {removeGroup} from "../../redux/groupSlice";

export const GroupItem = ({item: { id, title }}) => {
    const dispatch = useDispatch();

    const handleRemoveGroup = () => {
        dispatch(removeGroup(id));
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Link key={id} style={styles.item} to={{screen: 'group', params:{groupId: id}}}>
                <Text style={{fontSize:30}}>{title}</Text>
            </Link>
            <Pressable onPress={handleRemoveGroup}>
                <Entypo name="trash" size={30} color="#000" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        width:'100%',
        backgroundColor: '#dadada',
        padding:10,
        margin:10,
        borderRadius:5,
    }
})