import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import type { ICard } from '@/common/enums/types/card.type';
import { useAppSelector } from '@/hooks/redux.hooks';

import styles from './LearnCrossWord.styles';

interface LearnCheckProps {
  onComplete: () => void;
  handleSetData: (card: ICard, isCorrect: boolean) => void;
}

type Coord = { row: number; col: number };

const LearnCrossWord: React.FC<LearnCheckProps> = () => {
  const { cards } = useAppSelector((state) => state.cards);
  const [crossWord, setCrossWord] = useState<string[][]>();
  const [selectedCoords, setSelectedCoords] = useState<Coord[]>([]);
  const [foundCoords, setFoundCoords] = useState<Set<string>>();
  const shownWords = cards.map((card) => card.word).slice(0, 11);
  const gridSize = Math.max(...shownWords.map((w) => w.length)) + 5;

  const generateCrossword = (words: string[]) => {
    const grid = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(''),
    );

    for (const word of words) {
      let placed = false;

      for (let attempt = 0; attempt < 100 && !placed; attempt++) {
        const dir = Math.random() < 0.5 ? 'H' : 'V';
        const row = Math.floor(Math.random() * gridSize);
        const column = Math.floor(Math.random() * gridSize);

        if (canBePlaced(word, grid, row, column, dir)) {
          placeWord(word, grid, row, column, dir);
          placed = true;
        }
      }
    }

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    return grid;
  };

  const canBePlaced = (
    word: string,
    grid: string[][],
    row: number,
    col: number,
    dir: string,
  ) => {
    const size = grid.length;
    if (dir === 'H' && col + word.length > size) return false;
    if (dir === 'V' && row + word.length > size) return false;

    for (let i = 0; i < word.length; i++) {
      const r = row + (dir === 'V' ? i : 0);
      const c = col + (dir === 'H' ? i : 0);
      const cell = grid[r][c];
      if (cell && cell !== word[i].toUpperCase()) return false;
    }
    return true;
  };

  const placeWord = (
    word: string,
    grid: string[][],
    row: number,
    col: number,
    dir: string,
  ) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + (dir === 'V' ? i : 0);
      const c = col + (dir === 'H' ? i : 0);
      grid[r][c] = word[i].toUpperCase();
    }
  };

  useEffect(() => {
    const crossWord = generateCrossword(shownWords);
    setCrossWord(crossWord);
  }, []);

  const keyForCoord = (r: number, c: number) => `${r}-${c}`;

  const handleSelectLetter = (rowIndex: number, colIndex: number) => {
    setSelectedCoords((prev) => {
      const alreadySelected = prev.some(
        (coord) => coord.row === rowIndex && coord.col === colIndex,
      );

      if (alreadySelected) {
        // Unselect it
        return prev.filter(
          (coord) => coord.row !== rowIndex || coord.col !== colIndex,
        );
      } else {
        // Add it
        return [...prev, { rowIndex, colIndex }];
      }
    });
  };

  return (
    <ThemeBackground>
      {crossWord?.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
          }}
        >
          {row.map((letter, colIndex) => (
            <Pressable
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: 40,
                height: 40,
                borderWidth: 1,
                borderColor: '#ddd',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: letter ? '#fff' : '#eee',
              }}
              onPress={() => handleSelectLetter(rowIndex, colIndex)}
            >
              <Text style={{ fontWeight: '600', fontSize: 16 }}>{letter}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ThemeBackground>
  );
};

export { LearnCrossWord };
