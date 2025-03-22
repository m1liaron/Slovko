import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import RNPickerSelect from "react-native-picker-select";
import { useDispatch, useSelector } from "react-redux";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import BackButton from "../../components/BackButton/BackButton";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { selectResult } from "../../redux/resultReducer/resultSlice";
import { getResultsStatistics } from "../../redux/resultReducer/resultThunk";

const StatisticsScreen = () => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { statistics } = useSelector(selectResult);
	const dispatch = useDispatch();
	const [selectedMode, setSelectedMode] = useState("flashCards");
	const [selectedWordsMode, setSelectedWordsMode] = useState("wordLength"); // Mistakes || wordLength;
	const [selectedGraph, setSelectedGraph] = useState("LineChart");

	useEffect(() => {
		dispatch(getResultsStatistics());
	}, [dispatch]);

	const modesOptions = [
		{ label: "Вікторина", value: "quiz" },
		{ label: "Відгадай слово", value: "guessWord" },
	];

	const wordsModeOptions = [{ label: "Кількість слів", value: "wordLength" }];

	const graphOptions = [
		{ label: "Лінійний", value: "LinearChart" },
		{ label: "Стовпчатий", value: "BarChart" },
		{ label: "Пиріг", value: "PieChart" },
	];

	const renderGraph = () => {
		const chartConfig = {
			backgroundColor: "#011d65",
			backgroundGradientFrom: "#002efb",
			backgroundGradientTo: "#2643ff",
			decimalPlaces: 2,
			color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
			labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
			style: {
				borderRadius: 16,
			},
		};

		const data = {
			labels: statistics.resultsMonths,
			datasets: [
				{
					data: statistics.amountMistakesCards[selectedMode][selectedWordsMode],
				},
			],
		};

		const chartWidth = Dimensions.get("window").width - 100;

		switch (selectedGraph) {
			case "BarChart":
				return (
					<BarChart
						yAxisSuffix=""
						data={data}
						width={chartWidth}
						height={220}
						chartConfig={chartConfig}
						style={{ marginVertical: 8, borderRadius: 16 }}
					/>
				);
			case "PieChart":
				return (
					<PieChart
						data={statistics.amountMistakesCards[selectedMode][
							selectedWordsMode
						].map((value, index) => ({
							name: statistics.resultsMonths[index],
							population: value,
							color: `rgba(131, 167, 234, ${1 - index * 0.1})`,
							legendFontColor: "#7F7F7F",
							legendFontSize: 15,
						}))}
						width={chartWidth}
						height={220}
						chartConfig={chartConfig}
						accessor="population"
						backgroundColor="transparent"
						paddingLeft="15"
						absolute
						style={{ marginVertical: 8, borderRadius: 16 }}
					/>
				);
			default:
				return (
					<LineChart
						data={data}
						width={chartWidth}
						height={220}
						chartConfig={chartConfig}
						bezier
						style={{ marginVertical: 8, borderRadius: 16 }}
					/>
				);
		}
	};

	return (
		<ThemeBackground>
			<BackButton />
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						gap: 10,
					}}
				>
					<RNPickerSelect
						onValueChange={(value) => setSelectedMode(value)}
						items={modesOptions}
						value={selectedMode}
						placeholder={{ label: "Картки", value: "flashCards" }}
						style={{
							inputWeb: {
								color: "#000",
								padding: 10,
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
							},
							inputIOS: {
								color: "#000",
								padding: 10,
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
								marginBottom: 10,
							},
							inputAndroid: {
								color: "#000",
								padding: 10,
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
								marginBottom: 10,
							},
						}}
					/>
					<RNPickerSelect
						onValueChange={(value) => setSelectedWordsMode(value)}
						items={wordsModeOptions}
						value={selectedWordsMode}
						placeholder={{ label: "Помилок", value: "mistakes" }}
						style={{
							inputWeb: {
								color: "#000",
								padding: 10,
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
							},
							inputIOS: {
								color: "#000",
								padding: 10,
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
							},
							inputAndroid: {
								color: "#000",
								padding: 10,
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
							},
						}}
					/>
				</View>

				<RNPickerSelect
					onValueChange={(value) => setSelectedGraph(value)}
					items={graphOptions}
					value={selectedGraph}
					placeholder={{ label: "Виберіть графік", value: null }}
					style={{
						inputWeb: {
							color: "#000",
							padding: 10,
							backgroundColor: "#f0f0f0",
							borderRadius: 5,
						},
						inputIOS: {
							color: "#000",
							padding: 10,
							backgroundColor: "#f0f0f0",
							borderRadius: 5,
						},
						inputAndroid: {
							color: "#000",
							padding: 10,
							backgroundColor: "#f0f0f0",
							borderRadius: 5,
						},
					}}
				/>
			</View>

			<View style={{ margin: 20 }}>
				{statistics?.amountMistakesCards && renderGraph()}
			</View>
		</ThemeBackground>
	);
};

export default StatisticsScreen;
