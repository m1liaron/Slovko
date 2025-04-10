import type { AppPath } from "@/common/enums/app/AppPath";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type { RootStackParamList } from "@/navigation/ProtectedRoute/ProtectedRoute";
import type { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState, useMemo } from "react";
import { ActivityIndicator, FlatList, Platform, Text, View } from "react-native";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { getResultDetails } from "../../redux/resultReducer/resultSlice";
import formatDMTDate from "../../utils/formatDMTDate";
import { formatTime } from "../../utils/formatTime";
import styles from "./ResultDetailsScreen.styles";
import { IResultMode, IWord, ModeName, Modes } from "@/common/enums/types/types";
import ThemeText from "@/common/components/ThemeText/ThemeText";

type ResultDetailsScreenProps = StackScreenProps<
	RootStackParamList,
	typeof AppPath.ResultDetails
>;

const ResultDetailsScreen: React.FC<ResultDetailsScreenProps> = ({ route }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { resultId } = route.params as { resultId: string };
	const { result, isLoading } = useAppSelector((state) => state.results);
	const dispatch = useAppDispatch();
	const [selectedMode, setSelectedMode] = useState<ModeName>("flashCards"); // 0 - flashCards, 1 - quiz, 2 - guessWord

	useEffect(() => {
		dispatch(getResultDetails(resultId));
	}, [dispatch, resultId]);

	const modesMap = useMemo((): Partial<Record<ModeName, IResultMode>> => {
		if (!result?.mode) return {};
		return result.mode.reduce((acc, modeItem) => {
		  const modeKey = modeItem.mode as ModeName;
		  acc[modeKey] = modeItem;
		  return acc;
		}, {} as Partial<Record<ModeName, IResultMode>>);
	  }, [result?.mode]);

	  if (!result) {
		return <ActivityIndicator />;
	}

	const resultTime =
		new Date(result.completionTime).getTime() -
		new Date(result.startedLearn).getTime();
	const formattedTime = formatTime(resultTime);

	const calculateCorrectPercentage = (): number => {
		const words: IWord[] = modesMap[selectedMode]?.words || [];
		const totalWords = words.length;
		const correctWords = words.filter(
			(word) => word.mistakesAmount === 0,
		).length;
		return totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
	};

	const correctPercentage = calculateCorrectPercentage();

	const modesOptionsButtons: { key: ModeName; label: string }[] = [
		{ key: "flashCards", label: "Картки" },
		{ key: "check", label: "Вибери переклад" },
		{ key: "quiz", label: "Вікторина" },
		{ key: "guessWord", label: "Вгадай слово" },
	  ];

	  const renderModeButtons = () => {
		return modesOptionsButtons
		  .filter(
			(modeOption) =>
			  modesMap[modeOption.key] && 
			  Boolean(modesMap[modeOption.key]?.words?.length)
		  )
		  .map((modeOption) => (
			<PressableButton
			  key={modeOption.key}
			  text={modeOption.label}
			  buttonStyle={{
				backgroundColor:
				  selectedMode === modeOption.key ? "#004da4" : "#007AFF",
				padding: 4,
			  }}
			  onPress={() => setSelectedMode(modeOption.key)}
			/>
		  ));
	};

	const title = new Date(result.title);
	const isTitleNotDate = isNaN(title.getTime())

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
			  {isTitleNotDate && (
				<ThemeText style={[styles.title]}>
				  {result.title}
				</ThemeText>
			  )}
			  <View
				style={[
				  styles.wastedTimeContainer,
				  { borderColor: colors.primary },
				]}
			  >
				<ThemeText style={[styles.title]}>
				  {formattedTime}
				</ThemeText>
			  </View>
			</View>
			{Platform.OS === "web" && (
				<ThemeText style={[styles.title]}>
					{formatDMTDate(result.createdAt)}
				</ThemeText>
			)} 
		  </View>
	
		  <View
			style={{
			  borderWidth: 4,
			  borderColor: "#fff",
			  backgroundColor: "#40FF80",
			  borderRadius: 100,
			  padding: 10,
			  alignSelf: "center",
			  marginVertical: 20,
			}}
		  >
			<Text style={{ fontSize: 25, color: "#fff" }}>
			  {correctPercentage}% Вірно
			</Text>
		  </View>
	
		  <View style={{ marginHorizontal: 50 }}>
			<View style={styles.buttonsContainer}>{renderModeButtons()}</View>
			{isLoading && <Loading />}
			{modesMap[selectedMode] && (
			  <FlatList
				style={{ height: 400, width: "100%" }}
				data={modesMap[selectedMode]?.words}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
				  <View
					style={[
					  styles.itemContainer,
					  { backgroundColor: colors.lightBackground },
					]}
				  >
					<View style={styles.resultContainer}>
					  <ThemeText style={[styles.title]}>
						{item.word} - {item.translate}
					  </ThemeText>
					</View>
					<View style={styles.mistakesAmountContainer}>
					  <ThemeText style={[styles.title]}>
						{item.mistakesAmount}
					  </ThemeText>
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
