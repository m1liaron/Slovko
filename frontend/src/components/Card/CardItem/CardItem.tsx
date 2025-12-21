import { AntDesign, Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  PixelRatio,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { ICard } from '@/common/enums/types/card.type';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { pickImage } from '@/utils';

import AddInput from '../../../common/components/AddInput/AddInput';
import PressableButton from '../../../common/components/PressableButton/PressableButton';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import {
  updateCard,
  updateStateCard,
} from '../../../redux/cardReducer/cardSlice';
import DefaultModal from '../../DefaultModal/DefaultModal';

import styles from './Card.styles';

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

const scaleFont = (width: number, size: number) => {
  const MIN_SCREEN_SIZE = 375;
  const scale = width / MIN_SCREEN_SIZE;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

const CardItem = ({ item, onRemove, groupId }: CardItemProps) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(item.word);
  const [translate, setTranslate] = useState<string>(item.translateWord);
  const [imageUri, setImageUri] = useState<string>(item?.image?.url || '');

  const dispatch = useAppDispatch();

  const handleUpdateCard = () => {
    dispatch(
      enqueueOrDispatch(updateCard, updateStateCard, {
        id: item.id,
        word: title,
        translateWord: translate,
        imageUri,
        groupId,
      }),
    );
    setTitle('');
    setTranslate('');

    // Close the modal after updating
    setShowEditModal(false);
    Toast.show({
      type: 'success',
      text1: 'Success✅',
      text2: 'Card updated successfully!',
    });
  };

  const MAX_REVIEWS = 8;
  const learnProgress = Math.min((item.reviewCount / MAX_REVIEWS) * 100, 100);

  const cardWidth =
    screenWidth < 480
      ? screenWidth * 0.95
      : screenWidth < 640
        ? screenWidth * 0.88
        : screenWidth < 880
          ? screenWidth * 0.75
          : Platform.OS === 'web'
            ? screenWidth * 0.5
            : screenWidth * 0.4;

  const fontSize = screenWidth < 640 ? 22 : 30;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={[
          styles.cardContainer,
          { width: cardWidth, padding: screenWidth < 640 ? 10 : 16 },
        ]}
      >
        <View style={styles.titleContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <View style={{ marginTop: 10 }}>
              <Image
                source={{
                  uri:
                    item.image?.url ||
                    'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                }}
              />
            </View>

            <View>
              <ThemeText style={[styles.title, { fontSize }]}>
                {item.word}
              </ThemeText>

              {item.translateWord && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ThemeText
                    style={{ fontWeight: 'bold', fontSize: fontSize - 10 }}
                  >
                    Переклад:{' '}
                  </ThemeText>
                  <ThemeText style={{ fontSize: fontSize - 10 }}>
                    {item.translateWord}
                  </ThemeText>
                </View>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
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

        <View style={[styles.cardLoader, { width: `${learnProgress}%` }]} />
      </View>

      <DefaultModal
        isVisible={showEditModal}
        handleClose={() => setShowEditModal(false)}
      >
        <ThemeText
          style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 25 }}
        >
          Оновити карточку!
        </ThemeText>
        <View style={{ marginVertical: 20 }}>
          <ThemeText style={{ fontSize: 20 }}>Слово</ThemeText>
          <AddInput height={40} value={title} onChangeText={setTitle} />
        </View>

        <View style={{ marginBottom: 15 }}>
          <ThemeText style={{ fontSize: 20 }}>Переклад</ThemeText>
          <AddInput height={40} value={translate} onChangeText={setTranslate} />
        </View>

        <Pressable
          onPress={() => pickImage(imageUri, setImageUri)}
          style={{
            backgroundColor: colors.lightBackground,
            padding: 20,
            marginVertical: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AntDesign name="download" color={colors.primary} size={30} />
          <ThemeText>Виберіть зображення з галереї</ThemeText>
        </Pressable>
        {imageUri !== '' && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}

        <PressableButton text="Змінити" onPress={handleUpdateCard} />
      </DefaultModal>
    </View>
  );
};

export default CardItem;
