import ThemeText from "@/common/components/ThemeText/ThemeText";
import type { IResult } from "@/common/enums/types/result.type";
import { useLanguage } from "@/contexts/LanguageProvider";
import { enqueueOrDispatch } from "@/helpers/offlineHelpers/enqueueOrDispatch";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Link, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
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
	const { results, haveMoreResults, firstResult, isLoading } = useAppSelector(
		(state) => state.results,
	);
	useLanguage();
	const navigation = useNavigation<StackNavigation>();
	const [filterValue, setFilterValue] = useState<string>("");
	const [showFilterInput, setShowFilterInput] = useState(false);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [groupedResults, setGroupedResults] = useState<GroupedResults>({});
	const [showResultsMonth, setShowResultsMonth] = useState<number>(
		new Date().getMonth(),
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
		dispatch(
			enqueueOrDispatch(getResults, {
				year: showResultsYear,
				month: showResultsMonth + 1,
				page: 1,
				replace: true,
			}),
		);
	}, [dispatch, showResultsMonth, showResultsYear]);

	const handleLoadMore = () => {
		if (haveMoreResults && !isLoading) {
			const nextPage = page + 1;
			dispatch(
				enqueueOrDispatch(getResults, {
					year: showResultsYear,
					month: showResultsMonth + 1,
					page: nextPage,
					replace: false,
				}),
			);
			setPage(nextPage);
		}
	};

	const handleSort = () => {
		dispatch(sortResults({ key: "title", direction: sortOrder }));
		setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
	};

	const renderFooter = () =>
		isLoading ? (
			<View style={{ paddingVertical: 20 }}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		) : null;

	const monthes = i18n.t("resultsScreen.monthNames") as string[];
	const currentDate = new Date(showResultsYear, showResultsMonth);
	const firstResultDate = firstResult ? new Date(firstResult) : null;
	const moreFirstResult = firstResultDate
		? currentDate > firstResultDate
		: false;

	const currentMonth = new Date().getMonth();
	const currentYear = new Date().getFullYear();
	const lessCurrentMonth = currentDate < new Date(currentYear, currentMonth);

	const decShowMonth = () => {
		if (showResultsMonth > 0) {
			setShowResultsMonth(showResultsMonth - 1);
		} else if (showResultsMonth === 0 && moreFirstResult) {
			setShowResultsMonth(monthes.length - 1);
			setShowResultsYear(showResultsYear - 1);
		}
	};

	const incShowMonth = () => {
		if (showResultsMonth === monthes.length - 1) {
			setShowResultsYear(showResultsYear + 1);
			setShowResultsMonth(0);
		} else {
			setShowResultsMonth(showResultsMonth + 1);
		}
	};

	return (
		<ThemeBackground>
			<View style={{ justifyContent: "center" }}>
				<View style={styles.header}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<ThemeText style={{ fontSize: 40, fontWeight: "bold" }}>
							{showResultsYear} -
						</ThemeText>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							{moreFirstResult && (
								<Pressable onPress={decShowMonth}>
									<AntDesign
										name="caretleft"
										color={colors.primary}
										size={30}
									/>
								</Pressable>
							)}
							<ThemeText style={{ fontSize: 40, fontWeight: "bold" }}>
								{monthes[showResultsMonth]}
							</ThemeText>
							{lessCurrentMonth ? (
								<Pressable onPress={incShowMonth}>
									<AntDesign
										name="caretright"
										color={colors.primary}
										size={30}
									/>
								</Pressable>
							) : null}
						</View>
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
							alignSelf: "flex-end",
							color: colors.primary,
						}}
						placeholder={i18n.t("resultsScreen.filterPlaceholder")}
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
						<Text style={{ color: colors.primary }}>
							{i18n.t("resultsScreen.filterButton")}
						</Text>
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
				{i18n.t("resultsScreen.yourStats")}
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
