import ThemeText from "@/common/components/ThemeText/ThemeText";
import type { AppPath } from "@/common/enums/app/AppPath";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type { RootStackParamList } from "@/navigation/ProtectedRoute/ProtectedRoute";
import type { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import BackButton from "../../components/BackButton/BackButton";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { getSharedGroup } from "../../redux/sharedGroupReducer/sharedGroupSlice";
import styles from "./SharedGroupDetailsScreen.styles";

/**
 * @param route { object: { params }}
 * @returns {JSX.Element}
 * @constructor
 */

type SharedGroupDetailsScreenProps = StackScreenProps<
	RootStackParamList,
	typeof AppPath.SharedGroupDetails
>;

const SharedGroupDetailsScreen = ({ route }: SharedGroupDetailsScreenProps) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { sharedGroupId } = route.params as { sharedGroupId: string };
	const { sharedGroup } = useAppSelector((state) => state.sharedGroups);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getSharedGroup(sharedGroupId));
	}, [dispatch, sharedGroupId]);

	return (
		<ThemeBackground>
			<View style={styles.header}>
				<BackButton />
				{sharedGroup && (
					<View>
						<View>
							<Text
								style={{
									color: colors.primary,
									fontSize: 30,
									fontWeight: "bold",
								}}
							>
								{sharedGroup.title}
							</Text>
						</View>
					</View>
				)}
			</View>
			{sharedGroup?.sharedCards && sharedGroup.sharedCards.length > 0 ? (
				<FlatList
					data={sharedGroup.sharedCards}
					showsHorizontalScrollIndicator={false}
					horizontal={true}
					contentContainerStyle={styles.cardsList}
					renderItem={({ item }) => (
						<View
							style={[
								styles.cardContainer,
								{ backgroundColor: colors.lightBackground },
							]}
						>
							<ThemeText>{item.word}</ThemeText>
							<ThemeText>
								Переклад:{" "}
								<Text style={{ fontWeight: "bold" }}>{item.translateWord}</Text>
							</ThemeText>
						</View>
					)}
				/>
			) : (
				<View>
					<Text style={{ color: colors.primary, fontSize: 40 }}>
						Немає карток тут
					</Text>
				</View>
			)}
			{/*  !TODO function to copy shared group */}
			<PressableButton text="Скопіювати групу" />
		</ThemeBackground>
	);
};

export default SharedGroupDetailsScreen;
