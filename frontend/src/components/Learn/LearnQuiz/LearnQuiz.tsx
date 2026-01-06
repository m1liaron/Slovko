import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { useAppTheme } from '../../../contexts/ThemeProvider';
import ProgressContainer from '../../ProgressContainer/ProgressContainer';

import styles from './LearnQuiz.styles';
import { LearnProps } from '@/common/enums/types/learnProps.type';

type QuizOption = {
  text: string;
  isCorrect: boolean;
};

const LearnQuiz = ({
  learningCards,
  onComplete,
  handleSetData,
}: LearnProps) => {
  const {
    theme: { colors },
  } = useAppTheme();

  const [displayedQuizIndex, setDisplayedQuizIndex] = useState<number>(0);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);

  const isSoundPlayedRef = useRef(false);
  const currentCard = learningCards[displayedQuizIndex];

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
    return learningCards
      .filter((_item, index) => index !== displayedQuizIndex)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => ({ text: item.translateWord, isCorrect: false }));
  };

  const shuffleArray = (array: QuizOption[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const moveToNextCard = () => {
    if (displayedQuizIndex < learningCards.length - 1) {
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
      setIsCorrect(true);

      setTimeout(() => {
        moveToNextCard();
        handleSetData(currentCard, true);
      }, 1000);
    } else {
      setIsCorrect(false);
      handleSetData(currentCard, false);
    }

    setTimeout(() => {
      setSelectedOption(null);
    }, 2000);
  };

  const playSuccessSound = async () => {
    if (isSoundPlayedRef.current) return;

    isSoundPlayedRef.current = true;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/audio/success.mp3'),
        { positionMillis: 0 },
      );

      await sound.setVolumeAsync(0.2);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  useEffect(() => {
    isSoundPlayedRef.current = false;
  }, [displayedQuizIndex]);

  return (
    <>
      <ProgressContainer
        index={displayedQuizIndex}
        length={learningCards.length}
      />
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
                      : '#FC8277'
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
