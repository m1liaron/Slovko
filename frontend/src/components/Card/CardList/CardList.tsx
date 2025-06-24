import { getUnsplashPhotos } from "@/api/unsplash";
import noCardsImage from "@/assets/images/no-cards.png";
import { enqueueOrDispatch } from "@/helpers/offlineHelpers/enqueueOrDispatch";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { i18n } from "@/localization/i18n";
import type { StackNavigation } from "@/navigation/ProtectedRoute/ProtectedRoute";
import {
	convertBlobToBase64,
	convertImageToBase64,
	pickImage,
} from "@/utils/utils";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, {
	type ChangeEvent,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	Platform,
	Pressable,
	Text,
	View,
} from "react-native";
import Toast from "react-native-toast-message";
import Fontisto from "react-native-vector-icons/Fontisto";
import * as XLSX from "xlsx";
import AddButton from "../../../common/components/AddButton/AddButton";
import AddInput from "../../../common/components/AddInput/AddInput";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import ThemeText from "../../../common/components/ThemeText/ThemeText";
import { AppPath, DataStatus } from "../../../common/enums/app/app";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import {
	addCard,
	addStateCard,
	getCards,
	rangeCards,
	removeCard,
	removeStateCard,
	resetFilter,
} from "../../../redux/cardReducer/cardSlice";
import DefaultModal from "../../DefaultModal/DefaultModal";
import CardItem from "../CardItem/CardItem";
import styles from "./CardList.styles";
import { getCardsStorage } from "@/redux/cardReducer/cardThunk";
import { v4 } from "uuid";

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
	const { cards, cardsStorage, lastFetchedSuccessfully, filteredCards, error, status } = useAppSelector(
		(state) => state.cards,
	);
	const dispatch = useAppDispatch();
	const navigation = useNavigation<StackNavigation>();
	const { isConnected } = useAppSelector(state => state.network);

	const cardsToShow =
	lastFetchedSuccessfully && isConnected ? cards : cardsStorage;

	const [addCardMode, setAddCardMode] = useState<number>(0);
	const [valueWords, setValueWords] = useState<Record<string, string>>({});
	const [value, setValue] = useState<string>("");
	const [answerWord, setAnswerWord] = useState<string>("");
	const [isValidateWord, setIsValidateWord] = useState<boolean>(true);
	const [showAddModal, setShowAddModal] = useState<boolean>(false);
	const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
	const [chosenImage, setChosenImage] = useState<number | null>(null);
	const [imageUri, setImageUri] = useState<string>("");
	const [jsonOutput, setJsonOutput] = useState<Record<string, string>>({});
	const [wordsRangeNumber, setWordsRangeNumber] = useState<number>(
		cardsToShow.length || 2,
	);


	useEffect(() => {
		setWordsRangeNumber(cardsToShow.length);
	}, [cardsToShow.length]);

	const onChangeCardsRange = useCallback((value: number) => {
		setWordsRangeNumber(value);
	}, []);

	const decWordsRange = () => {
		if (wordsRangeNumber > 2) {
			setWordsRangeNumber(wordsRangeNumber - 1);
		}
	};

	const incWordsRange = () => {
		if (wordsRangeNumber < cardsToShow.length) {
			setWordsRangeNumber(wordsRangeNumber + 1);
		}
	};

	/**
	 * Converts an array of strings or rows (from Excel) into an object.
	 * Each line/row is expected to be in the "key: value" format.
	 */
	const parseToJsonObject = (
		data: string[] | (string | undefined)[][],
	): Record<string, string> => {
		const jsonObject: Record<string, string> = {};

		data.forEach((line, index) => {
			let key: string | undefined;
			let value: string | undefined;

			if (Array.isArray(line)) {
				// For Excel rows (arrays)
				[key, value] = line;
			} else if (typeof line === "string") {
				// For plain text
				[key, value] = line.split(":");
			}

			if (key && value) {
				jsonObject[key.trim()] = value.trim();
			} else {
				console.warn(
					`Line ${index + 1} is not in the correct format: "${line}"`,
				);
			}
		});

		return jsonObject;
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = (event.target as HTMLInputElement).files;
		if (!files || files.length === 0) return;

		const file = files[0];
		// If there’s no dot in the name, extension will be empty
		const extension = file.name.includes(".")
			? file.name.split(".").pop()?.toLowerCase() || ""
			: "";
		const mimeType = file.type ? file.type.toLowerCase() : "";

		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			const result = e.target?.result;
			if (!result) return;

			let jsonObject: Record<string, string> = {};

			// Process TXT: either if the extension is "txt", mime is "text/plain", or no extension but the mime is correct.
			if (
				extension === "txt" ||
				mimeType === "text/plain" ||
				extension === ""
			) {
				// result is a string for text files
				const lines = result.toString().split("\n");
				jsonObject = parseToJsonObject(lines);
			}
			// Process XLSX / XLS
			else if (
				extension === "xlsx" ||
				extension === "xls" ||
				mimeType ===
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
				mimeType === "application/vnd.ms-excel"
			) {
				const data = new Uint8Array(result as ArrayBuffer);
				const workbook: XLSX.WorkBook = XLSX.read(data, { type: "array" });
				const sheetName: string = workbook.SheetNames[0];
				const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
				const parsed = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (
					| string
					| undefined
				)[][];
				jsonObject = parseToJsonObject(parsed);
			} else {
				Toast.show({
					type: "error",
					text1: "Unsupported file format",
					text2: `The file "${file.name}" is not a supported type.`,
				});
				return;
			}

			// If parsing yielded no keys, notify and stop.
			if (Object.keys(jsonObject).length === 0) {
				Toast.show({
					type: "error",
					text1: "No valid data",
					text2: `The file "${file.name}" did not contain any valid data.`,
				});
				return;
			}

			setJsonOutput(jsonObject);
			setValueWords(jsonObject);
		};

		// Decide which method to read the file:
		if (extension === "txt" || mimeType === "text/plain" || extension === "") {
			reader.readAsText(file);
		} else if (
			extension === "xlsx" ||
			extension === "xls" ||
			mimeType ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			mimeType === "application/vnd.ms-excel"
		) {
			reader.readAsArrayBuffer(file);
		} else {
			Toast.show({
				type: "error",
				text1: "Unsupported file format",
				text2: `The file "${file.name}" is not a supported type.`,
			});
		}
	};

	const handleImportMobile = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					"text/plain",
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					"application/vnd.ms-excel",
				],
				copyToCacheDirectory: true,
				multiple: false,
			});

			if (result.canceled) return;

			const { uri, name, mimeType } = result.assets[0];
			const extension = name.includes(".")
				? name.split(".").pop()?.toLowerCase() || ""
				: "";

			let jsonObject: Record<string, string> = {};

			if (
				extension === "txt" ||
				mimeType === "text/plain" ||
				extension === ""
			) {
				const fileContent = await FileSystem.readAsStringAsync(uri);
				const lines = fileContent.split("\n");
				jsonObject = parseToJsonObject(lines);
			} else if (
				extension === "xlsx" ||
				extension === "xls" ||
				mimeType ===
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
				mimeType === "application/vnd.ms-excel"
			) {
				const fileContent = await FileSystem.readAsStringAsync(uri, {
					encoding: FileSystem.EncodingType.Base64,
				});
				const workbook = XLSX.read(fileContent, { type: "base64" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const parsed = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (
					| string
					| undefined
				)[][];
				jsonObject = parseToJsonObject(parsed);
			} else {
				Toast.show({
					type: "error",
					text1: "Unsupported file format",
					text2: `The file "${name}" is not a supported type.`,
				});
				return;
			}

			if (Object.keys(jsonObject).length === 0) {
				Toast.show({
					type: "error",
					text1: "No valid data",
					text2: `The file "${name}" did not contain any valid data.`,
				});
				return;
			}

			setJsonOutput(jsonObject);
			setValueWords(jsonObject);
		} catch (error) {
			console.error("Failed to read file: ", error);
		}
	};

	useEffect(() => {
		dispatch(enqueueOrDispatch(getCards, getCardsStorage, { groupId} ));
	}, [group, groupId]);

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
			const formatWord = cleanedWord.length <= 0 ? word : cleanedWord;
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
				dispatch(enqueueOrDispatch(addCard, addStateCard, {
					tempId: `local-${v4()}`,
					card: {
						word: validateWord(key),
						translateWord: value,
						imageUri: "",
						groupId,
					}
				}));
			}

			setValueWords({});
			setJsonOutput({});
			alert("Cards added from file successfully!");
			return;
		}

		if (value && answerWord) {
			const cardData = {
				tempId: `local-${v4()}`,
				card: {
					word: validateWord(value),
					translateWord: validatedAnswer,
					imageUri: finalImageUri || "",
					groupId,
				}
			};

			dispatch(enqueueOrDispatch(addCard, addStateCard, cardData)).catch((err: any) => {
				if (err instanceof Error) {
					console.log(err);
				}
			});

			setValue("");
			setAnswerWord("");
			setImageUri("");
		}
	};

	const onRemoveCard = async (cardId: string) => {
		dispatch(enqueueOrDispatch(removeCard, removeStateCard, cardId));
	};

	const navigateToLearn = () => {
		if (wordsRangeNumber !== cardsToShow.length) {
			dispatch(rangeCards(wordsRangeNumber));
		}
		navigation.navigate(AppPath.Learn, { groupId });
	};

	const setChosenPhoto = (image: string, index: number) => {
		setImageUri(image);
		setChosenImage(index);
	};

	const fetchUnsplashPhotos = async () => {
		const photos = await getUnsplashPhotos(value);
		if (photos?.length) {
			setUnsplashImages(photos);
		}
	};

	return (
		<View style={styles.container}>
			{status === DataStatus.PENDING ? (
				<ActivityIndicator color={colors.primary} />
			) : !cardsToShow.length ? (
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<Image source={noCardsImage} />
				</View>
			) : (
				<View style={{ marginVertical: 10 }}>
					<FlatList
						data={cardsToShow}
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

			{cardsToShow.length > 1 && (
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
								maximumValue={cardsToShow.length}
								value={wordsRangeNumber}
								onSlidingComplete={onChangeCardsRange}
								minimumTrackTintColor="#FFFFFF"
								maximumTrackTintColor="#000000"
							/>
						</View>

						<Pressable onPress={incWordsRange}>
							<FontAwesome name="plus" color={colors.primary} size={40} />
						</Pressable>
						{filteredCards.length > cardsToShow.length && (
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
					<PressableButton
						onPress={navigateToLearn}
						text={i18n.t("group.cardList.learnButton")}
					/>
				</View>
			)}
			<AddButton onPress={() => setShowAddModal(true)} />

			<DefaultModal
				isVisible={showAddModal}
				handleClose={() => setShowAddModal(false)}
			>
				<View style={styles.formContainer}>
					<Text style={[styles.title, { color: colors.primary }]}>
						{i18n.t("group.cardList.addCardTitle")}
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
							text={i18n.t("group.cardList.oneCard")}
							onPress={() => setAddCardMode(0)}
							buttonStyle={{
								flex: 1,
								backgroundColor: addCardMode === 0 ? "#002044" : "#007AFF",
							}}
						/>
						<PressableButton
							text={i18n.t("group.cardList.manyCards")}
							onPress={() => setAddCardMode(1)}
							buttonStyle={{
								flex: 1,
								backgroundColor: addCardMode === 1 ? "#002044" : "#007AFF",
							}}
						/>
					</View>

					{addCardMode ? (
						<View style={styles.bulkAddContainer}>
							{Platform.OS === "web" ? (
								<View>
									<View style={styles.fileInputContainer}>
										<Fontisto
											name="import"
											size={30}
											color={colors.background}
										/>
										<input
											type="file"
											onChange={handleFileChange}
											style={styles.fileInput}
										/>
									</View>
									<ThemeText>{i18n.t("group.cardList.fileTypes")}</ThemeText>
								</View>
							) : (
								<View>
									<PressableButton
										text={i18n.t("group.cardList.importTxt")}
										onPress={handleImportMobile}
									/>
								</View>
							)}

							{Object.keys(jsonOutput).length > 0 && (
								<View style={styles.jsonTableContainer}>
									<View style={styles.jsonTable}>
										<Text style={styles.jsonTableTitle}>
											{i18n.t("group.cardList.dataTitle")}
										</Text>
										<FlatList
											data={Object.entries(jsonOutput)}
											keyExtractor={([key]) => key}
											renderItem={({ item }) => {
												const [key, value] = item;
												return (
													<View key={value} style={styles.jsonRow}>
														<Text style={styles.jsonKey}>{key}</Text>
														<Text style={styles.jsonValue}>{value}</Text>
													</View>
												);
											}}
										/>
									</View>
								</View>
							)}
						</View>
					) : (
						<View>
							<PressableButton
								text={i18n.t("group.cardList.chooseImage")}
								onPress={() => pickImage(imageUri, setImageUri)}
							/>
							{imageUri !== "" && (
								<Image source={{ uri: imageUri }} style={styles.image} />
							)}

							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									flexWrap: "wrap",
									gap: 5,
								}}
							>
								{unsplashImages.length > 0 &&
									unsplashImages.map((image, index) => (
										<Pressable
											key={image.slice(0, 10)}
											style={{
												borderWidth: 4,
												borderColor:
													chosenImage === index ? "#679bd7" : colors.primary,
											}}
											onPress={() => setChosenPhoto(image, index)}
										>
											<Image
												key={image.slice(0, 10)}
												source={{ uri: image }}
												style={styles.image}
											/>
										</Pressable>
									))}
							</View>

							<AddInput
								value={value}
								onChangeText={setValue}
								placeholder={i18n.t("group.cardList.wordPlaceholder")}
								onFocus={fetchUnsplashPhotos}
							/>

							<AddInput
								value={answerWord}
								onChangeText={setAnswerWord}
								placeholder={i18n.t("group.cardList.answerPlaceholder")}
							/>
							<View style={{ flexDirection: "row" }}>
								<ThemeText>{i18n.t("group.cardList.validation")} </ThemeText>
								<Checkbox
									value={isValidateWord}
									onValueChange={setIsValidateWord}
								/>
							</View>
						</View>
					)}

					<PressableButton
						onPress={onSaveCard}
						text={i18n.t("group.cardList.addButton")}
					/>
					{error && status === DataStatus.ERROR && (
						<Text style={{ fontSize: 30, color: "#ff0000" }}>{error}</Text>
					)}
				</View>
			</DefaultModal>
		</View>
	);
};

export default CardList;
