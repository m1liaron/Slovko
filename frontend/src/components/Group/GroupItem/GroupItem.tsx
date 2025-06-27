import { enqueueOrDispatch } from "@/helpers/offlineHelpers/enqueueOrDispatch";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { Entypo } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { Platform, Pressable, Text, View } from "react-native";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { removeGroup, removeStateGroup } from "../../../redux/groupReducer/groupSlice";
import styles from "./Group.styles";
import { useCallback } from "react";
import { removeCard, removeStateCard } from "@/redux/cardReducer/cardSlice";

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
	const { globalCards } = useAppSelector(state => state.cards);

	const handleRemoveGroup = useCallback(() => {
		// Don't call dispatch directly in render - wrap in async function
		const performRemove = async () => {
		  try {
			  await dispatch(enqueueOrDispatch(removeGroup, removeStateGroup, id));
			  const groupsCards = globalCards.filter(card => card.groupId === id);
			  for (const card of groupsCards) {
				  dispatch(enqueueOrDispatch(removeCard, removeStateCard, card.id));
			  }
		  } catch (error) {
			console.error('Failed to remove group:', error);
		  }
		};
		
		performRemove();
	  }, [dispatch, id]);

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
