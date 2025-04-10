import type React from "react";
import { useEffect, useState } from "react";
import styles from "./LearnScreen.styles";

import type { ResultsCard } from "@/common/enums/types/result.type";
import type { ICard } from "@/common/enums/types/types";
import LearnCheck from "@/components/Learn/LearnCheck/LearnCheck";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type {
	RootStackParamList,
	StackNavigation,
} from "@/navigation/ProtectedRoute/ProtectedRoute";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { Platform, Pressable, Text, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import { AppPath, DataStatus } from "../../common/enums/app/app";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import LearnCards from "../../components/Learn/LearnCards/LearnCards";
import LearnGuessWord from "../../components/Learn/LearnGuessWord/LearnGuessWord";
import LearnQuiz from "../../components/Learn/LearnQuiz/LearnQuiz";
import Loading from "../../components/Loading";
import ExitModal from "../../components/Modals/ExitModal/ExitModal";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	getRepeatedCards,
	updateCardsAfterLearn,
} from "../../redux/cardReducer/cardSlice";
import { selectGroup } from "../../redux/groupReducer/groupSlice";
import { saveResults } from "../../redux/resultReducer/resultSlice";
import { updateUserStreak } from "../../redux/userReducer/userSlice";
import { formatTime } from "../../utils/formatTime";

type Section = "cards" | "quiz" | "word" | "check" | "finish";

interface SectionOption {
	text: string;
	iconName: keyof typeof MaterialIcons.glyphMap;
	state: boolean;
	changeState: React.Dispatch<React.SetStateAction<boolean>>;
	sectionName: Section;
}

type LearnScreenProps = StackScreenProps<
	RootStackParamList,
	typeof AppPath.Learn
>;

