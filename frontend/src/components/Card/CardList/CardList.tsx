import noCardsImage from "@/assets/images/no-cards.png";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import React, {
	type ChangeEvent,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import { FlatList, Image, Platform, Pressable, Text, View } from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import AddButton from "../../../common/components/AddButton/AddButton";
import AddInput from "../../../common/components/AddInput/AddInput";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import ThemeText from "../../../common/components/ThemeText/ThemeText";
import { AppPath, DataStatus } from "../../../common/enums/app/app";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import {
	addCard,
	getCards,
	rangeCards,
	removeCard,
	resetFilter,
} from "../../../redux/cardReducer/cardSlice";
import pickImage from "../../../utils/pickImage";
import DefaultModal from "../../DefaultModal/DefaultModal";
import CardItem from "../CardItem/CardItem";
import styles from "./CardList.styles";

const MemoCardItem = memo(CardItem);

/**
 * @param groupId {string}
 * @returns {JSX.Element}
 * @constructor
 */

type CardListProps = {
	groupId: string;
};

const CardList = ({ groupId }: CardListProps) => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { group } = useAppSelector((state) => state.groups);
	const { cards, filteredCards, error, status } = useAppSelector(
		(state) => state.cards,
	);
	const dispatch = useAppDispatch();

	const [addCardMode, setAddCardMode] = useState<number>(0);
	const [valueWords, setValueWords] = useState<Record<string, string>>({});
	const [value, setValue] = useState<string>("");
	const [answerWord, setAnswerWord] = useState<string>("");
	const [isValidateWord, setIsValidateWord] = useState<boolean>(true);
	const [showAddModal, setShowAddModal] = useState<boolean>(false);
	const [imageUri, setImageUri] = useState<string>("");
	const [jsonOutput, setJsonOutput] = useState<Record<string, string>>({});
	const [wordsRangeNumber, setWordsRangeNumber] = useState<number>(
		cards.length || 2,
	);
	const navigation = useNavigation<StackNavigation>();

	useEffect(() => {
		setWordsRangeNumber(cards.length);
	}, [cards.length, groupId]);

	const onChangeCardsRange = useCallback((value: number) => {
		setWordsRangeNumber(value);
	}, []);

	const decWordsRange = () => {
		if (wordsRangeNumber > 2) {
			setWordsRangeNumber(wordsRangeNumber - 1);
		}
	};

	const incWordsRange = () => {
		if (wordsRangeNumber < cards.length) {
			setWordsRangeNumber(wordsRangeNumber + 1);
		}
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = (event.target as HTMLInputElement).files;
		if (files) {
			const file = files[0];

			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				if (e?.target?.result) {
					const fileContent = e.target.result.toString();

					const lines = fileContent.split("\n");
					const jsonObject: Record<string, string> = {};

					lines.forEach((line: string, index) => {
						const [key, value] = line.split(":");
						if (key && value) {
							jsonObject[key.trim()] = value.trim();
						} else {
							console.warn(
								`Line ${index + 1} is not in the correct format: "${line}"`,
							);
						}
					});

					setJsonOutput(jsonObject);
					setValueWords(jsonObject);
				}
			};

			reader.readAsText(file);
		}
	};

	useEffect(() => {
		if (group?.id !== groupId) {
			dispatch(getCards({ groupId }));
		}
	}, [dispatch, groupId, group?.id]);

	const convertImageToBase64 = async (uri: string): Promise<string> => {
		const response = await fetch(uri);
		const blob = await response.blob();
		const reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onloadend = () => {
				if (reader?.result) {
					const readerResult = reader.result.toString();
					const base64data = readerResult.split(",")[1]; // Get the Base64 part
					resolve(base64data);
				}
			};
			reader.onerror = () =>
				reject(new Error("Failed to convert image to base64"));
			reader.readAsDataURL(blob);
		});
	};

	const onSaveCard = async () => {
		let finalImageUri: string = imageUri;

		if (Platform.OS === "web" && imageUri.startsWith("blob:")) {
			try {
				finalImageUri = await convertBlobToBase64(imageUri);
			} catch (error) {
				console.error("Error converting blob to base64:", error);
				return;
			}
		} else if (finalImageUri) {
			try {
				const base64Image = await convertImageToBase64(finalImageUri);
				finalImageUri = base64Image;
			} catch (error) {
				console.error("Error converting image to base64:", error);
				return;
			}
		}

		function validateWord(word: string) {
			const cleanedWord = word.replace(/[^A-Za-z0-9\s]/g, "");
			const formatWord = cleanedWord.length <= 0 ? word : cleanedWord	
			const formattedWord = formatWord
				.split(" ")
				.filter(Boolean) // Remove any extra spaces
				.map(
					(subWord) =>
						subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase(),
				)
				.join(" ");

			return formattedWord;
		}

		const validatedAnswer = isValidateWord
			? validateWord(answerWord)
			: answerWord;

		if (Object.keys(valueWords).length > 0) {
			for (const [key, value] of Object.entries(valueWords)) {
				dispatch(
					addCard({
						word: validateWord(key),
						translateWord: value,
						imageUri: "",
						groupId,
					}),
				);
			}
			setValueWords({});
			alert("Cards added from file successfully!");
			return;
		}

		if (value && answerWord) {
			const cardData = {
				word: validateWord(value),
				translateWord: validatedAnswer,
				imageUri: finalImageUri || "",
				groupId,
			};

			console.log(validatedAnswer)
			dispatch(addCard(cardData));
			setValue("");
			setAnswerWord("");
			setImageUri("");
		}
	};

	const onRemoveCard = async (courseId: string) => {
		dispatch(removeCard(courseId));
	};

	const convertBlobToBase64 = (blobUri: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			fetch(blobUri)
				.then((response) => response.blob())
				.then((blob) => {
					const reader = new FileReader();
					const readerResult = reader.result?.toString();
					if (readerResult) {
						reader.onloadend = () => resolve(readerResult);
						reader.onerror = () =>
							reject(new Error("Failed to convert blob to base64"));
						reader.readAsDataURL(blob);
					}
				})
				.catch((error) => reject(error));
		});
	};

	const navigateToLearn = () => {
		if (wordsRangeNumber !== cards.length) {
			dispatch(rangeCards(wordsRangeNumber));
		}
		navigation.navigate(AppPath.Learn, { groupId });
	};

	return (
		<View style={styles.container}>
			{!cards.length ? (
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<Image source={noCardsImage} />
				</View>
			) : (
				<View style={{ marginVertical: 10 }}>
					<FlatList
						data={cards}
						renderItem={({ item }) => (
							<MemoCardItem
								item={item}
								onRemove={() => onRemoveCard(item.id)}
								groupId={groupId}
							/>
						)}
						horizontal={true}
						keyExtractor={(item) => item.id}
						style={styles.listContainer}
					/>
				</View>
			)}

			{cards.length > 1 && (
				<View style={{ marginHorizontal: 20 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Pressable onPress={decWordsRange}>
							<FontAwesome name="minus" color={colors.primary} size={40} />
						</Pressable>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<ThemeText style={{ fontSize: 35 }}>
								{Math.floor(wordsRangeNumber)}
							</ThemeText>
							<Slider
								style={{ width: 200, height: 40 }}
								minimumValue={2}
								maximumValue={cards.length}
								value={wordsRangeNumber}
								onSlidingComplete={onChangeCardsRange}
								minimumTrackTintColor="#FFFFFF"
								maximumTrackTintColor="#000000"
							/>
						</View>

						<Pressable onPress={incWordsRange}>
							<FontAwesome name="plus" color={colors.primary} size={40} />
						</Pressable>
						{filteredCards.length > cards.length && (
							<Pressable
								style={{
									padding: 5,
									borderRadius: 10,
									borderWidth: 2,
									borderColor: "#bcbcbc",
									marginHorizontal: 10,
								}}
								onPress={() => dispatch(resetFilter())}
							>
								<Entypo name="back-in-time" size={30} color="#bcbcbc" />
							</Pressable>
						)}
					</View>
					<PressableButton onPress={navigateToLearn} text="Вчитися" />
				</View>
			)}
			<AddButton onPress={() => setShowAddModal(true)} />

			<DefaultModal
				isVisible={showAddModal}
				handleClose={() => setShowAddModal(false)}
			>
				<View style={styles.formContainer}>
					<Text style={[styles.title, { color: colors.primary }]}>
						Додайте Карточку!
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: 5,
						}}
					>
						<PressableButton
							text="Одна"
							onPress={() => setAddCardMode(0)}
							buttonStyle={{
								flex: 1,
								backgroundColor: addCardMode === 0 ? "#002044" : "#007AFF",
							}}
						/>
						<PressableButton
							text="Багато"
							onPress={() => setAddCardMode(1)}
							buttonStyle={{
								flex: 1,
								backgroundColor: addCardMode === 1 ? "#002044" : "#007AFF",
							}}
						/>
					</View>

					{addCardMode ? (
						<View style={styles.bulkAddContainer}>
							{Platform.OS === "web" && (
								<View style={styles.fileInputContainer}>
									<Fontisto name="import" size={30} color={colors.background} />
									<input
										type="file"
										accept=".txt"
										onChange={handleFileChange}
										style={styles.fileInput}
									/>
								</View>
							)}
							{jsonOutput && (
								<View style={styles.jsonTableContainer}>
									<View style={styles.jsonTable}>
										<Text style={styles.jsonTableTitle}>Дані:</Text>
										{Object.entries(jsonOutput).map(([key, value]) => (
											<View key={value} style={styles.jsonRow}>
												<Text style={styles.jsonKey}>{key}</Text>
												<Text style={styles.jsonValue}>{value}</Text>
											</View>
										))}
									</View>
								</View>
							)}
						</View>
					) : (
						<View>
							<PressableButton
								text="Виберіть зображення з галереї"
								onPress={() => pickImage(imageUri, setImageUri)}
							/>
							{imageUri !== "" && (
								<Image source={{ uri: imageUri }} style={styles.image} />
							)}

							<AddInput
								value={value}
								onChangeText={setValue}
								placeholder="Слово..."
							/>

							<AddInput
								value={answerWord}
								onChangeText={setAnswerWord}
								placeholder="Відповідь..."
							/>
							<View style={{ flexDirection: "row" }}>
								<ThemeText>Валідація: </ThemeText>
								<Checkbox
									value={isValidateWord}
									onValueChange={setIsValidateWord}
								/>
							</View>
						</View>
					)}

					<PressableButton onPress={onSaveCard} text="Додати" />
					{error && status === DataStatus.ERROR && (
						<Text style={{ fontSize: 30, color: "#ff0000" }}>{error}</Text>
					)}
				</View>
			</DefaultModal>
		</View>
	);
};

export default CardList;
