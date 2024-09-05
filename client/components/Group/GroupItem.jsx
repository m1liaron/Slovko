import {Text, View, StyleSheet} from "react-native";
import {Link, useNavigation} from "@react-navigation/native";

export const GroupItem = ({item: { id, title }}) => {
    return (
        <Link key={id} style={styles.item} to={{screen: 'group', params:{groupId: id}}}>
            <Text style={{fontSize:30}}>{title}</Text>
        </Link>
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