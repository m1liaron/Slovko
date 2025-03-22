import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { selectCard } from "../../../redux/cardReducer/cardSlice";
import styles from "./LearnCards.styles";

const LearnCards = ({ onComplete, setFlashCards }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const cards = useSelector(selectCard);
	const [flippedIndex, setFlippedIndex] = useState(null);
	const [learningCards, setLearningCards] = useState([...cards]);
	const [showLeftSwipeView, setShowLeftSwipeView] = useState(false);
	const [showRightSwipeView, setShowRightSwipeView] = useState(false);
	const [flippedCards, setFlippedCards] = useState({});
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);

	const rotation = useSharedValue(0);

	const handleFlipCard = (index) => {
		setFlippedCards((prevFlippedCards) => {
			if (prevFlippedCards[index]) {
				return prevFlippedCards;
			}
			setFlippedIndex(index === flippedIndex ? null : index);
			rotation.value = withTiming(rotation.value === 0 ? 180 : 0, {
				duration: 500,
			});

			setIsHorizontalSwipe(true);
			Speech.speak(learningCards[index].word);

			return { ...prevFlippedCards, [index]: true };
		});
	};

	const frontAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateY: `${interpolate(rotation.value, [0, 180], [0, Math.PI])}rad`,
				},
			],
		};
	});

	const backAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateY: `${interpolate(rotation.value, [0, 180], [Math.PI, 0])}rad`,
				},
			],
			position: "absolute",
			top: 0,
			left: 0,
		};
	});

	const handleSwipeRight = () => {
		setShowRightSwipeView(true);
		setTimeout(() => setShowRightSwipeView(false), 1000);
		setCurrentIndexCardsFlipped();
		setFlashCards(learningCards[currentCardIndex], true);
	};

	const handleSwipeLeft = (index) => {
		setShowLeftSwipeView(true);
		setTimeout(() => setShowLeftSwipeView(false), 1000);

		const currentCard = learningCards[index];
		const updatedCards = [...learningCards];

		updatedCards.push(currentCard);

		// Update the learningCards state
		setLearningCards(updatedCards);

		setCurrentIndexCardsFlipped();
		setFlashCards(learningCards[currentCardIndex], false);
	};

	const setCurrentIndexCardsFlipped = () => {
		setCurrentCardIndex((prevIndex) => prevIndex + 1);
		setIsHorizontalSwipe(false);
	};

	const renderCard = (card, index) => (
		<Pressable
			onPress={() => handleFlipCard(index)}
			style={[styles.cardContainer]}
		>
			<Animated.View
				style={[
					styles.card,
					{
						backgroundColor: colors.lightBackground,
						backfaceVisibility: "hidden",
					},
					frontAnimatedStyle,
				]}
			>
				<View style={{ marginTop: 10 }}>
					{card.image?.url ? (
						<Image
							source={{ uri: card.image.url.toString() }}
							style={{ width: "50%", height: "50%", borderRadius: 10 }}
						/>
					) : null}
				</View>
				<Text
					style={[styles.cardText, { color: colors.primary }]}
					selectable={false}
				>
					{card.word}
				</Text>
			</Animated.View>
			<Animated.View
				style={[
					styles.card,
					{
						backgroundColor: colors.lightBackground,
						backfaceVisibility: "hidden",
					},
					backAnimatedStyle,
				]}
			>
				<View style={{ marginTop: 10 }}>
					{card.image?.url ? (
						<Image
							source={{ uri: card.image.url.toString() }}
							style={{ width: 300, height: 300, borderRadius: 10 }}
						/>
					) : null}
				</View>
				<Text
					style={[styles.cardText, { color: colors.primary }]}
					selectable={false}
				>
					{card.translateWord}
				</Text>
			</Animated.View>
		</Pressable>
	);

	return (
		<Swiper
			cards={learningCards}
			renderCard={(card, index) => renderCard(card, index)}
			keyExtractor={(card) => card.id}
			onSwipedRight={handleSwipeRight}
			onSwipedLeft={handleSwipeLeft}
			onSwipedAll={onComplete}
			stackSize={3}
			cardIndex={currentCardIndex}
			backgroundColor={"transparent"}
			verticalSwipe={false}
			horizontalSwipe={isHorizontalSwipe}
			containerStyle={{ width: "50%" }}
			overlayLabels={{
				left: {
					title: "Не знаю",
					style: styles.overlayLabelLeft,
				},
				right: {
					title: "Знаю",
					style: styles.overlayLabelRight,
				},
			}}
		/>
	);
};

export default LearnCards;
