import ThemeText from "@/common/components/ThemeText/ThemeText";
import type { AppPath } from "@/common/enums/app/AppPath";
import { enqueueOrDispatch } from "@/helpers/offlineHelpers/enqueueOrDispatch";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type { RootStackParamList } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { formatDMTDate } from "@/utils/utils";
import type { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import BackButton from "../../components/BackButton/BackButton";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	copySharedGroup,
	getSharedGroup,
} from "../../redux/sharedGroupReducer/sharedGroupSlice";
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
		dispatch(enqueueOrDispatch(getSharedGroup, sharedGroupId));
	}, [dispatch, sharedGroupId]);

	return (
		<ThemeBackground>
			<View style={styles.header}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<BackButton />
					{sharedGroup && (
						<ThemeText
							style={{
								fontSize: 30,
								fontWeight: "bold",
							}}
						>
							{sharedGroup.title}
						</ThemeText>
					)}
				</View>

				{sharedGroup && (
					<View>
						<ThemeText
							style={{
								fontSize: 30,
								fontWeight: "bold",
							}}
						>
							{formatDMTDate(new Date(sharedGroup.createdAt))}
						</ThemeText>
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
								{i18n.t("sharedGroup.translation")}
								<Text style={{ fontWeight: "bold" }}>{item.translateWord}</Text>
							</ThemeText>
						</View>
					)}
				/>
			) : (
				<View>
					<Text style={{ color: colors.primary, fontSize: 40 }}>
						{i18n.t("sharedGroup.noCards")}
					</Text>
				</View>
			)}
			<PressableButton
				text={i18n.t("sharedGroup.copyGroupButton")}
				onPress={() => dispatch(enqueueOrDispatch(copySharedGroup, sharedGroupId))}
			/>
		</ThemeBackground>
	);
};

export default SharedGroupDetailsScreen;
