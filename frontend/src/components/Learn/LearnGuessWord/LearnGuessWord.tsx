import type { ICard } from "@/common/enums/types/card.type";
import { useAppSelector } from "@/hooks/redux.hooks";
import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, Text, View } from "react-native";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { selectCard } from "../../../redux/cardReducer/cardSlice";
import ProgressContainer from "../../ProgressContainer/ProgressContainer";
import styles from "./LearnGuessWord.styles";

interface LetterColors {
	[key: number]: string;
}

interface LearnGuessWordProps {
	onComplete: () => void;
	handleSetData: (card: ICard, isCorrect: boolean) => void;
}

const LearnGuessWord = ({ onComplete, handleSetData }: LearnGuessWordProps) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const cards = useAppSelector(selectCard);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [currentGuess, setCurrentGuess] = useState<string[]>([]);
	const [scrambledWord, setScrambledWord] = useState<string[]>([]);
	const [letterColors, setLetterColors] = useState<LetterColors>({});
	const [inCorrectLetter, setInCorrectLetter] = useState<string | null>(null);
	const [showTranslate, setShowTranslate] = useState<boolean>(false);
	const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
	const currentCard = cards[currentIndex];
	const currentWord: string = currentCard?.word;

	useEffect(() => {
		if (currentWord) {
			generateScrambledWord(currentWord);
			const dashes = generateDashes(currentWord);
			setCurrentGuess(dashes);
		}
	}, [currentWord]);

	const generateDashes = (word: string): string[] =>
		Array(word.length).fill("_"); // Create an array of underscores representing dashes

	const generateScrambledWord = (word: string) => {
		const wordArray: string[] = word.split("");
		for (let i = 0; i < 3; i++) {
			const randomLetter = getRandomLetter();
			const randomIndex = getRandomInt(0, wordArray.length);
			wordArray.splice(randomIndex, 0, randomLetter);
		}

		for (let i = wordArray.length - 1; i >= 0; i--) {
			const j = getRandomInt(0, i);

			[wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
		}

		setScrambledWord(wordArray);
	};

	const getRandomInt = (min: number, max: number) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	const getRandomLetter = () => {
		const alphabet = "abcdefghijklmnopqrstuvwxyz";
		return alphabet[getRandomInt(0, alphabet.length - 1)];
	};

	const handleLetterSelection = (letter: string, index: number) => {
		const firstDashIndex = currentGuess.indexOf("_");
		if (letter === currentWord[firstDashIndex]) {
			const updatedGuess = [...currentGuess];
			updatedGuess[firstDashIndex] = letter;
			setCurrentGuess(updatedGuess);
			removeLetterFromScrambled(index);
			setCorrectAnswers((prevState) => [...prevState, true]);
			handleSetData(currentCard, true);
		} else {
			highlightIncorrectLetter(index);
			handleSetData(currentCard, false);
		}
	};

	const removeLetterFromScrambled = useCallback(
		(index: number) => {
			const updatedWord = [...scrambledWord];
			updatedWord.splice(index, 1);
			setScrambledWord(updatedWord);
		},
		[scrambledWord],
	);

	const highlightIncorrectLetter = useCallback(
		(index: number) => {
			setLetterColors({ [index]: "red" });
			setInCorrectLetter(currentWord[index]);
			setTimeout(() => setLetterColors({}), 1000);
		},
		[currentWord[currentIndex]],
	);

	useEffect(() => {
		if (currentGuess.join("") === currentWord) {
			if (currentIndex < cards.length - 1) {
				setCurrentIndex(currentIndex + 1);
				resetGameState();
			} else {
				onComplete();
			}
		}
	}, [currentGuess, currentWord, currentIndex, onComplete, cards.length]);

	const resetGameState = () => {
		setCurrentGuess([]);
		setLetterColors({});
	};

	if (Platform.OS === "web") {
		useEffect(() => {
			const handleKeyDown = (event: KeyboardEvent) => {
				const pressedLetter = event.key;
				if (event.key === "Shift") return;
				const firstDashIndex = currentGuess.indexOf("_");
				const expectedLetter = currentWord[firstDashIndex];

				const isUppercase = event.shiftKey;
				const targetLetter = isUppercase
					? pressedLetter.toUpperCase()
					: pressedLetter.toLowerCase();

				const letterIndex = scrambledWord.indexOf(targetLetter);
				if (targetLetter === expectedLetter) {
					const updatedGuess = [...currentGuess];
					updatedGuess[firstDashIndex] = targetLetter; // Update the guess
					setCurrentGuess(updatedGuess);

					if (letterIndex !== -1) {
						removeLetterFromScrambled(letterIndex);
					}

					setCorrectAnswers((prevState) => [...prevState, true]);
					handleSetData(currentCard, true);
				} else {
					highlightIncorrectLetter(letterIndex);
					handleSetData(currentCard, false);
				}
			};

			window.addEventListener("keydown", handleKeyDown);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, [
			currentGuess,
			currentWord,
			scrambledWord,
			currentCard,
			handleSetData,
			highlightIncorrectLetter,
			removeLetterFromScrambled,
		]);
	}
	return (
		<>
			<ProgressContainer index={currentIndex} length={cards.length} />
			<Text style={{ fontSize: 50, fontWeight: "bold", color: colors.primary }}>
				{currentGuess.join(" ")}
			</Text>
			<View>
				{currentCard.image?.url ? (
					<Image
						source={{ uri: currentCard.image.url.toString() }}
						style={{
							width: 200,
							height: 200,
							borderRadius: 10,
							marginVertical: 20,
							borderWidth: 5,
							borderColor: "#000",
						}}
					/>
				) : null}
			</View>

			<FlatList
				numColumns={4}
				data={scrambledWord}
				contentContainerStyle={styles.wordContainer}
				keyExtractor={(item, index) => index.toString()}
				scrollEnabled={true}
				renderItem={({ item, index }) => (
					<Pressable
						style={[
							styles.word,
							{
								backgroundColor: letterColors[index] || "transparent",
								borderColor: colors.primary,
							},
						]}
						onPress={() => handleLetterSelection(item, index)}
					>
						<Text
							style={[
								styles.wordText,
								{
									color:
										letterColors[index] === "red" ? "#fff" : colors.primary,
								},
							]}
						>
							{item}
						</Text>
					</Pressable>
				)}
			/>
			<Pressable onPress={() => setShowTranslate(!showTranslate)}>
				<AntDesign name="questioncircleo" size={24} color={colors.iconColor} />
			</Pressable>
			{showTranslate && (
				<Text
					style={{ fontSize: 30, fontWeight: "bold", color: colors.primary }}
				>
					{currentCard.translateWord}
				</Text>
			)}
		</>
	);
};

export default LearnGuessWord;
