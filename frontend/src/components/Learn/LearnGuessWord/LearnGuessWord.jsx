import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Image, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./LearnGuessWord.styles";
import { useSelector } from "react-redux";
import { selectCard } from "../../../redux/cardReducer/cardSlice";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import ProgressContainer from "../../ProgressContainer/ProgressContainer";

const LearnGuessWord = ({ onComplete, handleSetDate }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const cards = useSelector(selectCard);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentGuess, setCurrentGuess] = useState([]);
	const [scrambledWord, setScrambledWord] = useState([]);
	const [letterColors, setLetterColors] = useState({});
	const [inCorrectLetter, setInCorrectLetter] = useState(null);
	const [showTranslate, setShowTranslate] = useState(false);
	const [correctAnswers, setCorrectAnswers] = useState([]);
	const currentCard = cards[currentIndex];
	const currentWord = currentCard?.word;

	useEffect(() => {
		if (currentWord) {
			generateScrambledWord(currentWord);
			const dashes = generateDashes(currentWord);
			setCurrentGuess(dashes);
		}
	}, [currentWord]);

	const generateDashes = (word) => {
		return Array(word.length).fill("_"); // Create an array of underscores representing dashes
	};

	const generateScrambledWord = (word) => {
		const wordArray = word.split("");
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

	const getRandomInt = (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	const getRandomLetter = () => {
		const alphabet = "abcdefghijklmnopqrstuvwxyz";
		return alphabet[getRandomInt(0, alphabet.length - 1)];
	};

	const handleLetterSelection = (letter, index) => {
		const firstDashIndex = currentGuess.indexOf("_");
		if (letter === currentWord[firstDashIndex]) {
			setCurrentGuess(currentGuess + letter);
			const updatedGuess = [...currentGuess];
			updatedGuess[firstDashIndex] = letter;
			setCurrentGuess(updatedGuess);
			removeLetterFromScrambled(index);
			setCorrectAnswers((prevState) => [...prevState, true]);
			handleSetDate(currentCard, true);
		} else {
			highlightIncorrectLetter(index);
			handleSetDate(currentCard, false);
		}
	};

	const removeLetterFromScrambled = useCallback((index) => {
		const updatedWord = [...scrambledWord];
		updatedWord.splice(index, 1);
		setScrambledWord(updatedWord);
	}, [scrambledWord]);

	const highlightIncorrectLetter = useCallback((index) => {
		setLetterColors({ [index]: "red" });
		setInCorrectLetter(currentWord[index]);
		setTimeout(() => setLetterColors({}), 1000);
	}, [currentWord[currentIndex]]);

	useEffect(() => {
		if (currentGuess.join("") === currentWord) {
			if (currentIndex < cards.length - 1) {
				setCurrentIndex(currentIndex + 1);
				resetGameState();
			} else {
				onComplete();
			}
		}
	}, [currentGuess, currentWord, currentIndex, onComplete]);

	const resetGameState = () => {
		setCurrentGuess([]);
		setLetterColors({});
	};

	if (Platform.OS === "web") {
		useEffect(() => {
			const handleKeyDown = (event) => {
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
					handleSetDate(currentCard, true);
				} else {
					highlightIncorrectLetter(letterIndex);
					handleSetDate(currentCard, false);
				}
			};

			window.addEventListener("keydown", handleKeyDown);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, [currentGuess, currentWord, scrambledWord, currentCard, handleSetDate, highlightIncorrectLetter, removeLetterFromScrambled]);
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
				keyExtractor={(item, index) => index.toString()}
				scrollEnabled={true}
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
