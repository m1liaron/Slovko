import type { ICard } from '@/common/enums/types/card.type';
import { useAppSelector } from '@/hooks/redux.hooks';
import * as Speech from 'expo-speech';
import React, { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { selectCard } from '../../../redux/cardReducer/cardSlice';
import styles from './LearnCards.styles';
import { i18n } from '@/localization/i18n';
import AddInput from '@/common/components/AddInput/AddInput';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import Toast from 'react-native-toast-message';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import Checkbox from 'expo-checkbox';

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
  const [valueAnswer, setValueAnswer] = useState('');
  const [placeholderColor, setPlaceholderColor] = useState(colors.lightText);

  const [shouldSwipeBack, setShouldSwipeBack] = useState(false);
  const [typeMode, setTypeMode] = useState(true);

  const swiperRef = useRef<Swiper<ICard>>(null);
  const rotation = useSharedValue(0);
  const { width, height } = useWindowDimensions();

  const handleFlipCard = (index: number) => {
    if (typeMode) return;
    setFlippedCards((prevFlippedCards) => {
      if (prevFlippedCards[index]) {
        return prevFlippedCards;
      }
      setFlippedIndex(index === flippedIndex ? null : index);
      rotation.value = withTiming(rotation.value === 0 ? 180 : 0, {
        duration: 500,
      });

      Speech.speak(learningCards[index].word);

      return { ...prevFlippedCards, [index]: true };
    });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        {
          rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        {
          rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const handleSwipeRight = () => {
    setShowRightSwipeView(true);
    setTimeout(() => setShowRightSwipeView(false), 1000);
    setCurrentIndexCardsFlipped();
    setFlashCards(learningCards[currentCardIndex], true);
    setShouldSwipeBack(cards.length - 1 === currentCardIndex);
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
    setShouldSwipeBack(cards.length - 1 === currentCardIndex);
  };

  const setCurrentIndexCardsFlipped = () => {
    setCurrentCardIndex((prevIndex) => prevIndex + 1);
  };

  const checkAnswer = () => {
    if (valueAnswer.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Fail',
        text2: 'Input must be filled',
      });
      return;
    }
    const currentCard = learningCards[currentCardIndex];
    setIsHorizontalSwipe(true);
    handleFlipCard(currentCardIndex || 0);

    setTimeout(() => {
      if (
        valueAnswer.trim().toLowerCase() ===
        currentCard.translateWord.toLowerCase()
      ) {
        swiperRef.current?.swipeRight();
        setPlaceholderColor('#62c485');
      } else {
        swiperRef.current?.swipeLeft();
        setPlaceholderColor('#ff1100');
      }
    }, 500);

    setValueAnswer('');
    setIsHorizontalSwipe(false);
    setPlaceholderColor(colors.primary);
  };

  const cardWidth = width < 720 ? '90%' : '40%';

  const renderCard = (card: ICard, index: number) => (
    <Pressable
      onPress={() => handleFlipCard(index)}
      style={[styles.cardContainer, { width: cardWidth }]}
    >
      <View style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.lightBackground,
              position: 'absolute',
              width: '100%',
              height: '100%',
            },
            frontAnimatedStyle,
          ]}
        >
          <View style={{ marginTop: 10 }}>
            {card.image?.url ? (
              <Image
                source={{ uri: card.image.url.toString() }}
                style={{
                  width: width < 800 ? 200 : 400,
                  height: '50%',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
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
              position: 'absolute',
              width: '100%',
              height: '100%',
            },
            backAnimatedStyle,
          ]}
        >
          <View style={{ marginTop: 10 }}>
            {card.image?.url ? (
              <Image
                source={{ uri: card.image.url.toString() }}
                style={{
                  width: width < 800 ? 200 : 400,
                  height: 300,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
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
      </View>
    </Pressable>
  );

  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: height,
          backgroundColor: 'red',
          opacity: 0.2,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          zIndex: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Checkbox value={typeMode} onValueChange={setTypeMode} />
        <ThemeText>{i18n.t('learnScreen.learnCards.answer')}</ThemeText>
      </View>

      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: height,
          backgroundColor: 'green',
          opacity: 0.2,
          zIndex: 0,
        }}
      />
      <Swiper
        ref={swiperRef}
        cards={learningCards}
        renderCard={(card, index) => renderCard(card, index)}
        keyExtractor={(card) => card.id}
        onSwipedRight={handleSwipeRight}
        onSwipedLeft={handleSwipeLeft}
        onSwipedAll={onComplete}
        stackSize={3}
        goBackToPreviousCardOnSwipeRight={shouldSwipeBack}
        goBackToPreviousCardOnSwipeLeft={shouldSwipeBack}
        cardIndex={currentCardIndex}
        backgroundColor={'transparent'}
        verticalSwipe={false}
        horizontalSwipe={typeMode ? isHorizontalSwipe : true}
      />

      {typeMode && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            backgroundColor: colors.lightBackground,
          }}
        >
          <AddInput
            value={valueAnswer}
            placeholderTextColor={placeholderColor}
            onChangeText={setValueAnswer}
            height={50}
            placeholder={i18n.t('learnScreen.learnCards.answer')}
          />
          <ThemeText>
            {valueAnswer.length}/
            <Text
              style={{
                color:
                  valueAnswer.length > cards[currentCardIndex].word.length
                    ? 'red'
                    : '',
              }}
            >
              {cards[currentCardIndex].word.length}
            </Text>
          </ThemeText>
          <PressableButton
            text={i18n.t('learnScreen.learnCards.checkAnswer')}
            onPress={checkAnswer}
          />
        </View>
      )}
    </>
  );
};

export default LearnCards;
