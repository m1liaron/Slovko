import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, Platform, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import styles from "./LearnScreen.styles";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import LearnCards from "../../components/Learn/LearnCards/LearnCards";
import LearnQuiz from "../../components/Learn/LearnQuiz/LearnQuiz";
import LearnGuessWord from "../../components/Learn/LearnGuessWord/LearnGuessWord";
import ExitModal from "../../components/Modals/ExitModal/ExitModal";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import Loading from "../../components/Loading";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";

import { useAppTheme } from "../../contexts/ThemeProvider";
import { selectGroup } from "../../redux/groupReducer/groupSlice";
import {
	getRepeatedCards,
	updateCardsAfterLearn,
	selectCard,
} from "../../redux/cardReducer/cardSlice";
import { saveResults } from "../../redux/resultReducer/resultSlice";
import { updateUserStreak } from "../../redux/userReducer/userSlice";
import { formatTime } from "../../utils/formatTime";
import { AppPath, DataStatus } from "../../common/enums/app/app";
import LearnCheck from '../../components/Learn/LearnCheck/LearnCheck';

/* Custom hook to warn before unload on web */
const useBeforeUnload = (message) => {
	useEffect(() => {
		if (Platform.OS !== "web") return;
		const handleBeforeUnload = (event) => {
			event.preventDefault();
			event.returnValue = message;
			return message;
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [message]);
};

/* Helper function to update or add a card to the results state */
const updateOrAddCard = (cardsArray, card, isCorrect) => {
	const existingCardIndex = cardsArray.findIndex(
		(item) => item.wordId === card.id
	);
	if (existingCardIndex !== -1) {
		if (isCorrect) return cardsArray;
		// Update mistakesAmount if the card already exists
		return cardsArray.map((item, index) =>
			index === existingCardIndex
				? { ...item, mistakesAmount: item.mistakesAmount + 1 }
				: item
		);
	}
	// Add new card result
	return [
		...cardsArray,
		{
			wordId: card.id,
			word: card.word,
			translateWord: card.translateWord,
			mistakesAmount: isCorrect ? 0 : 1,
		},
	];
};

const LearnScreen = ({ route }) => {
	const { theme } = useAppTheme();
	const { groupId } = route.params || {};
	const groups = useSelector(selectGroup);
	const { repeatedCards, cards, status } = useSelector((state) => state.cards);
	const dispatch = useDispatch();
	const navigation = useNavigation();

	// Lesson configuration and progress state
	const [isQuizEnabled, setIsQuizEnabled] = useState(true);
	const [isGuessWordEnabled, setIsGuessWordEnabled] = useState(true);
	const [isCheckModeEnabled, setIsCheckModeEnabled] = useState(true);
	const [showExitModal, setShowExitModal] = useState(false);
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [currentSection, setCurrentSection] = useState("cards");
	const [finishedSections, setFinishedSections] = useState([]);
	const [isLessonOver, setIsLessonOver] = useState(false);

	// Card result states for each mode
	const [flashCards, setFlashCards] = useState([]);
	const [quizCards, setQuizCards] = useState([]);
	const [guessWordCards, setGuessWordCards] = useState([]);
	const [checkCards, setCheckCards] = useState([]);
	const [startLearnDate, setStartLearnDate] = useState(null);
	const [elapsedTime, setElapsedTime] = useState("");

	// Memoize computed values
	const projectName = useMemo(
		() => groups?.find((group) => group.id === groupId)?.title,
		[groups, groupId]
	);
	const maxWordWidth = useMemo(
		() => Math.max(...cards.map((card) => card.word.length)) * 20,
		[cards]
	);

	// Set lesson start time
	useEffect(() => {
		setStartLearnDate(new Date());
	}, []);

	// Warn before leaving on web
	useBeforeUnload("Ваш прогрес буде не збережен, якщо ви покинете цю сторінку.");

	/* Toggle helper */
	const toggleSwitch = useCallback(
		(changeFunction) => changeFunction((prev) => !prev),
		[]
	);

	/* Determine next section */
	const handleNextSection = useCallback(() => {
		const transitions = {
			cards: isQuizEnabled ? "quiz" : isGuessWordEnabled ? "word" : "finish",
			quiz: isGuessWordEnabled ? "word" : "finish",
			word: isCheckModeEnabled ? "check" : "finish",
			check: finishedSections.includes("word") ? "finish" : "word",
		};

		const nextSection = transitions[currentSection] || "finish";
		if (nextSection === "finish") {
			finishLesson();
		} else {
			setFinishedSections((prev) => [...prev, currentSection]);
			setCurrentSection(nextSection);
		}
	}, [currentSection, isQuizEnabled, isGuessWordEnabled, finishedSections]);

	/* Update results based on current section */
	const handleSetData = useCallback(
		(card, isCorrect) => {
			switch (currentSection) {
				case "cards":
					setFlashCards((prev) => updateOrAddCard(prev, card, isCorrect));
					break;
				case "quiz":
					setQuizCards((prev) => updateOrAddCard(prev, card, isCorrect));
					break;
				case "word":
					setGuessWordCards((prev) => updateOrAddCard(prev, card, isCorrect));
					break;
				case "check":
					setCheckCards((prev) => updateOrAddCard(prev, card, isCorrect));
					break;
				default:
					break;
			}
		},
		[]
	);
	/* Save results and update user data */
	const handleSaveResults = useCallback(() => {
		const resultData = {
			title: projectName || new Date().toString(),
			flashCards,
			quiz: quizCards,
			guessWord: guessWordCards,
			check: checkCards,
			startedLearn: startLearnDate,
			completionTime: new Date(),
		};
		console.log(checkCards)
		dispatch(saveResults(resultData));
	}, [dispatch, projectName, flashCards, quizCards, guessWordCards, startLearnDate, checkCards]);

	/* Finish lesson: update state, dispatch actions and save results */
	const finishLesson = useCallback(() => {
		setIsQuizEnabled(true);
		setIsGuessWordEnabled(true);
		setShowSettingsModal(false);
		setFinishedSections([]);
		setCurrentSection("cards");
		setIsLessonOver(true);

		const endLearnDate = new Date();
		const totalLearnedTime = endLearnDate - startLearnDate;
		setElapsedTime(formatTime(totalLearnedTime));

		const repeatedCardsIds = cards?.map((card) => card.id);
		dispatch(updateCardsAfterLearn(repeatedCardsIds));
		dispatch(updateUserStreak());
		handleSaveResults();

		if (repeatedCards.length) {
			dispatch(getRepeatedCards());
		}
	}, [cards, dispatch, getRepeatedCards, handleSaveResults, repeatedCards, startLearnDate]);

	const leaveStudy = useCallback(() => {
		navigation.navigate(AppPath.Main);
	}, [navigation]);

	/* Switch section helper: toggles the mode and if the current section matches, proceed */
	const switchSection = useCallback(
		(changeState, sectionName) => {
			toggleSwitch(changeState);
			if (currentSection === sectionName) {
				handleNextSection();
			}
		},
		[currentSection, handleNextSection, toggleSwitch]
	);

	/* Generate settings modal content */
	const generateSectionContent = useCallback(() => {
		const sections = [
			{
				text: "Вікторина режим",
				iconName: "quiz",
				state: isQuizEnabled,
				changeState: setIsQuizEnabled,
				sectionName: "quiz",
			},
			{
				text: "Вгадай слова режим",
				iconName: "wordpress",
				state: isGuessWordEnabled,
				changeState: setIsGuessWordEnabled,
				sectionName: "word",
			},
			{
				text: "Обери вірний режим",
				iconName: "checklist",
				state: isCheckModeEnabled,
				changeState: setIsCheckModeEnabled,
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
			)
		);
	}, [isQuizEnabled, isGuessWordEnabled, switchSection, theme.colors]);

	/* Compute results */
	const resultsData = useMemo(
		() => [...flashCards, ...quizCards, ...guessWordCards],
		[flashCards, quizCards, guessWordCards]
	);
	const correctAnswersAmount = useMemo(
		() => resultsData.filter((item) => item.mistakesAmount === 0).length,
		[resultsData]
	);
	const accuracy = useMemo(
		() =>
			Math.floor(
				(correctAnswersAmount / (resultsData.length || 1)) * 100
			),
		[correctAnswersAmount, resultsData]
	);

	return (
		<ThemeBackground>
			<View>
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
										handleSetDate={handleSetData}
									/>
								)}

								{currentSection === "check" && isCheckModeEnabled && (
									<LearnCheck
										onComplete={handleNextSection}
										handleSetDate={handleSetData}
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
