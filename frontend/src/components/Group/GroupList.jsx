import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import noGroupsImage from "../../assets/images/no_groups.png";
import AddButton from "../../common/components/AddButton/AddButton";
import AddInput from "../../common/components/AddInput/AddInput";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	addGroup,
	getAllGroups,
} from "../../redux/groupReducer/groupSlice";
import DefaultModal from "../DefaultModal/DefaultModal";
import { GroupItem } from "./GroupItem";

export const GroupList = () => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { groups, error } = useSelector(state => state.groups);
	const dispatch = useDispatch();
	const [title, setTitle] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);

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

	};

	useEffect(() => {
		if(error) {
			Toast.show({
				type: "error",
				text1: "Failed🔴",
				text2: error,
			})
		}
	}, [dispatch, error]);

	return (
		<View style={styles.container}>
			<View style={styles.groupListContainer}>
				{!groups.length ? (
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
				<Toast />
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

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: "center",
		alignSelf: "center",
		width: "90%",
		flex: 1,
	},
	groupListContainer: {
		flexDirection: "column",
		flex: 1,
	},
	noGroupsContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
});
