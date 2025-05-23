import noGroupsImage from "@/assets/images/no_groups.png";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import AddButton from "../../../common/components/AddButton/AddButton";
import AddInput from "../../../common/components/AddInput/AddInput";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import {
	addGroup,
	getAllGroups,
	selectGroup,
} from "../../../redux/groupReducer/groupSlice";
import DefaultModal from "../../DefaultModal/DefaultModal";
import { GroupItem } from "../GroupItem/GroupItem";
import styles from "./GroupList.styles";
import { SkeletonGroupItem } from "@/common/components/SkeletonGroupItem/SkeletonGroupItem";

export const GroupList = () => {
	const {
		theme: { colors },
	} = useAppTheme();
	const {groups, isLoading} = useAppSelector(state => state.groups);
	const dispatch = useAppDispatch();
	const [title, setTitle] = useState<string>("");
	const [showAddModal, setShowAddModal] = useState<boolean>(false);

	useEffect(() => {
		dispatch(getAllGroups());
	}, [dispatch]);

	const handleAddGroup = () => {
		if (!title.length) {
			Toast.show({
				type: "error",
				text1: "Please enter a title",
			});
		}
		dispatch(addGroup({ title }));
		setTitle("");
		setShowAddModal(false);
	};

	return (
		<View style={styles.container}>
			<View style={styles.groupListContainer}>
				{isLoading ? (
					<FlatList
						data={Array(5).fill(null)}
						keyExtractor={(_, index) => `skeleton-${index}`}
						renderItem={() => <SkeletonGroupItem />}
					/>
				) : !groups.length ? (
					<View style={styles.noGroupsContainer}>
						<Image source={noGroupsImage} />
					</View>
				) : (
					<FlatList
						data={groups}
						renderItem={({ item }) => <GroupItem item={item} />}
						keyExtractor={(item) => item.id}
					/>
				)}
			</View>
			<AddButton onPress={() => setShowAddModal(true)} />

			<DefaultModal
				isVisible={showAddModal}
				handleClose={() => setShowAddModal(false)}
			>
				<Text style={{ color: colors.primary }}>Додайте Групу!</Text>
				<AddInput
					placeholder="Назва Групи"
					placeholderTextColor="#A0A0A0"
					value={title}
					onChangeText={setTitle}
				/>

				<PressableButton onPress={handleAddGroup} text="Додати групу" />
			</DefaultModal>
		</View>
	);
};
