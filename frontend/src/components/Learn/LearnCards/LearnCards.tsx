import type { ICard } from "@/common/enums/types/card.type";
import { useAppSelector } from "@/hooks/redux.hooks";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { selectCard } from "../../../redux/cardReducer/cardSlice";
import styles from "./LearnCards.styles";

interface LearnCardsProps {
	onComplete: () => void;
	setFlashCards: (card: ICard, isCorrect: boolean) => void;
}

const LearnCards = ({ onComplete, setFlashCards }: LearnCardsProps) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const cards = useAppSelector(selectCard);
	const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
	const [learningCards, setLearningCards] = useState<ICard[]>([...cards]);
	const [showLeftSwipeView, setShowLeftSwipeView] = useState<boolean>(false);
	const [showRightSwipeView, setShowRightSwipeView] = useState<boolean>(false);
	const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
	const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
	const [isHorizontalSwipe, setIsHorizontalSwipe] = useState<boolean>(false);

	const rotation = useSharedValue(0);
	const { width } = useWindowDimensions();

	const handleFlipCard = (index: number) => {
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
				{ perspective: 1000 },
				{
					rotateY: `${interpolate(rotation.value, [0, 180], [0, Math.PI])}rad`,
				},
			],
		};
	});

	const backAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ perspective: 1000 },
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

	const handleSwipeLeft = (index: number) => {
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
		// setIsHorizontalSwipe(false);
	};

	const renderCard = (card: ICard, index: number) => (
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
							style={{ width: width < 800 ? 200 : 400, height: "50%", borderRadius: 10, margin: "auto" }}
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
				<View style={{ marginTop: 10}}>
					{card.image?.url ? (
						<Image
							source={{ uri: card.image.url.toString() }}
							style={{ width: width < 800 ? 200 : 400, height: 300, borderRadius: 10, margin: "auto" }}
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
			overlayLabels={{
				left: {
					title: "Не знаю",
					style: {
						label: styles.overlayLabelLeftTitle,
						wrapper: styles.overlayLabelLeftWrapper,
					},
				},
				right: {
					title: "Знаю",
					style: {
						label: styles.overlayLabelRightTitle,
						wrapper: styles.overlayLabelRightWrapper,
					},
				},
			}}
		/>
	);
};

export default LearnCards;