const LearnScreen: React.FC<LearnScreenProps> = ({ route }) => {
	const { theme } = useAppTheme();
	const groupId = (route.params as { groupId?: string | undefined })?.groupId;
	const groups = useAppSelector(selectGroup);
	const dispatch = useAppDispatch();
	const navigation = useNavigation<StackNavigation>();
	const { repeatedCards, cards, status } = useAppSelector(
		(state) => state.cards,
	);

	// Section State
	const [isLessonOver, setIsLessonOver] = useState<boolean>(false);
	const [currentSection, setCurrentSection] = useState<Section>("cards");
	const [finishedSections, setFinishedSections] = useState<Section[]>([]);

	// Modes Toggles
	const [isQuizEnabled, setIsQuizEnabled] = useState<boolean>(true);
	const [isGuessWordEnabled, setIsGuessWordEnabled] = useState<boolean>(true);
	const [isCheckEnabled, setIsCheckEnabled] = useState<boolean>(true);
	const [showExitModal, setShowExitModal] = useState<boolean>(false);
	const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

	// Cards State
	const [flashCards, setFlashCards] = useState<ResultsCard[]>([]);
	const [quizCards, setQuizCards] = useState<ResultsCard[]>([]);
	const [guessWordCards, setGuessWordCards] = useState<ResultsCard[]>([]);

	// Timing State
	const [startLearnDate, setStartLearnDate] = useState<Date>(new Date());
	const [elapsedTime, setElapsedTime] = useState<string>("");

	const projectName = groups?.find((group) => group.id === groupId)?.title;

	const toggleSwitch = (
		changeFunction: React.Dispatch<React.SetStateAction<boolean>>,
	) => changeFunction((previousState) => !previousState);

	const handleNextSection = () => {
		const transitions: Record<Section, Section> = {
			cards: isQuizEnabled ? "quiz" : isGuessWordEnabled ? "word" : "finish",
			quiz: isGuessWordEnabled ? "word" : "finish",
			word: isCheckEnabled ? "check" : "finish",
			check: "finish",
			finish: "finish",
		};
		const nextSection = transitions[currentSection] || "finish";
		if (nextSection === "finish") {
			finishLesson();
		} else {
			setFinishedSections((prev) => [...prev, currentSection]);
			setCurrentSection(nextSection);
		}
	};

	const handleSetData = (card: ICard, isCorrect: boolean) => {
		const updateOrAddCard = (
			cards: ResultsCard[],
			setCards: React.Dispatch<React.SetStateAction<ResultsCard[]>>,
		) => {
			const newCard = {
				wordId: card.id,
				word: card.word,
				translateWord: card.translateWord,
				mistakesAmount: isCorrect ? 0 : 1,
			};

			setCards((prev) => {
				const existingCardIndex = prev.findIndex(
					(item) => item.wordId === card.id,
				);
				if (existingCardIndex !== -1) {
					if (isCorrect) return prev;
					// If card exists, increment mistakesAmount
					const updatedCards = [...prev];
					updatedCards[existingCardIndex] = {
						...updatedCards[existingCardIndex],
						mistakesAmount: updatedCards[existingCardIndex].mistakesAmount + 1,
					};
					return updatedCards;
				}
				return [...prev, newCard];
			});
		};

		if (currentSection === "cards") {
			updateOrAddCard(flashCards, setFlashCards);
		} else if (currentSection === "quiz") {
			updateOrAddCard(quizCards, setQuizCards);
		} else if (currentSection === "word") {
			updateOrAddCard(guessWordCards, setGuessWordCards);
		}
	};

	const handleSaveResults = () => {
		const resultData = {
			title: projectName || new Date(),
			flashCards,
			quiz: quizCards,
			guessWord: guessWordCards,
			startedLearn: startLearnDate,
			completionTime: new Date(),
		};
		dispatch(saveResults(resultData));
	};

	const finishLesson = () => {
		setIsQuizEnabled(true);
		setIsGuessWordEnabled(true);
		setShowSettingsModal(false);
		setFinishedSections([]);
		setCurrentSection("cards");
		setIsLessonOver(true);

		const endLearnDate = new Date().getTime();
		const totalLearnedTime = endLearnDate - startLearnDate.getTime(); // in milliseconds
		setElapsedTime(formatTime(totalLearnedTime));

		const repeatedCardsIds = cards?.map((card) => card.id);
		dispatch(updateCardsAfterLearn(repeatedCardsIds));

		dispatch(updateUserStreak());
		handleSaveResults();
		if (repeatedCards.length) {
			dispatch(getRepeatedCards());
		}
	};

	const leaveStudy = () => {
		navigation.navigate(AppPath.Main);
	};

	const switchSection = (
		changeState: React.Dispatch<React.SetStateAction<boolean>>,
		sectionName: string,
	) => {
		toggleSwitch(changeState);

		if (currentSection === sectionName) {
			handleNextSection();
		}
	};

	const generateSectionContent = () => {
		const sections: SectionOption[] = [
			{
				text: "Quiz mode",
				iconName: "quiz",
				state: isQuizEnabled,
				changeState: setIsQuizEnabled,
				sectionName: "quiz",
			},
			{
				text: "Guess Word mode",
				iconName: "wordpress",
				state: isGuessWordEnabled,
				changeState: setIsGuessWordEnabled,
				sectionName: "word",
			},
			{
				text: "Check Translate mode",
				iconName: "checklist",
				state: isCheckEnabled,
				changeState: setIsCheckEnabled,
				sectionName: "check",
			},
		];

		return sections.map(
			({ iconName, text, state, changeState, sectionName }) => (
				<View style={styles.sectionContainer} key={text}>
					<View style={styles.sectionContainer}>
						<MaterialIcons
							name={iconName}
							size={30}
							color={theme.colors.iconColor}
						/>
						<Text style={{ color: theme.colors.primary }}>{text}</Text>
					</View>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						thumbColor={state ? "#f5dd4b" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={() => switchSection(changeState, sectionName)}
						value={state}
					/>
				</View>
			),
		);
	};

	if (Platform.OS === "web") {
		useEffect(() => {
			const handleBeforeUnload = (event: BeforeUnloadEvent) => {
				event.preventDefault();

				return "Ваш прогрес буде не збережен, якщо ви покинете цю сторінку.";
			};

			window.addEventListener("beforeunload", handleBeforeUnload);

			return () => {
				window.removeEventListener("beforeunload", handleBeforeUnload);
			};
		}, []);
	}

	const resultsData = [...flashCards, ...quizCards, ...guessWordCards];
	const correctAnswersAmount = resultsData.filter(
		(item) => item.mistakesAmount === 0,
	).length;
	const accuracy = Math.floor(
		(correctAnswersAmount / resultsData.length) * 100,
	);

	return (
		<ThemeBackground>
			<View style={{ padding: 20 }}>
				{!isLessonOver ? (
					<View style={{ justifyContent: "center", paddingHorizontal: 20 }}>
						<Pressable onPress={() => setShowExitModal(true)}>
							<Entypo name="cross" size={35} color={theme.colors.iconColor} />
						</Pressable>

						{status === DataStatus.PENDING ? (
							<Loading />
						) : (
							<View style={styles.centeredContainer}>
								{currentSection === "cards" && (
									<LearnCards
										onComplete={handleNextSection}
										setFlashCards={handleSetData}
									/>
								)}
								{currentSection === "quiz" && isQuizEnabled && (
									<LearnQuiz
										onComplete={handleNextSection}
										handleSetData={handleSetData}
									/>
								)}
								{currentSection === "word" && isGuessWordEnabled && (
									<LearnGuessWord
										onComplete={handleNextSection}
										handleSetData={handleSetData}
									/>
								)}

								{currentSection === "check" && isCheckEnabled && (
									<LearnCheck
										onComplete={handleNextSection}
										handleSetData={handleSetData}
									/>
								)}

								<Pressable
									onPress={() => toggleSwitch(setShowSettingsModal)}
									style={{ alignSelf: "flex-start" }}
								>
									<AntDesign
										name="setting"
										size={30}
										color={theme.colors.iconColor}
									/>
								</Pressable>
							</View>
						)}

						<ExitModal
							modalVisible={showExitModal}
							handleClose={() => setShowExitModal(false)}
							text="Вийти з навчання та втратити прогрес?"
						/>

						<DefaultModal
							isVisible={showSettingsModal}
							handleClose={() => toggleSwitch(setShowSettingsModal)}
							modalStyle={{
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}}
						>
							{generateSectionContent()}
						</DefaultModal>
					</View>
				) : (
					<>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								gap: 10,
							}}
						>
							<Text
								style={{
									color: theme.colors.primary,
									textAlign: "center",
									fontSize: 30,
								}}
							>
								Молодець! Гарно позаймався/лась
							</Text>

							<View style={{ marginBottom: 30 }}>
								<View
									style={[
										styles.resultItemContainer,
										{ borderColor: theme.colors.primary },
									]}
								>
									<Text style={{ color: theme.colors.primary, fontSize: 30 }}>
										{elapsedTime}
									</Text>
								</View>

								<View
									style={[
										styles.resultItemContainer,
										{ borderColor: theme.colors.primary },
									]}
								>
									<Text style={{ color: theme.colors.primary, fontSize: 30 }}>
										{correctAnswersAmount * 10} очок
									</Text>
								</View>
								<View
									style={[
										styles.resultItemContainer,
										{ borderColor: theme.colors.primary },
									]}
								>
									<Text style={{ color: theme.colors.primary, fontSize: 30 }}>
										{accuracy}% точність
									</Text>
								</View>
							</View>
						</View>
						<PressableButton text="Продовжити" onPress={leaveStudy} />
					</>
				)}
			</View>
		</ThemeBackground>
	);
};

export default LearnScreen;
