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
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;

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

  const handleTypeModeChange = (newValue: boolean) => {
    setTypeMode(newValue);
    setFlippedCards({});
    rotation.value = 0;
  };

  const cardWidth = isMobile ? '90%' : isTablet ? '70%' : '50%';
  const cardHeight = isMobile ? '70%' : '75%';

  const renderCard = (card: ICard, index: number) => (
    <Pressable
      key={card.id}
      onPress={() => !typeMode && handleFlipCard(index)}
      disabled={typeMode}
      style={{
        width: cardWidth,
        height: '100%',
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ position: 'relative', width: '100%', height: cardHeight }}>
        {/* Front of card */}
        <Animated.View
          style={[
            {
              backgroundColor: colors.lightBackground,
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
              justifyContent: 'center',
              alignItems: 'center',
              padding: isMobile ? 20 : 32,
              borderWidth: 1,
              borderColor: colors.primary + '10',
            },
            frontAnimatedStyle,
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {card.image?.url ? (
              <View
                style={{
                  marginBottom: 24,
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                <Image
                  source={{ uri: card.image.url.toString() }}
                  style={{
                    width: isMobile ? 180 : isTablet ? 280 : 360,
                    height: isMobile ? 180 : isTablet ? 280 : 360,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
              </View>
            ) : null}
            <Text
              style={{
                fontSize: isMobile ? 28 : isTablet ? 36 : 42,
                fontWeight: '700',
                color: colors.primary,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
              selectable={false}
            >
              {card.word}
            </Text>
            {!typeMode && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.lightText,
                  marginTop: 16,
                  opacity: 0.6,
                }}
              >
                {i18n.t('learnScreen.learnCards.tapToFlip')}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Back of card */}
        <Animated.View
          style={[
            {
              backgroundColor: colors.lightBackground,
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
              justifyContent: 'center',
              alignItems: 'center',
              padding: isMobile ? 20 : 32,
              borderWidth: 1,
              borderColor: colors.primary + '10',
            },
            backAnimatedStyle,
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {card.image?.url ? (
              <View
                style={{
                  marginBottom: 24,
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                <Image
                  source={{ uri: card.image.url.toString() }}
                  style={{
                    width: isMobile ? 180 : isTablet ? 280 : 360,
                    height: isMobile ? 180 : isTablet ? 280 : 360,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
              </View>
            ) : null}
            <Text
              style={{
                fontSize: isMobile ? 28 : isTablet ? 36 : 42,
                fontWeight: '700',
                color: colors.primary,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
              selectable={false}
            >
              {card.translateWord}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );

  return (
    <>
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
        <Checkbox
          value={typeMode}
          onValueChange={(value) => handleTypeModeChange(value)}
        />
        <ThemeText>{i18n.t('learnScreen.learnCards.answer')}</ThemeText>
      </View>

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
                  valueAnswer.length > cards[currentCardIndex]?.word.length
                    ? 'red'
                    : '',
              }}
            >
              {cards[currentCardIndex]?.word?.length}
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
