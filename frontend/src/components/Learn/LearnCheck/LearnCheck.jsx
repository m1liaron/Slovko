import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { useSelector } from 'react-redux';
import { selectCard } from '../../../redux/cardReducer/cardSlice';
import styles from './LearnCheck.styles';
import ThemeText from '../../../common/components/ThemeText/ThemeText';

const LearnCheck = ({ onComplete, handleSetDate }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const cards = useSelector(selectCard);
  const [selectedWord, setSelectedWord] = useState(null);
  const [words, setWords] = useState(cards.map(card => card.word).slice(0,4).sort(() => Math.random() - 0.5));
  const [answers, setAnswers] = useState(cards.map(card => card.translateWord).slice(0,4).sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(5);
  const [answeredWords, setAnsweredWords] = useState([...words]);

  const getNewWord = () => {
    let newCard;
    do {
      newCard = cards[Math.floor(Math.random() * cards.length)];
    } while (answeredWords.includes(newCard.word));
    return newCard;
  }

  const checkSelectedWordCorrect = (translation) => {
    if(currentIndex <= cards.length) {
      const wordIndex = words.indexOf(selectedWord);
      const translationIndex = answers.indexOf(translation);

      const correctTranslation = cards.find(card => card.word === selectedWord)?.translateWord;
      if (translation === correctTranslation) {
        let newCard = getNewWord();
        const newWords = [...words];
        const newAnswers = [...answers];

        newWords[wordIndex] = newCard.word;
        newAnswers[translationIndex] = newCard.translateWord;

        setAnsweredWords([...answeredWords, newCard.word]);
        setWords(newWords);
        setAnswers(newAnswers);
        setSelectedWord(null);
        setCurrentIndex(currentIndex + 1)
      }
    } else {
      console.log('No more words to show!')
    }
  }

  return (
    <View style={styles.optionsContainer}>
      <FlatList
        data={words}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelectedWord(item)} style={[ styles.optionItem, { backgroundColor: selectedWord === item ? "#38809b" : colors.lightBackground }]}>
            <ThemeText>{item}</ThemeText>
          </Pressable>
        )}
      />
      <FlatList
        data={answers}
        renderItem={({ item }) => (
          <Pressable style={styles.optionItem} onPress={() => checkSelectedWordCorrect(item)}>
            <ThemeText>{item}</ThemeText>
          </Pressable>
        )}
      />
    </View>
  );
};

export default LearnCheck;
