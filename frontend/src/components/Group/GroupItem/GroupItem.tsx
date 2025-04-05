import { Entypo } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { removeGroup } from "../../../redux/groupReducer/groupSlice";
import styles from "./Group.styles";
import { useAppDispatch } from "@/hooks/redux.hooks";

interface GroupItemProps  {
	item: { 
		id: string;
		title: string;
	}
}

export const GroupItem = ({ item: { id, title } }: GroupItemProps) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const dispatch = useAppDispatch();

	const handleRemoveGroup = () => {
		dispatch(removeGroup(id));
	};

	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
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