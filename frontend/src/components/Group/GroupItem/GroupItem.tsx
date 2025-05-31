import { useAppDispatch } from "@/hooks/redux.hooks";
import { Entypo } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { Platform, Pressable, Text, View } from "react-native";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { removeGroup } from "../../../redux/groupReducer/groupSlice";
import styles from "./Group.styles";

interface GroupItemProps {
	item: {
		id: string;
		title: string;
	};
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
			{Platform.OS === "web" ? (
				<Pressable onPress={handleRemoveGroup}>
					<Entypo name="trash" size={30} color={colors.iconColor} />
				</Pressable>
			) : null}
		</View>
	);
};
