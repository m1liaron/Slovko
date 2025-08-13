import { getUnsplashPhotos } from '@/api/unsplash';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { i18n } from '@/localization/i18n';
import { convertDeviceImage } from '@/utils/images/convertDeviceImage';
import { pickImage } from '@/utils';
import Checkbox from 'expo-checkbox';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { type ChangeEvent, Dispatch, useState } from 'react';
import { FlatList, Image, Platform, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { v4 as uuid } from 'uuid';
import * as XLSX from 'xlsx';
import AddInput from '../../../common/components/AddInput/AddInput';
import PressableButton from '../../../common/components/PressableButton/PressableButton';
import ThemeText from '../../../common/components/ThemeText/ThemeText';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { addCard, addStateCard } from '../../../redux/cardReducer/cardSlice';
import DefaultModal from '../../DefaultModal/DefaultModal';
import styles from './AddCardModal.styles';

import { type AddCardRequest } from '@/common/enums/types/card.type';
import { addStateManyCards } from '@/redux/cardReducer/cardSlice';
import { addManyCards } from '@/redux/cardReducer/cardThunk';
import pLimit from 'p-limit';
import { useAppDispatch } from '@/hooks/redux.hooks';

const BATCH_SIZE = 10;
const CONCURRENCY = 3;

interface AddCardModalProps {
  showAddModal: boolean;
  setShowAddModal: Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  showAddModal,
  setShowAddModal,
  groupId,
}) => {
  const [addCardMode, setAddCardMode] = useState<number>(0);
  const [valueWords, setValueWords] = useState<Record<string, string>>({});
  const [value, setValue] = useState<string>('');
  const [answerWord, setAnswerWord] = useState<string>('');
  const [isValidateWord, setIsValidateWord] = useState<boolean>(true);
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
  const [chosenImage, setChosenImage] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<Record<string, string>>({});
  const [textPlain, setTextPlain] = useState('');

  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();

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
      if (Object.keys(jsonObject).length === 0) {
        Toast.show({
          type: 'error',
          text1: 'No valid data',
          text2: `The file "${file.name}" did not contain any valid data.`,
        });
        return;
      }

      setJsonOutput(jsonObject);
      setValueWords(jsonObject);
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

      if (Object.keys(jsonObject).length === 0) {
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
  }

  function convertTextToObject(input: string) {
    const result: Record<string, string> = {};
    const regex = /([^:]+):\s*([^:]+?)(?=\s+\S+:|$)/g;

    let match;
    while ((match = regex.exec(input)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }

    return result;
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

    const validatedAnswer = isValidateWord
      ? validateWord(answerWord)
      : answerWord;

    if (textPlain.length > 0) {
      const validatedTextPlain = convertTextToObject(String(textPlain));

      const payloads = Object.entries(validatedTextPlain).map(([w, t]) => ({
        word: validateWord(w),
        translateWord: t,
        imageUri: '',
        groupId,
      }));
      await addCardsInBatches(payloads);

      setValueWords({});
      setJsonOutput({});
      alert('Cards added from file successfully!');
      return;
    }

    if (Object.keys(valueWords)?.length > 0) {
      const payloads = Object.entries(valueWords).map(([w, t]) => ({
        word: validateWord(w),
        translateWord: t,
        imageUri: '',
        groupId,
      }));
      await addCardsInBatches(payloads);

      setValueWords({});
      setJsonOutput({});
      alert('Cards added from file successfully!');
      return;
    }

    if (value && answerWord) {
      const cardData = {
        tempId: `local-${uuid()}`,
        card: {
          word: validateWord(value),
          translateWord: validatedAnswer,
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
    const photos = await getUnsplashPhotos(value);
    if (photos?.length) {
      setUnsplashImages(photos);
    }
  };

  return (
    <DefaultModal
      isVisible={showAddModal}
      handleClose={() => setShowAddModal(false)}
    >
      <View style={styles.formContainer}>
        <ThemeText style={styles.title}>
          {i18n.t('group.cardList.addCardTitle')}
        </ThemeText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <PressableButton
            text={i18n.t('group.cardList.oneCard')}
            onPress={() => setAddCardMode(0)}
            buttonStyle={{
              flex: 1,
              backgroundColor:
                addCardMode === 0
                  ? colors.highlightDarkColor
                  : colors.highlightColor,
            }}
          />
          <PressableButton
            text={i18n.t('group.cardList.manyCards')}
            onPress={() => setAddCardMode(1)}
            buttonStyle={{
              flex: 1,
              backgroundColor:
                addCardMode === 1
                  ? colors.highlightDarkColor
                  : colors.highlightColor,
            }}
          />
        </View>

        {addCardMode ? (
          <View style={styles.bulkAddContainer}>
            <AddInput
              placeholder="Додати слова у text/plain"
              placeholderTextColor={colors.primary}
              value={textPlain}
              onChangeText={setTextPlain}
              height={100}
            />
            {Platform.OS === 'web' ? (
              <View>
                <View style={styles.fileInputContainer}>
                  <Fontisto name="import" size={30} color={colors.background} />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                  />
                </View>
                <ThemeText>{i18n.t('group.cardList.fileTypes')}</ThemeText>
              </View>
            ) : (
              <View>
                <PressableButton
                  text={i18n.t('group.cardList.importTxt')}
                  onPress={handleImportMobile}
                />
              </View>
            )}

            {Object.keys(jsonOutput).length > 0 && (
              <View style={styles.jsonTableContainer}>
                <View style={styles.jsonTable}>
                  <Text style={styles.jsonTableTitle}>
                    {i18n.t('group.cardList.dataTitle')}
                  </Text>
                  <FlatList
                    data={Object.entries(jsonOutput)}
                    keyExtractor={([key]) => key}
                    renderItem={({ item }) => {
                      const [key, value] = item;
                      return (
                        <View key={value} style={styles.jsonRow}>
                          <ThemeText style={styles.jsonKey}>{key}</ThemeText>
                          <ThemeText style={styles.jsonValue}>
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
          <View>
            <PressableButton
              text={i18n.t('group.cardList.chooseImage')}
              onPress={() => pickImage(imageUri, setImageUri)}
            />
            {imageUri !== '' && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
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
                        chosenImage === index ? '#679bd7' : colors.primary,
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
              placeholder={i18n.t('group.cardList.wordPlaceholder')}
              onFocus={fetchUnsplashPhotos}
            />

            <AddInput
              value={answerWord}
              onChangeText={setAnswerWord}
              placeholder={i18n.t('group.cardList.answerPlaceholder')}
            />
            <View style={{ flexDirection: 'row' }}>
              <ThemeText>{i18n.t('group.cardList.validation')} </ThemeText>
              <Checkbox
                value={isValidateWord}
                onValueChange={setIsValidateWord}
              />
            </View>
          </View>
        )}

        <PressableButton
          onPress={onSaveCard}
          text={i18n.t('group.cardList.addButton')}
        />
      </View>
    </DefaultModal>
  );
};
export { AddCardModal };
