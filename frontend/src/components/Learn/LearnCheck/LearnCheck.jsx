import React, { useMemo, useState } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { useSelector } from 'react-redux';
import { selectCard } from '../../../redux/cardReducer/cardSlice';
import styles from './LearnCheck.styles';
import ThemeText from '../../../common/components/ThemeText/ThemeText';

const LearnCheck = ({ onComplete }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const cards = useSelector(selectCard);

  const initialWords = useMemo(() => cards.map(card => card.word).slice(0,4).sort(() => Math.random() - 0.5), [cards]);
  const initialAnswers = useMemo(() => cards.map(card => card.translateWord).slice(0,4).sort(() => Math.random() - 0.5), [cards]);

  const [selectedWord, setSelectedWord] = useState(null);
  const [words, setWords] = useState(initialWords);
  const [answers, setAnswers] = useState(initialAnswers);
  const [answeredWords, setAnsweredWords] = useState([...initialWords]); // it's current words + words that left to learn
  const [learnedWords, setLearnedWords] = useState([]) // it's only learned words

  const maxWordLen = cards.map(card => card.word.length);
  const maxWordWidth = Math.max(...maxWordLen);

  const getNewWord = () => {
    const remainingWords = cards.filter(card => !answeredWords.includes(card.word));
    if (remainingWords.length === 0) return null; // Avoid infinite loop

    return remainingWords[Math.floor(Math.random() * remainingWords.length)];
  }

  const checkSelectedWordCorrect = (translation) => {
      if(!selectedWord) return;

      const correctTranslation = cards.find(card => card.word === selectedWord)?.translateWord;

      if (translation === correctTranslation) {
        const wordIndex = words.indexOf(selectedWord);
        const translationIndex = answers.indexOf(translation);

        setLearnedWords([...learnedWords, selectedWord]);
        setSelectedWord(null);

        let newCard = getNewWord();
        if(!newCard) {
          return onComplete();
        }
        const newWords = [...words];
        const newAnswers = [...answers];

        newWords[wordIndex] = newCard.word;
        newAnswers[translationIndex] = newCard.translateWord;

        setAnsweredWords([...answeredWords, newCard.word]);
        setWords(newWords);
        setAnswers(newAnswers);
      }
  }

  const isAllCardsLearned = answeredWords.length === cards.length;
  const isTranslateDisappear = (item) => {
    const word = cards.find(card => card.translateWord === item)?.word;
    return learnedWords.includes(word);
  }

  return (
    <View style={styles.optionsContainer}>
      <FlatList
        data={words}
        keyExtractor={(item) => item}

        renderItem={({ item }) => (
          <Pressable
            key={item}
            onPress={() => setSelectedWord(item)}
            style={[ styles.optionItem, {
              width: maxWordWidth * 20,
              backgroundColor: selectedWord === item ? "#38809b" : colors.lightBackground,
              opacity: (isAllCardsLearned && learnedWords.includes(item)) ? 0 : 1 }
            ]}
          >
            <ThemeText style={{ fontSize: 30 }}>{item}</ThemeText>
          </Pressable>
        )}
        contentContainerStyle={styles.listContainer}
      />
      <FlatList
        data={answers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            key={item}
            style={[styles.optionItem, { width: maxWordWidth * 20, backgroundColor: colors.lightBackground , opacity: (isAllCardsLearned && isTranslateDisappear(item)) ? 0 : 1}]}
            onPress={() => checkSelectedWordCorrect(item)}
          >
            <ThemeText style={{ fontSize: 30 }}>{item}</ThemeText>
          </Pressable>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default LearnCheck;
