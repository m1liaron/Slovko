import ThemeText from "@/common/components/ThemeText/ThemeText";
import type { IResult } from "@/common/enums/types/result.type";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Link, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { AppPath } from "../../common/enums/app/app";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	filterResults,
	getResults,
	resetResults,
	sortResults,
} from "../../redux/resultReducer/resultSlice";
import styles from "./ResultsScreen.styles";

type GroupedResults = {
	[date: string]: IResult[];
};

const ResultsScreen = () => {
	const dispatch = useAppDispatch();
	const {
		theme: { colors },
	} = useAppTheme();
	const { results, haveMoreResults, isLoading } = useAppSelector((state) => state.results);
	const navigation = useNavigation<StackNavigation>();
	const [filterValue, setFilterValue] = useState<string>("");
	const [showFilterInput, setShowFilterInput] = useState(false);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [groupedResults, setGroupedResults] = useState<GroupedResults>({});
	const [showResultsMonth, setShowResultsMonth] = useState<number>(
		new Date().getMonth() + 1,
	);
	const [showResultsYear, setShowResultsYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [page, setPage] = useState(1);

	useEffect(() => {
		if (results.length > 0) {
			const groupedData = groupResultsByDay(results);
			setGroupedResults(groupedData);
		}
	}, [results]);

	const groupResultsByDay = (results: IResult[]): GroupedResults => {
		return results.reduce<GroupedResults>((groups, item) => {
			const date = new Date(item.createdAt).toISOString().split("T")[0]; // Format as YYYY-MM-DD
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(item);
			return groups;
		}, {});
	};

	useEffect(() => {
		setPage(1);
		dispatch(getResults({ year: showResultsYear, month: showResultsMonth, page: 1 }));
	}, [dispatch, showResultsMonth, showResultsYear]);

	const handleLoadMore = () => {
		if(haveMoreResults && !isLoading) {
			const nextPage = page + 1;
			dispatch(getResults({ year: showResultsYear, month: showResultsMonth, page: nextPage }));
			setPage(nextPage);
		}
	}

	const handleSort = () => {
		dispatch(sortResults({ key: "title", direction: sortOrder }));
		setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
	};

	const renderFooter = () => isLoading ? (
		<View style={{ paddingVertical: 20 }}>
			<ActivityIndicator size="large" color={colors.primary} />
		</View>
	) : null

	return (
		<ThemeBackground>
			<View style={{ justifyContent: "center" }}>
				<View style={styles.header}>
					<ThemeText style={{ fontSize: 40, fontWeight: "bold" }}>
						{new Date().getFullYear()}
					</ThemeText>
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
							alignSelf: "flex-end",
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
							alignSelf: "flex-end",
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
							alignSelf: "flex-end",
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
				renderItem={({ item }: { item: [string, IResult[]] }) => (
					<View style={{ marginBottom: 20 }}>
						<Text
							style={{
								fontSize: 25,
								color: colors.lightBackground,
								fontWeight: "bold",
								textAlign: "center",
							}}
						>
							{item[0]} {/* Date */}
						</Text>
						{item[1].map((result) => (
							<Pressable
								key={result.id}
								style={[
									styles.itemContainer,
									{ backgroundColor: colors.lightBackground },
								]}
								onPress={() =>
									navigation.navigate(AppPath.ResultDetails, {
										resultId: result.id,
									})
								}
							>
								<View style={styles.flex}>
									<Text
										style={{
											color: colors.primary,
											fontWeight: "bold",
											fontSize: 30,
										}}
									>
										{result.title}
									</Text>
									<Text style={{ color: colors.primary }}>
										{new Date(result.createdAt).toLocaleTimeString()}{" "}
										{/* Show time */}
									</Text>
								</View>
							</Pressable>
						))}
					</View>
				)}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.1}
				ListFooterComponent={renderFooter}
				contentContainerStyle={{ paddingBottom: 20 }}
			/>
		</ThemeBackground>
	);
};

export default ResultsScreen;
