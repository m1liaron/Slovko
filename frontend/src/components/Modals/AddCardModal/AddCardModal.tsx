import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ScrollView } from 'moti';
import pLimit from 'p-limit';
import type { Dispatch } from 'react';
import React, { type ChangeEvent, useEffect, useState } from 'react';
import { FlatList, Image, Platform, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { v4 as uuid } from 'uuid';
import * as XLSX from 'xlsx';

import { getUnsplashPhotos } from '@/api/unsplash';
import { type AddCardRequest } from '@/common/enums/types/card.type';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import {
  addStateManyCards,
  setRangeLimit,
} from '@/redux/cardReducer/cardSlice';
import { addManyCards } from '@/redux/cardReducer/cardThunk';
import { pickImage } from '@/utils';
import { convertDeviceImage } from '@/utils/images/convertDeviceImage';

import AddInput from '../../../common/components/AddInput/AddInput';
import PressableButton from '../../../common/components/PressableButton/PressableButton';
import ThemeText from '../../../common/components/ThemeText/ThemeText';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { addCard, addStateCard } from '../../../redux/cardReducer/cardSlice';
import DefaultModal from '../../DefaultModal/DefaultModal';
import { TextInput } from 'react-native-gesture-handler';

import NoAvailableImage from '@/assets/images/No_Image_Available.jpg';

const BATCH_SIZE = 10;
const CONCURRENCY = 3;

interface AddCardModalProps {
  showAddModal: boolean;
  setShowAddModal: Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
}

type AddCard = {
  word: string;
  translateWord: string;
  image?: string;
};

const AddCardModal: React.FC<AddCardModalProps> = ({
  showAddModal,
  setShowAddModal,
  groupId,
}) => {
  const [addCardMode, setAddCardMode] = useState<number>(0); // 0 - one card, 1 - many cards
  const [valueWords, setValueWords] = useState<Record<string, string>>({});
  const [value, setValue] = useState<string>('');
  const [answerWord, setAnswerWord] = useState<string>('');
  const [isValidateWord, setIsValidateWord] = useState<boolean>(true);
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
  const [chosenImage, setChosenImage] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<Record<string, string>>({});
  const [manualCards, setManualCards] = useState<AddCard[]>([
    {
      word: '',
      translateWord: '',
      image: '',
    },
  ]);
  const [showManualCards, setShowManualCards] = useState(false);

  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();

  const isJsonOutputExists = Object.keys(jsonOutput).length > 0;
  const isManyCardsExists = isJsonOutputExists || manualCards.length > 0;

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
      } else if (typeof line === 'string') {
        // For plain text
        [key, value] = line.split(':');
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
    const extension = file.name.includes('.')
      ? file.name.split('.').pop()?.toLowerCase() || ''
      : '';
    const mimeType = file.type ? file.type.toLowerCase() : '';

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result) return;

      let jsonObject: Record<string, string> = {};

      // Process TXT: either if the extension is "txt", mime is "text/plain", or no extension but the mime is correct.
      if (
        extension === 'txt' ||
        mimeType === 'text/plain' ||
        extension === ''
      ) {
        // result is a string for text files
        const lines = result.toString().split('\n');
        jsonObject = parseToJsonObject(lines);
      }
      // Process XLSX / XLS
      else if (
        extension === 'xlsx' ||
        extension === 'xls' ||
        mimeType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mimeType === 'application/vnd.ms-excel'
      ) {
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const parsed = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (
          | string
          | undefined
        )[][];
        jsonObject = parseToJsonObject(parsed);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unsupported file format',
          text2: `The file "${file.name}" is not a supported type.`,
        });
        return;
      }

      // If parsing yielded no keys, notify and stop.
      if (isJsonOutputExists) {
        Toast.show({
          type: 'error',
          text1: 'No valid data',
          text2: `The file "${file.name}" did not contain any valid data.`,
        });
        return;
      }

      event.target.value = '';
      setJsonOutput(jsonObject);
      setValueWords(jsonObject);
      setManualCards([]);
      setShowManualCards(false);
    };

    // Decide which method to read the file:
    if (extension === 'txt' || mimeType === 'text/plain' || extension === '') {
      reader.readAsText(file);
    } else if (
      extension === 'xlsx' ||
      extension === 'xls' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel'
    ) {
      reader.readAsArrayBuffer(file);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Unsupported file format',
        text2: `The file "${file.name}" is not a supported type.`,
      });
    }
  };

  const handleImportMobile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/plain',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const { uri, name, mimeType } = result.assets[0];
      const extension = name.includes('.')
        ? name.split('.').pop()?.toLowerCase() || ''
        : '';

      let jsonObject: Record<string, string> = {};

      if (
        extension === 'txt' ||
        mimeType === 'text/plain' ||
        extension === ''
      ) {
        const fileContent = await FileSystem.readAsStringAsync(uri);
        const lines = fileContent.split('\n');
        jsonObject = parseToJsonObject(lines);
      } else if (
        extension === 'xlsx' ||
        extension === 'xls' ||
        mimeType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mimeType === 'application/vnd.ms-excel'
      ) {
        const fileContent = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const workbook = XLSX.read(fileContent, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsed = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (
          | string
          | undefined
        )[][];
        jsonObject = parseToJsonObject(parsed);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unsupported file format',
          text2: `The file "${name}" is not a supported type.`,
        });
        return;
      }

      if (isJsonOutputExists) {
        Toast.show({
          type: 'error',
          text1: 'No valid data',
          text2: `The file "${name}" did not contain any valid data.`,
        });
        return;
      }

      setJsonOutput(jsonObject);
      setValueWords(jsonObject);
    } catch (error) {
      console.error('Failed to read file: ', error);
    }
  };

  async function addCardsInBatches(cards: AddCardRequest[]) {
    // break into batches of BATCH_SIZE
    const batches: AddCardRequest[][] = [];
    for (let i = 0; i < cards.length; i += BATCH_SIZE) {
      batches.push(cards.slice(i, i + BATCH_SIZE));
    }

    const limit = pLimit(CONCURRENCY);

    // schedule each batch through the limiter
    await Promise.all(
      batches.map((batch) =>
        limit(async () => {
          // you could either POST to a new bulk endpoint (see below)
          // or send each item in the batch sequentially:
          await dispatch(
            enqueueOrDispatch(addManyCards, addStateManyCards, {
              cards: batch,
              tempId: uuid(),
            }),
          );
        }),
      ),
    );

    dispatch(setRangeLimit(cards.length));
  }

  const onSaveCard = async () => {
    const finalImageUri = await convertDeviceImage(imageUri);

    function validateWord(word: string) {
      const cleanedWord = word.replace(/[^A-Za-z0-9\s]/g, '');
      const formatWord = cleanedWord.length <= 0 ? word : cleanedWord;
      const formattedWord = formatWord
        .split(' ')
        .filter(Boolean) // Remove any extra spaces
        .map(
          (subWord) =>
            subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase(),
        )
        .join(' ');

      return formattedWord;
    }

    function formatUpperCaseWord(word: string) {
      const formattedWord = word
        .split(' ')
        .filter(Boolean)
        .map(
          (subWord) =>
            subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase(),
        )
        .join(' ');
      return formattedWord;
    }

    if (manualCards.length > 0 && addCardMode === 1) {
      const payloads = manualCards.map((item) => ({
        word: validateWord(item.word),
        translateWord: item.translateWord,
        imageUri: item.image || '',
        groupId,
      }));
      await addCardsInBatches(payloads);

      setValueWords({});
      setJsonOutput({});
      setShowManualCards(false);
      setManualCards([]);
      alert('Cards added from file successfully!');
      return;
    }

    if (Object.keys(valueWords)?.length > 0 && addCardMode === 1) {
      const payloads = Object.entries(valueWords).map(([w, t]) => ({
        word: validateWord(w),
        translateWord: formatUpperCaseWord(t),
        imageUri: '',
        groupId,
      }));
      await addCardsInBatches(payloads);

      setValueWords({});
      setJsonOutput({});
      alert('Cards added from file successfully!');
      return;
    }

    if (value && answerWord && addCardMode === 0) {
      const cardData = {
        tempId: `local-${uuid()}`,
        card: {
          word: validateWord(value),
          translateWord: formatUpperCaseWord(answerWord),
          imageUri: finalImageUri || '',
          groupId,
        },
      };

      dispatch(enqueueOrDispatch(addCard, addStateCard, cardData)).catch(
        (err: any) => {
          if (err instanceof Error) {
            console.log(err);
          }
        },
      );

      setValue('');
      setAnswerWord('');
      setImageUri('');
    }
  };

  const setChosenPhoto = (image: string, index: number) => {
    setImageUri(image);
    setChosenImage(index);
  };

  const fetchUnsplashPhotos = async () => {
    if (value.length > 0) {
      const photos = await getUnsplashPhotos(value);
      if (photos?.length) {
        setUnsplashImages(photos);
      }
    }
  };

  const showAddCardsToast = () => {
    Toast.show({
      type: 'error',
      text1: i18n.t('common.sorry'),
      text2: i18n.t('group.cardList.atFirstAddFromFile'),
    });
  };

  const addManualCard = () => {
    if (Object.values(jsonOutput).length > 0) {
      showAddCardsToast();
      return;
    }

    const manualCardData = {
      word: '',
      translateWord: '',
      image: '',
    };

    setManualCards((prev) => [...prev, manualCardData]);
  };

  const updateManualCard = (
    index: number,
    field: 'word' | 'translateWord' | 'image',
    value: string,
  ) => {
    const copy = [...manualCards];
    copy[index][field] = value;
    setManualCards(copy);
  };

  const removeManualCard = (index: number) => {
    let copy = [...manualCards];
    copy = copy.filter((_, i) => i !== index);
    setManualCards(copy);
  };

  const removeJsonData = () => {
    setJsonOutput({});
    setValueWords({});
  };

  const handleShowManualCards = () => {
    if (isJsonOutputExists) {
      showAddCardsToast();
      return;
    } else {
      setShowManualCards((prev) => !prev);
    }
  };

  return (
    <DefaultModal
      isVisible={showAddModal}
      handleClose={() => setShowAddModal(false)}
    >
      <Toast />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* Header */}
          <ThemeText
            style={{ fontSize: 24, fontWeight: '700', marginBottom: 24 }}
          >
            {i18n.t('group.cardList.addCardTitle')}
          </ThemeText>

          {/* Mode Toggle */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: 24,
              padding: 4,
              backgroundColor: colors.lightBackground,
              borderRadius: 12,
            }}
          >
            <Pressable
              onPress={() => setAddCardMode(0)}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor:
                  addCardMode === 0 ? colors.primary : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: addCardMode === 0 ? colors.background : colors.text,
                  fontWeight: '600',
                  fontSize: 15,
                }}
              >
                {i18n.t('group.cardList.oneCard')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAddCardMode(1)}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor:
                  addCardMode === 1 ? colors.primary : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: addCardMode === 1 ? colors.background : colors.text,
                  fontWeight: '600',
                  fontSize: 15,
                }}
              >
                {i18n.t('group.cardList.manyCards')}
              </Text>
            </Pressable>
          </View>

          {/* Bulk Add Mode */}
          {addCardMode ? (
            <View style={{ gap: 20 }}>
              {/* Text Input */}
              <Pressable
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: showManualCards
                    ? colors.primary
                    : colors.lightBackground,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleShowManualCards}
              >
                <MaterialCommunityIcons
                  name="code-json"
                  size={24}
                  color={
                    showManualCards
                      ? colors.background
                      : isJsonOutputExists
                        ? colors.danger
                        : colors.primary
                  }
                />
              </Pressable>

              {showManualCards && (
                <View>
                  {manualCards.length > 0 && (
                    <FlatList
                      data={manualCards}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Pressable
                            onPress={() =>
                              pickImage(imageUri, (imageUri) =>
                                updateManualCard(index, 'image', imageUri),
                              )
                            }
                            style={{ width: 50, height: 50 }}
                          >
                            <Image
                              source={
                                item.image
                                  ? { uri: item.image }
                                  : require('@/assets/images/No_Image_Available.jpg')
                              }
                              style={{ width: 50, height: 50 }}
                            />
                          </Pressable>
                          <TextInput
                            placeholder={i18n.t(
                              'group.cardList.wordPlaceholder',
                            )}
                            placeholderTextColor={colors.lightText}
                            value={manualCards[index].word}
                            onChangeText={(value) =>
                              updateManualCard(index, 'word', value)
                            }
                            style={{
                              backgroundColor: colors.lightBackground,
                              padding: 15,
                              width: '100%',
                            }}
                          />
                          <TextInput
                            placeholder={i18n.t(
                              'group.cardList.answerPlaceholder',
                            )}
                            placeholderTextColor={colors.lightText}
                            value={manualCards[index].translateWord}
                            onChangeText={(value) =>
                              updateManualCard(index, 'translateWord', value)
                            }
                            style={{
                              backgroundColor: colors.lightBackground,
                              padding: 15,
                              width: '100%',
                            }}
                          />
                          <Pressable
                            onPress={() => removeManualCard(index)}
                            style={{
                              backgroundColor: colors.danger,
                              padding: 5,
                            }}
                          >
                            <Entypo
                              name="cross"
                              size={24}
                              color={colors.background}
                              style={{ cursor: 'pointer' }}
                            />
                          </Pressable>
                        </View>
                      )}
                      contentContainerStyle={{ maxHeight: 250 }}
                    />
                  )}
                  <PressableButton
                    text={i18n.t('group.cardList.addCardTitle')}
                    onPress={addManualCard}
                    gradientColor={colors.danger}
                    buttonStyle={{ marginTop: 10, padding: 5 }}
                    textStyle={{ fontSize: 10 }}
                  />
                </View>
              )}

              {/* File Import */}
              {Platform.OS === 'web' ? (
                <View
                  style={{
                    padding: 20,
                    backgroundColor: colors.lightBackground,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: colors.lightBackground,
                    borderStyle: 'dashed',
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: colors.background,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Fontisto
                        name="import"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                    />
                    <View style={{ alignItems: 'center' }}>
                      <ThemeText
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          marginBottom: 4,
                        }}
                      >
                        {i18n.t('group.cardList.importFromFile')}
                      </ThemeText>
                      <ThemeText style={{ fontSize: 13, opacity: 0.6 }}>
                        {i18n.t('group.cardList.fileTypes')}
                      </ThemeText>
                    </View>
                  </View>
                </View>
              ) : (
                <PressableButton
                  text={i18n.t('group.cardList.importTxt')}
                  onPress={handleImportMobile}
                  textStyle={{ color: colors.primary }}
                />
              )}

              {/* JSON Preview */}
              {isJsonOutputExists && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ThemeText
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: 12,
                        opacity: 0.7,
                      }}
                    >
                      {i18n.t('group.cardList.dataTitle')} (
                      {Object.keys(jsonOutput).length} items)
                    </ThemeText>
                    <Pressable
                      onPress={removeJsonData}
                      style={{
                        backgroundColor: colors.danger,
                        padding: 5,
                        borderRadius: 100,
                      }}
                    >
                      <Entypo
                        name="cross"
                        size={24}
                        color={colors.background}
                        style={{ cursor: 'pointer' }}
                      />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      backgroundColor: colors.lightBackground,
                      borderRadius: 12,
                      maxHeight: 200,
                      overflow: 'hidden',
                    }}
                  >
                    <FlatList
                      data={Object.entries(jsonOutput)}
                      keyExtractor={([key]) => key}
                      contentContainerStyle={{ padding: 16 }}
                      renderItem={({ item, index }) => {
                        const [key, value] = item;
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingVertical: 12,
                              paddingHorizontal: 12,
                              borderBottomWidth:
                                index < Object.keys(jsonOutput).length - 1
                                  ? 1
                                  : 0,
                              borderBottomColor: colors.background,
                              gap: 16,
                            }}
                          >
                            <ThemeText
                              style={{
                                fontWeight: '600',
                                fontSize: 14,
                                flex: 1,
                              }}
                              numberOfLines={1}
                            >
                              {key}
                            </ThemeText>
                            <ThemeText
                              style={{
                                color: colors.lightText,
                                fontSize: 14,
                                flex: 1,
                                textAlign: 'right',
                              }}
                              numberOfLines={1}
                            >
                              {value}
                            </ThemeText>
                          </View>
                        );
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : (
            /* Single Card Mode */
            <View style={{ gap: 20 }}>
              {/* Image Selection */}
              <View>
                <ThemeText
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 12,
                    opacity: 0.7,
                  }}
                >
                  Card Image
                </ThemeText>
                <PressableButton
                  text={i18n.t('group.cardList.chooseImage')}
                  onPress={() => pickImage(imageUri, setImageUri)}
                  buttonStyle={{
                    backgroundColor: colors.lightBackground,
                  }}
                  textStyle={{ color: colors.background }}
                />

                {/* Selected Image Preview */}
                {imageUri !== '' && (
                  <View style={{ marginTop: 12, alignItems: 'center' }}>
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: 12,
                        resizeMode: 'cover',
                      }}
                    />
                  </View>
                )}

                {/* Unsplash Images Grid */}
                {unsplashImages.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    {unsplashImages.map((image, index) => (
                      <Pressable
                        key={image.slice(0, 10)}
                        onPress={() => setChosenPhoto(image, index)}
                        style={{
                          borderRadius: 8,
                          borderWidth: 3,
                          borderColor:
                            chosenImage === index
                              ? colors.primary
                              : 'transparent',
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          source={{ uri: image }}
                          style={{
                            width: 80,
                            height: 80,
                            resizeMode: 'cover',
                          }}
                        />
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Word Input */}
              <View>
                <ThemeText
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 8,
                    opacity: 0.7,
                  }}
                >
                  Word
                </ThemeText>
                <AddInput
                  value={value}
                  onChangeText={setValue}
                  placeholder={i18n.t('group.cardList.wordPlaceholder')}
                  onFocus={fetchUnsplashPhotos}
                />
              </View>

              {/* Answer Input */}
              <View>
                <ThemeText
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 8,
                    opacity: 0.7,
                  }}
                >
                  Translation
                </ThemeText>
                <AddInput
                  value={answerWord}
                  onChangeText={setAnswerWord}
                  placeholder={i18n.t('group.cardList.answerPlaceholder')}
                />
              </View>

              {/* Validation Checkbox */}
              <Pressable
                onPress={() => setIsValidateWord(!isValidateWord)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 16,
                  backgroundColor: colors.lightBackground,
                  borderRadius: 12,
                }}
              >
                <Checkbox
                  value={isValidateWord}
                  onValueChange={setIsValidateWord}
                  color={isValidateWord ? colors.primary : undefined}
                />
                <ThemeText style={{ fontSize: 15, flex: 1 }}>
                  {i18n.t('group.cardList.validation')}
                </ThemeText>
              </Pressable>
            </View>
          )}

          {/* Submit Button */}
          <View style={{ marginTop: 32 }}>
            <PressableButton
              onPress={onSaveCard}
              text={i18n.t('group.cardList.addButton')}
              buttonStyle={{
                paddingVertical: 16,
                borderRadius: 12,
              }}
              // disabled={isManyCardsExists}
              // gradientColor={isManyCardsExists ? colors.lightBackground : ''}
              textStyle={{
                fontSize: 16,
                fontWeight: '600',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </DefaultModal>
  );
};
export { AddCardModal };
