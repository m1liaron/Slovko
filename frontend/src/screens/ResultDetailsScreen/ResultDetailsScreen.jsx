import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { getResultDetails } from "../../redux/resultReducer/resultSlice";
import formatDMTDate from "../../utils/formatDMTDate";
import { formatTime } from "../../utils/formatTime";
import styles from "./ResultDetailsScreen.styles";

const ResultDetailsScreen = ({ route }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { resultId } = route.params;
	const { result, isLoading } = useSelector((state) => state.results);
	const dispatch = useDispatch();
	const [selectedMode, setSelectedMode] = useState(0); // 0 - flashCards, 1 - quiz, 2 - guessWord

	useEffect(() => {
		dispatch(getResultDetails(resultId));
	}, [dispatch, resultId]);

	const resultTime =
		new Date(result.completionTime) - new Date(result.startedLearn);
	const formattedTime = formatTime(resultTime);

	const calculateCorrectPercentage = () => {
		const words = result.mode ? result.mode[selectedMode].words : [];
		const totalWords = words.length;
		const correctWords = words.filter(
			(word) => word.mistakesAmount === 0,
		).length;
		return totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
	};

	const correctPercentage = calculateCorrectPercentage();

	const modesOptionsButtons = [
		{ label: "Картки" },
		{ label: "Вікторина" },
		{ label: "Вгадай слово" },
	];

	return (
		<ThemeBackground>
			<View
				style={[styles.header, { backgroundColor: colors.lightBackground }]}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
					}}
				>
					<BackButton />
					<Text style={[styles.title, { color: colors.primary }]}>
						{result.title}
					</Text>

					<View
						style={[
							styles.wastedTimeContainer,
							{ borderColor: colors.primary },
						]}
					>
						<Text style={[styles.title, { color: colors.primary }]}>
							{formattedTime}
						</Text>
					</View>
				</View>
				<Text style={[styles.title, { color: colors.primary }]}>
					{formatDMTDate(result.createdAt)}
				</Text>
			</View>

			<View
				style={{
					borderWidth: 4,
					borderColor: "#fff",
					backgroundColor: "#40FF80",
					borderRadius: 100,
					padding: 10,
				}}
			>
				<Text style={{ fontSize: 25, color: "#fff" }}>
					{correctPercentage}% Вірно
				</Text>
			</View>

			<View style={{ marginHorizontal: 50 }}>
				<FlatList
					data={modesOptionsButtons.filter(
						(_, index) => result.mode && result.mode[index]?.words?.length > 0,
					)} // Do not show buttons that mode's words length equal 0
					keyExtractor={(item) => item.label}
					renderItem={({ item: { label }, index }) => (
						<PressableButton
							text={label}
							buttonStyle={{
								backgroundColor: selectedMode === index ? "#004da4" : "#007AFF",
							}}
							onPress={() => setSelectedMode(index)}
						/>
					)}
					contentContainerStyle={styles.buttonsContainer}
				/>

				{isLoading && <Loading />}
				{result.mode && (
					<FlatList
						style={{ height: 600 }}
						data={result.mode[selectedMode].words}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View
								style={[
									styles.itemContainer,
									{ backgroundColor: colors.lightBackground },
								]}
							>
								<View style={styles.resultContainer}>
									<Text style={[styles.title, { color: colors.primary }]}>
										{item.word} - {item.translate}
									</Text>
								</View>
								<View style={styles.mistakesAmountContainer}>
									<Text style={[styles.title, { color: colors.primary }]}>
										{item.mistakesAmount}
									</Text>
								</View>
							</View>
						)}
					/>
				)}
			</View>
		</ThemeBackground>
	);
};

export default ResultDetailsScreen;
