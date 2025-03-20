import React, { useEffect, useMemo, useState, useRef } from "react";
import { FlatList, Pressable, View, Animated } from "react-native";
import { useSelector } from "react-redux";
import ThemeText from "../../../common/components/ThemeText/ThemeText";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { selectCard } from "../../../redux/cardReducer/cardSlice";
import styles from "./LearnCheck.styles";

const LearnCheck = ({ onComplete, handleSetDate }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const cards = useSelector(selectCard);

	const initialWords = useMemo(
		() =>
			cards
				.map((card) => card.word)
				.slice(0, 4)
				.sort(() => Math.random() - 0.5),
		[cards],
	);
	const initialAnswers = useMemo(
		() =>
			cards
				.map((card) => card.translateWord)
				.slice(0, 4)
				.sort(() => Math.random() - 0.5),
		[cards],
	);

	const [selectedWord, setSelectedWord] = useState(null);
	const [wrongAnswer, setWrongAnswer] = useState(null);
	const [words, setWords] = useState(initialWords);
	const [answers, setAnswers] = useState(initialAnswers);
	const [answeredWords, setAnsweredWords] = useState([...initialWords]); // it's current words + words that left to learn
	const [learnedWords, setLearnedWords] = useState([]); // it's only learned words

	const [animateNewWord, setAnimateNewWord] = useState(null);
	const [animateNewAnswer, setAnimateNewAnswer] = useState(null);

	const newFadeAnim = useRef(new Animated.Value(1)).current;

	const maxWordLen = cards.map((card) => card.word.length);
	const maxWordWidth = Math.max(...maxWordLen);

	const getNewWord = () => {
		const remainingWords = cards.filter(
			(card) => !answeredWords.includes(card.word),
		);
		if (remainingWords.length === 0) return null; // Avoid infinite loop

		return remainingWords[Math.floor(Math.random() * remainingWords.length)];
	};

	const checkSelectedWordCorrect = (translation) => {
		if (!selectedWord) return;

		const currentCard = cards.find((card) => card.word === selectedWord);
		const correctTranslation = cards.find(
			(card) => card.word === selectedWord,
		)?.translateWord;

		if (translation === correctTranslation) {
			const wordIndex = words.indexOf(selectedWord);
			const translationIndex = answers.indexOf(translation);

			handleSetDate(currentCard, true);
			setLearnedWords((prev) => [...prev, selectedWord]);
			setSelectedWord(null);

			const newCard = getNewWord();
			if (!newCard) return;
			const newWords = [...words];
			const newAnswers = [...answers];

			newWords[wordIndex] = newCard.word;
			newAnswers[translationIndex] = newCard.translateWord;

			setAnsweredWords((prev) => [...prev, newCard.word]);
			setWords(newWords);
			setAnswers(newAnswers);

			setAnimateNewAnswer(newCard.word);
			setAnimateNewAnswer(newCard.translateWord);

			newFadeAnim.setValue(0);
			Animated.timing(newFadeAnim, {
			toValue: 1,
			duration: 4000,
			useNativeDriver: true,
			}).start(() => {
			// Clear animate markers after the animation completes.
			setAnimateNewWord(null);
			setAnimateNewAnswer(null);
			});
		} else {
			setWrongAnswer(translation);
			handleSetDate(currentCard, false);
			setTimeout(() => {
				setWrongAnswer(null);
			}, 1000);
		}
	};

	useEffect(() => {
		if (learnedWords.length === cards.length) {
			onComplete();
		}
	}, [learnedWords]);

	const isAllCardsLearned = answeredWords.length === cards.length;
	const isTranslateDisappear = (item) => {
		const word = cards.find((card) => card.translateWord === item)?.word;
		return learnedWords.includes(word);
	};

	const renderWordItem = ({ item }) => {
		const animatedStyle =
      animateNewWord && animateNewWord === item
        ? { opacity: newFadeAnim }
        : {};
		return (
			<Animated.View style={animatedStyle}>
				<Pressable
						key={item}
						onPress={() => setSelectedWord(item)}
						style={[
							styles.optionItem,
							{
								width: maxWordWidth * 20,
								backgroundColor:
									selectedWord === item ? "#38809b" : colors.lightBackground,
								opacity:
									isAllCardsLearned && learnedWords.includes(item) ? 0 : 1,
							},
						]}
					>
						<ThemeText style={{ fontSize: 30 }}>{item}</ThemeText>
					</Pressable>
			</Animated.View>
		)
	}

	const renderAnswerItem = ({ item }) => {
		const animatedStyle =
      animateNewAnswer && animateNewAnswer === item
        ? { opacity: newFadeAnim }
        : {};
		return (
			<Animated.View style={animatedStyle}>
				<Pressable
						key={item}
						style={[
							styles.optionItem,
							{
								width: maxWordWidth * 20,
								backgroundColor:
									wrongAnswer === item ? "red" : colors.lightBackground,
								opacity:
									isAllCardsLearned && isTranslateDisappear(item) ? 0 : 1,
							},
						]}
						onPress={() => checkSelectedWordCorrect(item)}
					>
						<ThemeText style={{ fontSize: 30 }}>{item}</ThemeText>
					</Pressable>
			</Animated.View>
		)
	}

	return (
		<View style={styles.optionsContainer}>
			<FlatList
				data={words}
				keyExtractor={(item) => item}
				renderItem={renderWordItem}
				contentContainerStyle={styles.listContainer}
			/>
			<FlatList
				data={answers}
				keyExtractor={(item) => item}
				renderItem={renderAnswerItem}
				contentContainerStyle={styles.listContainer}
			/>
		</View>
	);
};

export default LearnCheck;
