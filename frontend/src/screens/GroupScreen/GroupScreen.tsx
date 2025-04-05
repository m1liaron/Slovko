import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import AddInput from "../../common/components/AddInput/AddInput";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { DataStatus } from "../../common/enums/app/app";
import BackButton from "../../components/BackButton/BackButton";
import CardList from "../../components/Card/CardList/CardList";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	filterCardsByStatus,
	resetFilter,
	sortCards,
} from "../../redux/cardReducer/cardSlice";
import { getGroup, updateGroup } from "../../redux/groupReducer/groupSlice";

type GroupScreenProps = {
	route: { params: { groupId: string } };
};

const GroupScreen = ({ route }: GroupScreenProps) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { groupId } = route.params;
	const { group, status } = useAppSelector((state) => state.groups);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [groupTitle, setGroupTitle] = useState<string>("");
	const [nextReviewSort, setNextReviewSort] = useState<"asc" | "desc">("asc"); // asc || desc
	const dispatch = useAppDispatch();
	const navigation = useNavigation<StackNavigation>();

	if (!group && status === DataStatus.ERROR) {
		navigation.goBack();
	}

	useEffect(() => {
		if (!group || group.id !== groupId) {
			dispatch(getGroup(groupId));
		}
	}, [dispatch, group, groupId]);

	const statusCardsButtons = useMemo(() => {
		if (!group) return [];
		return [
			{
				title: "Вивчаю",
				status: "To Learn",
				amount: group.learnToCardsAmount || 0,
				color: "#32C74D",
			},
			{
				title: "Вивченні",
				status: "Learned",
				amount: group.learnedCardsAmount || 0,
				color: "#62CBE9",
			},
			{
				title: "Знаю",
				status: "Know",
				amount: group.knowCardsAmount || 0,
				color: "#a8a800",
			},
		];
	}, [group]);

	const renderStatusButtons = () => {
		return statusCardsButtons.map(({ status, title, amount, color }) => (
			<Pressable
				key={title}
				style={{
					padding: 10,
					borderRadius: 10,
					borderWidth: 2,
					borderColor: color,
					marginHorizontal: 10,
				}}
				onPress={() => dispatch(filterCardsByStatus({ status }))}
			>
				<Text style={{ color, fontWeight: "bold" }}>
					{amount} {title}
				</Text>
			</Pressable>
		));
	};

	const updateGroupTitle = () => {
		if (!groupTitle) {
			return console.error("Provide title");
		}
		dispatch(updateGroup({ id: groupId, title: groupTitle }));
	};

	const sortByNextReview = () => {
		dispatch(sortCards(nextReviewSort));
		setNextReviewSort(nextReviewSort === "asc" ? "desc" : "asc");
	};

	return (
		<ThemeBackground>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					alignItems: "center",
				}}
			>
				<BackButton />
				<View>
					<Text
						style={{ fontSize: 30, fontWeight: "bold", color: colors.primary }}
					>
						{group?.title}
					</Text>
					<Entypo
						name="pencil"
						onPress={() => setShowEditModal(true)}
						size={24}
						color={colors.iconColor}
					/>
				</View>
			</View>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View>
					<Pressable onPress={sortByNextReview}>
						<MaterialCommunityIcons
							name={
								nextReviewSort === "asc"
									? "sort-clock-ascending-outline"
									: "sort-clock-descending-outline"
							}
							color={colors.primary}
							size={30}
						/>
					</Pressable>
				</View>
				{renderStatusButtons()}
				<Pressable
					style={{
						padding: 5,
						borderRadius: 10,
						borderWidth: 2,
						borderColor: "#bcbcbc",
						marginHorizontal: 10,
					}}
					onPress={() => dispatch(resetFilter())}
				>
					<Entypo name="back-in-time" size={30} color="#bcbcbc" />
				</Pressable>
			</View>
			<CardList groupId={groupId} />
			<DefaultModal
				isVisible={showEditModal}
				handleClose={() => setShowEditModal(false)}
			>
				<Text style={{ color: colors.primary }}>Змініть назву</Text>
				<AddInput
					value={groupTitle}
					onChangeText={setGroupTitle}
					placeholder="Назва..."
				/>

				<PressableButton text="Змінити" onPress={updateGroupTitle} />
			</DefaultModal>
		</ThemeBackground>
	);
};

export default GroupScreen;
