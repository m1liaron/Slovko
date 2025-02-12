import React, { useEffect, useState } from "react";
import {
	FlatList,
	Image,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import {
	filterMySharedGroups,
	filterSharedGroups,
	getAllSharedGroups,
	removeSharedGroup,
	resetSharedGroups,
	saveSharedGroup,
	selectSharedGroup,
} from "../../redux/sharedGroupReducer/sharedGroupSlice";
import styles from "./SharedGroupsScreen.styles";
import { Link, useNavigation } from "@react-navigation/native";
import { AppPath } from "../../common/enums/app/app";
import AddButton from "../../common/components/AddButton/AddButton";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import { selectGroup } from "../../redux/groupReducer/groupSlice";
import AddInput from "../../common/components/AddInput/AddInput";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import AvatarImage from "../../../assets/images/avatar.png";
import { selectUser } from "../../redux/userReducer/userSlice";

const SharedGroupsScreen = () => {
	const { user } = useSelector(selectUser);
	const {
		theme: { colors },
	} = useAppTheme();
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const sharedGroups = useSelector(selectSharedGroup);
	const groups = useSelector(selectGroup);

	const [showAddModal, setShowModal] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [sharedGroupTitle, setSharedGroupTitle] = useState(
		selectedGroup?.title,
	);
	const [showFilterInput, setShowFilterInput] = useState(false);
	const [filterValue, setFilterValue] = useState("");

	useEffect(() => {
		dispatch(getAllSharedGroups());
	}, [dispatch]);

	const formatTime = (createdAt) => {
		const now = new Date();
		const timeDifference = now - new Date(createdAt);

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

	const addRemoveSelectedGroup = (newGroup) => {
		setSelectedGroup(!selectedGroup ? newGroup : null);
		setSharedGroupTitle(!sharedGroupTitle ? newGroup.title : "");
	};

	const shareGroup = () => {
		if (!selectedGroup) {
			alert("Please select a shared group");
		}

		const sharedGroupData = {
			groupId: selectedGroup.id,
			title: sharedGroupTitle,
		};
		dispatch(saveSharedGroup(sharedGroupData));
	};

	const renderItem = ({ item }) => (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 20,
			}}
		>
			<Link
				style={[styles.container, { backgroundColor: colors.lightBackground }]}
				to={{
					screen: AppPath.SharedGroupDetails,
					params: { sharedGroupId: item.id },
				}}
			>
				<View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
					<View style={{ flexDirection: "row", display: "flex", gap: 10 }}>
						<Image
							source={item.user.image || AvatarImage}
							style={{
								width: 40,
								height: 40,
								borderRadius: 100,
								borderWidth: 2,
								borderColor: colors.primary,
							}}
						/>
						<Text style={{ color: colors.primary, fontSize: 30 }}>
							{item.user.name}
						</Text>
					</View>
					<View
						style={{
							borderWidth: 2,
							borderColor: colors.primary,
							borderRadius: 10,
							padding: 5,
						}}
					>
						<Text style={{ color: colors.primary, fontSize: 30 }}>
							{item.title}
						</Text>
					</View>
				</View>

				<Text style={{ color: colors.primary, fontSize: 30 }}>
					{formatTime(item.createdAt)}
				</Text>
			</Link>
			{item.user.id === user.id && (
				<Pressable onPress={() => dispatch(removeSharedGroup(item.id))}>
					<Feather name="trash" color={colors.primary} size={30} />
				</Pressable>
			)}
		</View>
	);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<View style={{ justifyContent: "center" }}>
				<View style={styles.header}>
					<Text
						style={{ fontSize: 40, fontWeight: "bold", color: colors.primary }}
					>
						2024
					</Text>
					<PressableButton
						text="Мої поширені групи"
						onPress={() => dispatch(filterMySharedGroups({ userId: user.id }))}
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
							alignSelf: "end",
							color: colors.primary,
						}}
						placeholder="Фільтр"
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
							alignSelf: "end",
						}}
						onPress={() => dispatch(filterSharedGroups(filterValue))}
					>
						<Text style={{ color: colors.primary }}>Фільтрувати</Text>
					</Pressable>
					<Pressable
						style={{
							borderWidth: 4,
							borderRadius: 20,
							borderColor: colors.primary,
							padding: 15,
							alignSelf: "end",
						}}
						onPress={() => dispatch(resetSharedGroups())}
					>
						<FontAwesome6 name="arrow-rotate-left" color={colors.iconColor} />
					</Pressable>
				</View>
			)}

			{groups.length ? (
				<FlatList
					data={sharedGroups}
					contentContainerStyle={{
						flexDirection: "column",
						gap: 20,
						padding: 10,
					}}
					renderItem={renderItem}
				/>
			) : (
				<Text>Немає пошеренних груп</Text>
			)}

			<AddButton onPress={() => setShowModal(true)} />
			<DefaultModal
				isVisible={showAddModal}
				handleClose={() => setShowModal(false)}
			>
				<AddInput
					value={sharedGroupTitle}
					onChangeText={setSharedGroupTitle}
					placeholder="Назва групи"
				/>
				{groups.length ? (
					<FlatList
						data={groups}
						renderItem={({ item }) => (
							<Pressable onPress={() => addRemoveSelectedGroup(item)}>
								<Text
									style={{
										color: colors.primary,
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
								</Text>
							</Pressable>
						)}
					/>
				) : (
					<View>
						<Text
							style={{
								color: colors.primary,
								fontSize: 30,
							}}
						>
							Немає груп
						</Text>
						<PressableButton
							text="Створити групу"
							onPress={() => navigation.navigate(AppPath.Home)}
							buttonStyle={{ padding: 20 }}
						/>
					</View>
				)}
				<PressableButton text="Поширити" onPress={shareGroup} />
			</DefaultModal>
		</SafeAreaView>
	);
};

export default SharedGroupsScreen;
