import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { removeGroup } from "../../redux/groupReducer/groupSlice";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { AppPath } from '../../common/enums/app/app';

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
				justifyContent: "space-between",
				alignItems: "center"
			}}
		>
			<Link
				key={id}
				style={[styles.item, { borderColor: colors.text}]}
				to={{ screen: AppPath.Group, params: { groupId: id } }}
			>
				<Text style={{ fontSize: 30, color: colors.text }}>{title}</Text>
			</Link>
			<Pressable onPress={handleRemoveGroup}>
				<Entypo name="trash" size={30} color={colors.iconColor} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	item: {
		width: "100%",
		padding: 10,
		margin: 10,
		borderRadius: 20,
		borderWidth: 4,
		backgroundColor: "#fff"
	},
});
