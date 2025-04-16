import ThemeText from "@/common/components/ThemeText/ThemeText";
import type { ICard } from "@/common/enums/types/card.type";
import { useAppDispatch } from "@/hooks/redux.hooks";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	Dimensions,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Toast from "react-native-toast-message";
import AddInput from "../../../common/components/AddInput/AddInput";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import { updateCard } from "../../../redux/cardReducer/cardSlice";
import pickImage from "../../../utils/pickImage";
import DefaultModal from "../../DefaultModal/DefaultModal";

/**
 * @param item {object: { id, word, translateWord, nextReviewAt, image}}
 * @param onRemove
 * @param groupId
 * @returns {JSX.Element}
 * @constructor
 */

interface CardItemProps {
	item: ICard;
	onRemove: () => void;
	groupId: string;
}

const CardItem = ({ item, onRemove, groupId }: CardItemProps) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(item.word);
	const [translate, setTranslate] = useState<string>(item.translateWord);
	const [imageUri, setImageUri] = useState<string>("");

	const dispatch = useAppDispatch();

	const formatReviewTime = (reviewTime: Date) => {
		const now = new Date().getTime();
		const timeDifference = new Date(reviewTime).getTime() - now; // Now it's future time, so we subtract now from reviewTime

		const oneDay = 24 * 60 * 60 * 1000;
		const oneHour = 60 * 60 * 1000;
		const oneMinute = 60 * 1000;

		if (timeDifference <= 0) {
			return "Час повтору пройшов"; // If review time has passed
		}

		if (timeDifference < oneHour) {
			const minutes = Math.ceil(timeDifference / oneMinute); // Use ceil to round up for future times
			return `Через ${minutes} хвилин${minutes === 1 ? "у" : minutes >= 3 && minutes <= 4 ? "и" : ""}`;
		}
		if (timeDifference < oneDay) {
			const hours = Math.floor(timeDifference / oneHour);
			const minutes = Math.ceil((timeDifference % oneHour) / oneMinute);
			return `Через ${hours} годин${hours === 1 ? "у" : hours >= 3 ? "и" : ""} та ${minutes} хвилин${minutes === 1 ? "у" : minutes >= 3 && minutes <= 4 ? "и" : ""}`;
		}
		const days = Math.floor(timeDifference / oneDay);
		const time = new Date(reviewTime).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
		return `Через ${days} днів о ${time}`;
	};

	const handleUpdateCard = () => {
		dispatch(
			updateCard({
				id: item.id,
				word: title,
				translateWord: translate,
				imageUri,
				groupId,
			}),
		);
		setTitle("");
		setTranslate("");

		// Close the modal after updating
		setShowEditModal(false);
		Toast.show({
			type: "success",
			text1: "Success✅",
			text2: "Card updated successfully!",
		});
	};

	return (
		<View
			style={[
				styles.cardContainer,
				{ backgroundColor: colors.lightBackground },
			]}
		>
			<Toast />
			<View style={styles.titleContainer}>
				<View style={styles.titleContainer}>
					<Text style={[styles.title, { color: colors.primary }]}>
						{item.word}
					</Text>
				</View>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Entypo
						name="pencil"
						onPress={() => setShowEditModal(true)}
						size={24}
						color={colors.iconColor}
					/>
					<Pressable onPress={onRemove}>
						<Entypo name="cross" size={24} color={colors.iconColor} />
					</Pressable>
				</View>
			</View>

			{item.translateWord && (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<ThemeText>Переклад: </ThemeText>
					<ThemeText style={{ fontWeight: "bold" }}>{item.translateWord}</ThemeText>
				</View>
			)}

			{item.nextReviewAt && (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<ThemeText>Наступний перегляд: </ThemeText>
					<ThemeText style={{ fontWeight: "bold" }}>{formatReviewTime(item.nextReviewAt)}</ThemeText>
				</View>
			)}

			{item.definition ? (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<ThemeText>Визначення: </ThemeText>
					<ThemeText style={{ fontWeight: "bold" }}>{item.definition}</ThemeText>
				</View>
			) : null}


			{item.example ? (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<ThemeText>Приклад: </ThemeText>
					<ThemeText style={{ fontWeight: "bold" }}>{item.example}</ThemeText>
				</View>
			) : null}

			<View style={{ marginTop: 10 }}>
				{item.image?.url ? (
					<Image
						source={{ uri: item.image.url.toString() }}
						style={{ width: item.definition ? 100 : 200, height: item.definition ? 100 : 200, borderRadius: 10 }}
					/>
				) : null}
			</View>

			<DefaultModal
				isVisible={showEditModal}
				handleClose={() => setShowEditModal(false)}
			>
				<View>
					<ThemeText>Оновити карточку!</ThemeText>
					<ThemeText>Слово</ThemeText>
					<AddInput value={title} onChangeText={setTitle} />
				</View>

				<View>
					<ThemeText>Переклад</ThemeText>
					<AddInput value={translate} onChangeText={setTranslate} />
				</View>

				<PressableButton
					text="Виберіть зображення з галереї"
					onPress={() => pickImage(imageUri, setImageUri)}
				/>
				{imageUri !== "" && (
					<Image source={{ uri: imageUri }} style={styles.image} />
				)}

				<PressableButton text="Змінити" onPress={handleUpdateCard} />
			</DefaultModal>
		</View>
	);
};

const styles = StyleSheet.create({
	cardContainer: {
		maxWidth: 400,
		backgroundColor: "#ffffff",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 5, // Adjust the radius for iOS
		height: Dimensions.get("window").height - 500,
		marginRight: 30,
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	flex: {
		justifyContent: "center",
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		marginBottom: 8,
	},
	translate: {
		fontSize: 16,
	},
	removeButton: {
		backgroundColor: "#dc3545",
		padding: 8,
		borderRadius: 5,
		width: 69,
	},
	reviewDate: {
		fontSize: 16,
		marginTop: 10,
		color: "#007bff",
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderColor: "#007bff",
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	button: {
		backgroundColor: "#007bff",
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginHorizontal: 10,
	},
	image: {
		width: 100,
		height: 100,
		marginVertical: 10,
		borderRadius: 10,
	},
});

export default CardItem;
