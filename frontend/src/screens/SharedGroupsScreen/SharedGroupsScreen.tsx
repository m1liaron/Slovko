import ThemeText from "@/common/components/ThemeText/ThemeText";
import type { IGroup } from "@/common/enums/types/group.type";
import type { ISharedGroup } from "@/common/enums/types/sharedGroup";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	Platform,
	Pressable,
	TextInput,
	View,
} from "react-native";
import AvatarImage from "../../../assets/images/avatar.png";
import AddButton from "../../common/components/AddButton/AddButton";
import AddInput from "../../common/components/AddInput/AddInput";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { AppPath } from "../../common/enums/app/app";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { selectGroup } from "../../redux/groupReducer/groupSlice";
import {
	filterMySharedGroups,
	filterSharedGroups,
	getAllSharedGroups,
	removeSharedGroup,
	resetSharedGroups,
	saveSharedGroup,
} from "../../redux/sharedGroupReducer/sharedGroupSlice";
import { selectUser } from "../../redux/userReducer/userSlice";
import styles from "./SharedGroupsScreen.styles";

const SharedGroupsScreen = () => {
	const { user } = useAppSelector(selectUser);
	const {
		theme: { colors },
	} = useAppTheme();
	const dispatch = useAppDispatch();
	const navigation = useNavigation<StackNavigation>();
	const { sharedGroups, haveMoreSharedGroups, isLoading } = useAppSelector(
		(state) => state.sharedGroups,
	);
	const groups = useAppSelector(selectGroup);

	const [showAddModal, setShowModal] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
	const [sharedGroupTitle, setSharedGroupTitle] = useState(
		selectedGroup?.title,
	);
	const [showFilterInput, setShowFilterInput] = useState(false);
	const [filterValue, setFilterValue] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		dispatch(getAllSharedGroups({ page }));
	}, [dispatch, page]);

	const handleLoadMore = () => {
		if (haveMoreSharedGroups && !isLoading) {
			const nextPage = page + 1;
			dispatch(getAllSharedGroups({ page: nextPage }));
			setPage(nextPage);
		}
	};

	const formatTime = (createdAt: Date) => {
		const now = new Date().getTime();
		const timeDifference = now - new Date(createdAt).getTime();

		const oneDay = 24 * 60 * 60 * 1000;
		const sevenDays = 7 * oneDay;
		const oneHour = 60 * 60 * 1000;
		const oneMinute = 60 * 1000;

		if (timeDifference < oneHour) {
			const minutes = Math.floor(timeDifference / oneMinute);
			return `${minutes} хвилин${minutes === 1 ? "a" : minutes >= 3 && minutes <= 4 ? "и" : ""} тому`;
		}
		if (timeDifference < oneDay) {
			const hours = Math.floor(timeDifference / (60 * 60 * 1000));
			return `${hours} годин${hours === 1 ? "a" : hours >= 3 ? "и" : ""} тому`;
		}
		if (timeDifference < sevenDays) {
			const days = Math.floor(timeDifference / oneDay);
			return `${days} днів тому`;
		}
		return new Date(createdAt).toLocaleTimeString();
	};

	const addRemoveSelectedGroup = (newGroup: IGroup) => {
		setSelectedGroup(!selectedGroup ? newGroup : null);
		setSharedGroupTitle(!sharedGroupTitle ? newGroup.title : "");
	};

	const shareGroup = () => {
		if (!selectedGroup) {
			alert("Please select a shared group");
		}

		if (selectedGroup) {
			const sharedGroupData = {
				groupId: selectedGroup.id,
				title: sharedGroupTitle || "Shared Group Title",
			};
			dispatch(saveSharedGroup(sharedGroupData));
		}
	};

	const renderItem = ({ item }: { item: ISharedGroup }) => (
		<View
			key={item.id}
			style={{
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 20,
			}}
		>
			<Pressable
				style={[styles.container, { backgroundColor: colors.lightBackground }]}
				onPress={() =>
					navigation.navigate(AppPath.SharedGroupDetails, {
						sharedGroupId: item.id,
					})
				}
			>
				<View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
					<View style={{ flexDirection: "row", display: "flex", gap: 10 }}>
						<Image
							source={
								item?.user?.image ? { uri: item.user.image } : AvatarImage
							}
							style={{
								width: 40,
								height: 40,
								borderRadius: 100,
								borderWidth: 2,
								borderColor: colors.primary,
							}}
						/>
						<ThemeText style={{ fontSize: 30 }}>{item?.user?.name}</ThemeText>
					</View>
					<View
						style={{
							borderWidth: 2,
							borderColor: colors.primary,
							borderRadius: 10,
							padding: 5,
						}}
					>
						<ThemeText style={{ fontSize: 30 }}>{item.title}</ThemeText>
					</View>
				</View>

				{Platform.OS === "web" && (
					<ThemeText style={{ fontSize: 30 }}>
						{formatTime(item.createdAt)}
					</ThemeText>
				)}
			</Pressable>
			{item?.user?.id === user?.id && (
				<Pressable onPress={() => dispatch(removeSharedGroup(item.id))}>
					<Feather name="trash" color={colors.primary} size={30} />
				</Pressable>
			)}
		</View>
	);

	const renderFooter = () =>
		isLoading ? (
			<View style={{ paddingVertical: 20 }}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		) : null;

	return (
		<ThemeBackground>
			<View style={{ justifyContent: "center" }}>
				<View style={styles.header}>
					<ThemeText
						style={{
							fontSize: 40,
							fontWeight: "bold",
						}}
					>
						2024
					</ThemeText>
					<PressableButton
						text={i18n.t("sharedGroupsScreen.mySharedGroups")}
						onPress={() => dispatch(filterMySharedGroups({ userId: user?.id }))}
					/>
					<Pressable onPress={() => setShowFilterInput(!showFilterInput)}>
						<FontAwesome name="search" color={colors.iconColor} size={40} />
					</Pressable>
				</View>
			</View>
			{showFilterInput && (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-end",
					}}
				>
					<TextInput
						style={{
							borderWidth: 4,
							borderRadius: 20,
							borderColor: colors.primary,
							padding: 15,
							width: "30%",
							alignSelf: "flex-end",
							color: colors.primary,
						}}
						placeholder={i18n.t("sharedGroupsScreen.filter")}
						placeholderTextColor={colors.primary}
						value={filterValue}
						onChangeText={setFilterValue}
					/>
					<Pressable
						style={{
							borderWidth: 4,
							borderRadius: 20,
							borderColor: colors.primary,
							padding: 15,
							alignSelf: "flex-end",
						}}
						onPress={() => dispatch(filterSharedGroups(filterValue))}
					>
						<ThemeText>{i18n.t("sharedGroupsScreen.filterButton")}</ThemeText>
					</Pressable>
					<Pressable
						style={{
							borderWidth: 4,
							borderRadius: 20,
							borderColor: colors.primary,
							padding: 15,
							alignSelf: "flex-end",
						}}
						onPress={() => dispatch(resetSharedGroups())}
					>
						<FontAwesome6 name="arrow-rotate-left" color={colors.iconColor} />
					</Pressable>
				</View>
			)}

			{sharedGroups?.length ? (
				<FlatList
					data={sharedGroups}
					contentContainerStyle={{
						flexDirection: "column",
						gap: 20,
						padding: 10,
					}}
					keyExtractor={(item) => `${item.id}-${item.user?.id}`}
					renderItem={renderItem}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.1}
					ListFooterComponent={renderFooter}
				/>
			) : (
				<ThemeText>{i18n.t("sharedGroupsScreen.noGroups")}</ThemeText>
			)}

			<AddButton onPress={() => setShowModal(true)} />
			<DefaultModal
				isVisible={showAddModal}
				handleClose={() => setShowModal(false)}
			>
				<AddInput
					value={sharedGroupTitle}
					onChangeText={setSharedGroupTitle}
					placeholder={i18n.t("sharedGroupsScreen.placeholder")}
				/>
				{groups.length ? (
					<FlatList
						data={groups}
						keyExtractor={(item) => item.id}
						renderItem={({ item }: { item: IGroup }) => (
							<Pressable
								key={item.id}
								onPress={() => addRemoveSelectedGroup(item)}
							>
								<ThemeText
									style={{
										borderColor:
											selectedGroup?.title === item.title
												? "#007AFF"
												: colors.primary,
										borderWidth: 2,
										borderRadius: 10,
										fontSize: 30,
										padding: 20,
									}}
								>
									{item.title}
								</ThemeText>
							</Pressable>
						)}
						style={{ height: 400 }}
					/>
				) : (
					<View>
						<ThemeText
							style={{
								fontSize: 30,
							}}
						>
							{i18n.t("sharedGroupsScreen.noUserGroups")}
						</ThemeText>
						<PressableButton
							text={i18n.t("sharedGroupsScreen.createGroup")}
							onPress={() => navigation.navigate(AppPath.Home)}
							buttonStyle={{ padding: 20 }}
						/>
					</View>
				)}
				<PressableButton
					text={i18n.t("sharedGroupsScreen.share")}
					onPress={shareGroup}
				/>
			</DefaultModal>
		</ThemeBackground>
	);
};

export default SharedGroupsScreen;
