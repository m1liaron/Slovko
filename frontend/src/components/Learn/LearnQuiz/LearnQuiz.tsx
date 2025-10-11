import type { ICard } from '@/common/enums/types/card.type';
import { useAppSelector } from '@/hooks/redux.hooks';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { selectCard } from '../../../redux/cardReducer/cardSlice';
import ProgressContainer from '../../ProgressContainer/ProgressContainer';
import styles from './LearnQuiz.styles';

type QuizOption = {
  text: string;
  isCorrect: boolean;
};

interface LearnQuizProps {
  onComplete: () => void;
  handleSetData: (card: ICard, isCorrect: boolean) => void;
}

const LearnQuiz = ({ onComplete, handleSetData }: LearnQuizProps) => {
  const cards = useAppSelector(selectCard);
  const {
    theme: { colors },
  } = useAppTheme();

  const [displayedQuizIndex, setDisplayedQuizIndex] = useState<number>(0);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [isSoundPlayed, setIsSoundPlayed] = useState(false);
  const currentCard = cards[displayedQuizIndex];

  useEffect(() => {
    generateQuizOption();
  }, [displayedQuizIndex]);

  const generateQuizOption = () => {
    if (!currentCard) return;
    const correctOption: QuizOption = {
      text: currentCard.translateWord,
      isCorrect: true,
    };
    const incorrectOptions = getIncorrectOptions();
    const shuffledOptions = shuffleArray([correctOption, ...incorrectOptions]);
    setQuizOptions(shuffledOptions);
  };

  const getIncorrectOptions = () => {
    return cards
      .filter((item, index) => index !== displayedQuizIndex)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => ({ text: item.translateWord, isCorrect: false }));
  };

  const shuffleArray = (array: QuizOption[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const moveToNextCard = () => {
    if (displayedQuizIndex < cards.length - 1) {
      setTimeout(() => {
        setDisplayedQuizIndex(displayedQuizIndex + 1);
        setIsCorrect(null);
      }, 2000);
    } else {
      onComplete();
    }
  };

  const handleOptionPress = async (option: QuizOption) => {
    setSelectedOption(option);
    if (option.isCorrect) {
      await playSuccessSound();
      setIsSoundPlayed(true);
      setIsCorrect(true);
      moveToNextCard();
      handleSetData(currentCard, true);
    } else {
      setIsCorrect(false);
      handleSetData(currentCard, false);
    }

    setTimeout(() => {
      setSelectedOption(null);
    }, 2000);
  };

  const playSuccessSound = async () => {
    try {
      if (isSoundPlayed) return;
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/audio/success.mp3'),
        { positionMillis: 0 },
      );

      await sound.setVolumeAsync(0.2);

      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    } finally {
      setIsSoundPlayed(false);
    }
  };

  return (
    <>
      <ProgressContainer index={displayedQuizIndex} length={cards.length} />
      <View style={styles.card}>
        <Text
          style={[
            styles.cardText,
            { color: colors.primary, borderColor: colors.primary },
          ]}
        >
          {currentCard.word}
        </Text>
      </View>
      <FlatList
        data={quizOptions}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.optionContainer,
              {
                backgroundColor:
                  selectedOption === item
                    ? isCorrect === true
                      ? '#81DC9F'
                      : isCorrect === false
                        ? '#FC8277'
                        : colors.lightText
                    : colors.lightBackground,
              },
            ]}
            onPress={() => handleOptionPress(item)}
          >
            <Text style={{ fontSize: 30, color: colors.primary }}>
              {item.text}
            </Text>
          </Pressable>
        )}
        style={{ flexGrow: 1 }}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
};

export default LearnQuiz;
