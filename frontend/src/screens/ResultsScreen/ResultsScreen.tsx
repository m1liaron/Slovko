import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Pressable } from "react-native";
import styles from "./ResultsScreen.styles";
import {
	filterResults,
	getResults,
	resetResults,
	sortResults,
} from "../../redux/resultReducer/resultSlice";
import { Link } from "@react-navigation/native";
import { AppPath } from "../../common/enums/app/app";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useAppTheme } from "../../contexts/ThemeProvider";
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { IResult } from "@/common/enums/types/result.type";

type GroupedResults = {
	[date: string]: IResult[];
}

const ResultsScreen = () => {
	const dispatch = useAppDispatch();
	const { theme: { colors } } = useAppTheme();
	const { results } = useAppSelector((state) => state.results);
	const [filterValue, setFilterValue] = useState<string>("");
	const [showFilterInput, setShowFilterInput] = useState(false);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [groupedResults, setGroupedResults] = useState<GroupedResults>({});

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
		dispatch(getResults());
	}, [dispatch]);

	const handleSort = () => {
		dispatch(sortResults({ key: "title", direction: sortOrder }));
		setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
	};

	return (
		<ThemeBackground>
			<View style={{ justifyContent: "center" }}>
				<View style={styles.header}>
					<Text
						style={{ fontSize: 40, fontWeight: "bold", color: colors.primary }}
					>
						2024
					</Text>
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
				renderItem={({ item }: { item: [string, IResult[]]}) => (
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
							<Link
								key={result.id}
								style={[
									styles.itemContainer,
									{ backgroundColor: colors.lightBackground },
								]}
								to={`/${AppPath.ResultDetails}/${result.id}`}
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
