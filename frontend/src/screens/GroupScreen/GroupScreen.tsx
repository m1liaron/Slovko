import ThemeText from "@/common/components/ThemeText/ThemeText";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type {
	RootStackParamList,
	StackNavigation,
} from "@/navigation/ProtectedRoute/ProtectedRoute";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import AddInput from "../../common/components/AddInput/AddInput";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { type AppPath, DataStatus } from "../../common/enums/app/app";
import BackButton from "../../components/BackButton/BackButton";
import CardList from "../../components/Card/CardList/CardList";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	filterCardsByStatus,
	resetFilter,
	sortCards,
} from "../../redux/cardReducer/cardSlice";
import {
	getGroup,
	removeGroup,
	updateGroup,
} from "../../redux/groupReducer/groupSlice";
import { RootState } from "@/redux/store";
import { enqueueOrDispatch } from "@/helpers/offlineHelpers/enqueueOrDispatch";

type GroupScreenProps = StackScreenProps<
	RootStackParamList,
	typeof AppPath.Group
>;

const GroupScreen: React.FC<GroupScreenProps> = ({ route }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { groupId } = route.params as { groupId: string };
	const { group, status } = useAppSelector((state) => state.groups);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [groupTitle, setGroupTitle] = useState<string>("");
	const [nextReviewSort, setNextReviewSort] = useState<"asc" | "desc">("asc"); // asc || desc
	const dispatch = useAppDispatch();
	const navigation = useNavigation<StackNavigation>();
	const isConnected = useAppSelector((state: RootState) => state.network.isConnected);

	if (!group && status === DataStatus.ERROR) {
		navigation.goBack();
	}

	useEffect(() => {
		if (!group || group.id !== groupId) {
			enqueueOrDispatch(getGroup, groupId);
		}
	}, [enqueueOrDispatch, group, groupId]);

	const statusCardsButtons = useMemo(() => {
		if (!group) return [];
		return [
			{
				title: i18n.t("group.studying"),
				status: "To Learn",
				amount: group.learnToCardsAmount || 0,
				color: "#32C74D",
			},
			{
				title: i18n.t("group.reviewed"),
				status: "Learned",
				amount: group.learnedCardsAmount || 0,
				color: "#62CBE9",
			},
			{
				title: i18n.t("group.known"),
				status: "Know",
				amount: group.knowCardsAmount || 0,
				color: "#a8a800",
			},
		];
	}, [group]);

	const RenderStatusButtons = () => {
		return statusCardsButtons.map(({ status, title, amount, color }) => (
			<Pressable
				key={title}
				style={{
					padding: 10,
					borderRadius: 10,
					borderWidth: 2,
					borderColor: color,
					marginHorizontal: 10,
					alignItems: "center",
				}}
				onPress={() => dispatch(filterCardsByStatus({ status }))}
			>
				<Text style={{ color, fontWeight: "bold" }}>{amount}</Text>
				<Text style={{ color, fontWeight: "bold" }}>{title}</Text>
			</Pressable>
		));
	};

	const updateGroupTitle = () => {
		if (!groupTitle) {
			return console.error("Provide title");
		}
		enqueueOrDispatch(updateGroup, { id: groupId, title: groupTitle });
	};

	const sortByNextReview = () => {
		dispatch(sortCards(nextReviewSort));
		setNextReviewSort(nextReviewSort === "asc" ? "desc" : "asc");
	};

	return (
		<ThemeBackground>
			<Text>Network: {isConnected ? "Online" : "Offline"}</Text>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
					<BackButton />
					<ThemeText style={{ fontSize: 30, fontWeight: "bold" }}>
						{group?.title}
					</ThemeText>
					<Entypo
						name="pencil"
						onPress={() => setShowEditModal(true)}
						size={24}
						color={colors.iconColor}
					/>
				</View>
				<Pressable onPress={() => enqueueOrDispatch(removeGroup, groupId)}>
					<Entypo name="trash" size={30} color={colors.iconColor} />
				</Pressable>
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

				{group?.knowCardsAmount && (
					<>
						<RenderStatusButtons />
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
					</>
				)}
			</View>
			<CardList groupId={groupId} />
			<DefaultModal
				isVisible={showEditModal}
				handleClose={() => setShowEditModal(false)}
			>
				<ThemeText>{i18n.t("group.changeTitle")}</ThemeText>
				<AddInput
					value={groupTitle}
					onChangeText={setGroupTitle}
					placeholder={i18n.t("group.inputPlaceholder")}
				/>

				<PressableButton
					text={i18n.t("group.changeButton")}
					onPress={updateGroupTitle}
				/>
			</DefaultModal>
		</ThemeBackground>
	);
};

export default GroupScreen;
