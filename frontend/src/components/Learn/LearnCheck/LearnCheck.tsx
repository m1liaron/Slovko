import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';

import ThemeText from '../../../common/components/ThemeText/ThemeText';
import { useAppTheme } from '../../../contexts/ThemeProvider';

import styles from './LearnCheck.styles';
import { LearnProps } from '@/common/enums/types/learnProps.type';

const LearnCheck = ({
  learningCards,
  onComplete,
  handleSetData,
}: LearnProps) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (learningCards.length <= 4) {
      onComplete();
    }
  }, [learningCards.length, onComplete]);

  const initialWords = useMemo(
    () =>
      learningCards
        .map((card) => card.word)
        .slice(0, 4)
        .sort(() => Math.random() - 0.5),
    [learningCards],
  );
  const initialAnswers = useMemo(
    () =>
      learningCards
        .map((card) => card.translateWord)
        .slice(0, 4)
        .sort(() => Math.random() - 0.5),
    [learningCards],
  );

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [words, setWords] = useState<string[]>(initialWords);
  const [answers, setAnswers] = useState<string[]>(initialAnswers);
  const [answeredWords, setAnsweredWords] = useState<string[]>([
    ...initialWords,
  ]); // it's current words + words that left to learn
  const [learnedWords, setLearnedWords] = useState<string[]>([]); // it's only learned words

  const [animateNewWord, setAnimateNewWord] = useState<string | null>(null);
  const [animateNewAnswer, setAnimateNewAnswer] = useState<string | null>(null);

  const newFadeAnim = useRef(new Animated.Value(1)).current;

  const getNewWord = () => {
    const remainingWords = learningCards.filter(
      (card) => !answeredWords.includes(card.word),
    );
    if (remainingWords.length === 0) return null; // Avoid infinite loop

    return remainingWords[Math.floor(Math.random() * remainingWords.length)];
  };

  const checkSelectedWordCorrect = (translation: string) => {
    if (!selectedWord) return;

    const currentCard = learningCards.find(
      (card) => card.word === selectedWord,
    );
    if (currentCard) {
      const correctTranslation = learningCards.find(
        (card) => card.word === selectedWord,
      )?.translateWord;

      if (translation === correctTranslation) {
        const wordIndex = words.indexOf(selectedWord);
        const translationIndex = answers.indexOf(translation);

        handleSetData(currentCard, true);
        setLearnedWords((prev) => [...prev, selectedWord]);
        setSelectedWord(null);

        const newCard = getNewWord();
        if (!newCard) return;
        const newWords = [...words];
        const newAnswers = [...answers];

        newWords[wordIndex] = newCard.word;
        newAnswers[translationIndex] = newCard.translateWord;

        setAnsweredWords((prev) => [...prev, newCard.word]);
        setWords(newWords);
        setAnswers(newAnswers);

        setAnimateNewWord(newCard.word);
        setAnimateNewAnswer(newCard.translateWord);

        newFadeAnim.setValue(0);
        Animated.timing(newFadeAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }).start(() => {
          // Clear animate markers after the animation completes.
          setAnimateNewWord(null);
          setAnimateNewAnswer(null);
        });
      } else {
        setWrongAnswer(translation);
        handleSetData(currentCard, false);
        setTimeout(() => {
          setWrongAnswer(null);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (learnedWords.length === learningCards.length) {
      onComplete();
    }
  }, [learnedWords, learningCards.length, onComplete]);

  const isAllCardsLearned = answeredWords.length === learningCards.length;
  const isTranslateDisappear = (item: string) => {
    const word = learningCards.find(
      (card) => card.translateWord === item,
    )?.word;
    return learnedWords.includes(word || '');
  };

  const renderWordItem = ({ item }: { item: string }) => {
    const animatedStyle =
      animateNewWord && animateNewWord === item ? { opacity: newFadeAnim } : {};
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          key={item}
          onPress={() => setSelectedWord(item)}
          style={[
            styles.optionItem,
            {
              backgroundColor:
                selectedWord === item
                  ? colors.lightText
                  : colors.lightBackground,
              opacity: isAllCardsLearned && learnedWords.includes(item) ? 0 : 1,
            },
          ]}
        >
          <ThemeText style={{ fontSize: width < 800 ? 15 : 30 }}>
            {item}
          </ThemeText>
        </Pressable>
      </Animated.View>
    );
  };

  const renderAnswerItem = ({ item }: { item: string }) => {
    const animatedStyle =
      animateNewAnswer && animateNewAnswer === item
        ? { opacity: newFadeAnim }
        : {};
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          key={item}
          style={[
            styles.optionItem,
            {
              backgroundColor:
                wrongAnswer === item ? '#FC8277' : colors.lightBackground,
              opacity: isAllCardsLearned && isTranslateDisappear(item) ? 0 : 1,
            },
          ]}
          onPress={() => checkSelectedWordCorrect(item)}
        >
          <ThemeText style={{ fontSize: width < 800 ? 15 : 30 }}>
            {item}
          </ThemeText>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.optionsContainer}>
      <FlatList
        data={words}
        keyExtractor={(item) => item}
        renderItem={renderWordItem}
        contentContainerStyle={styles.listContainer}
      />
      <FlatList
        data={answers}
        keyExtractor={(item) => item}
        renderItem={renderAnswerItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default LearnCheck;
