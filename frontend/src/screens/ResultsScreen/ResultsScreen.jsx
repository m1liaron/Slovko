import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import ThemeText from "../../common/components/ThemeText/ThemeText";
import { AppPath } from "../../common/enums/app/app";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	filterResults,
	getResults,
	resetResults,
	sortResults,
} from "../../redux/resultReducer/resultSlice";
import styles from "./ResultsScreen.styles";

const ResultsScreen = () => {
	const dispatch = useDispatch();
	const {
		theme: { colors },
	} = useAppTheme();
	const { results } = useSelector((state) => state.results);
	const [filterValue, setFilterValue] = useState("");
	const [showFilterInput, setShowFilterInput] = useState(false);
	const [sortOrder, setSortOrder] = useState("asc");
	const [groupedResults, setGroupedResults] = useState({});
	const [resultsYear, setResultsYear] = useState(new Date().getFullYear());

	useEffect(() => {
		if (results.length > 0) {
			const groupedData = groupResultsByDay(results);
			setGroupedResults(groupedData);
		}
	}, [results]);

	const groupResultsByDay = (results) => {
		return results.reduce((groups, item) => {
			const date = new Date(item.createdAt).toISOString().split("T")[0]; // Format as YYYY-MM-DD
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(item);
			return groups;
		}, {});
	};

	useEffect(() => {
		dispatch(getResults({ resultsYear }));
	}, [dispatch, resultsYear]);

	const handleSort = () => {
		dispatch(sortResults({ key: "title", direction: sortOrder }));
		setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
	};

	const isTitleDate = (title) => !isNaN(Date.parse(title));
	const decreaseYear = () => {
		if (resultsYear > 2024) {
			setResultsYear(resultsYear - 1);
		}
	};

	const increaseYear = () => {
		if (resultsYear < new Date().getFullYear()) {
			setResultsYear(resultsYear + 1);
		}
	};

	return (
		<ThemeBackground>
			<View style={{ justifyContent: "center" }}>
				<View style={styles.header}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<Pressable onPress={decreaseYear}>
							<AntDesign
								name="caretleft"
								size={30}
								color={colors.iconColor}
								disabled={resultsYear > 2024}
							/>
						</Pressable>
						<Text
							style={{
								fontSize: 40,
								fontWeight: "bold",
								color: colors.primary,
							}}
						>
							{resultsYear}
						</Text>
						<Pressable onPress={increaseYear}>
							<AntDesign
								name="caretright"
								size={30}
								color={colors.iconColor}
								disabled={resultsYear < new Date().getFullYear()}
							/>
						</Pressable>
						<ThemeText>{results.length} занять</ThemeText>
					</View>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row",
							gap: 20,
						}}
					>
						<Pressable onPress={() => setShowFilterInput(!showFilterInput)}>
							<FontAwesome name="search" color={colors.iconColor} size={40} />
						</Pressable>
						<Pressable onPress={handleSort}>
							<FontAwesome
								name={
									sortOrder === "asc" ? "sort-alpha-asc" : "sort-alpha-desc"
								}
								color={colors.iconColor}
								size={40}
							/>
						</Pressable>
					</View>
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
						onPress={() => dispatch(filterResults(filterValue))}
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
						onPress={() => dispatch(resetResults())}
					>
						<FontAwesome6 name="arrow-rotate-left" color={colors.iconColor} />
					</Pressable>
				</View>
			)}

			<Link to={`/${AppPath.Statistics}`} style={{ color: colors.primary }}>
				Ваша статистика
			</Link>

			<FlatList
				data={Object.entries(groupedResults)}
				keyExtractor={(item) => item[0]}
				renderItem={({ item }) => (
					<View style={{ marginBottom: 20 }}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								style={{
									fontSize: 25,
									color: colors.lightBackground,
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								{item[0]}
							</Text>
							<ThemeText style={{ fontSize: 20 }}>
								{" "}
								- {item[1].length} занять
							</ThemeText>
						</View>
						{item[1].map((result) => (
							<Link
								key={result.id}
								style={[
									styles.itemContainer,
									{ backgroundColor: colors.lightBackground },
								]}
								to={{
									screen: AppPath.ResultDetails,
									params: { resultId: result.id },
								}}
							>
								<View style={styles.flex}>
									<Text
										style={{
											color: colors.primary,
											fontWeight: "bold",
											fontSize: 30,
										}}
									>
										{isTitleDate(result.title)
											? new Date(result.createdAt).toLocaleTimeString()
											: result.title}
									</Text>
									{!isTitleDate(result.title) && (
										<Text style={{ color: colors.primary }}>
											{new Date(result.createdAt).toLocaleTimeString()}{" "}
										</Text>
									)}
								</View>
							</Link>
						))}
					</View>
				)}
				contentContainerStyle={{ paddingBottom: 20 }}
			/>
		</ThemeBackground>
	);
};

export default ResultsScreen;
