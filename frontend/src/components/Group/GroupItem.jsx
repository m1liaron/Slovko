import { Entypo } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { removeGroup } from "../../redux/groupReducer/groupSlice";

export const GroupItem = ({ item: { id, title } }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const dispatch = useDispatch();

	const handleRemoveGroup = () => {
		dispatch(removeGroup(id));
	};

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Link
				key={id}
				style={[styles.item, { backgroundColor: colors.lightBackground }]}
				to={{ screen: "group", params: { groupId: id } }}
			>
				<Text style={{ fontSize: 30, color: colors.primary }}>{title}</Text>
			</Link>
			<Pressable onPress={handleRemoveGroup}>
				<Entypo name="trash" size={30} color={colors.iconColor} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	item: {
		width: "50%",
		padding: 10,
		margin: 10,
		borderRadius: 5,
	},
});
