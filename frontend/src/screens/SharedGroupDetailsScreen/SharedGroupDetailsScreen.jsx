import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./SharedGroupDetailsScreen.styles";
import { useDispatch, useSelector } from "react-redux";
import { getSharedGroup } from "../../redux/sharedGroupReducer/sharedGroupSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton/BackButton";
import { useAppTheme } from "../../contexts/ThemeProvider";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';

/**
 * @param route { object: { params }}
 * @returns {JSX.Element}
 * @constructor
 */

const SharedGroupDetailsScreen = ({ route }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { sharedGroupId } = route.params;
	const { sharedGroup } = useSelector((state) => state.sharedGroups);
	const dispatch = useDispatch();

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

			{sharedGroup?.sharedCards &&
			sharedGroup.sharedCards.length > 0 ? (
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
							<Text style={[styles.title, { color: colors.primary }]}>
								{item.word}
							</Text>
							<Text style={[styles.translate, { color: colors.primary }]}>
								Переклад:{" "}
								<Text style={{ fontWeight: "bold" }}>{item.translateWord}</Text>
							</Text>
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
			<PressableButton text="Скопіювати групу" />
		</ThemeBackground>
	);
};

export default SharedGroupDetailsScreen;
