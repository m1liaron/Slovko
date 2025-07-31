import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { AppPath } from '@/common/enums/app/AppPath';
import type { IResultMode, IWord, ModeName } from '@/common/enums/types/types';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { RootStackParamList } from '@/navigation/ProtectedRoute/ProtectedRoute';
import type { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Text,
  View,
} from 'react-native';
import PressableButton from '../../common/components/PressableButton/PressableButton';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import BackButton from '../../components/BackButton/BackButton';
import Loading from '../../components/Loading';
import { useAppTheme } from '../../contexts/ThemeProvider';
import { getResultDetails } from '../../redux/resultReducer/resultSlice';
import { formatDMTDate, formatTime } from '../../utils/utils';
import styles from './ResultDetailsScreen.styles';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

type ResultDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.ResultDetails
>;

const ResultDetailsScreen: React.FC<ResultDetailsScreenProps> = ({ route }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { resultId } = route.params as { resultId: string };
  const { result, isLoading } = useAppSelector((state) => state.results);
  const [selectedMode, setSelectedMode] = useState<ModeName>('flashCards'); // 0 - flashCards, 1 - quiz, 2 - guessWord
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(enqueueOrDispatch(getResultDetails, resultId));
  }, [resultId]);

  const modesMap = useMemo((): Partial<Record<ModeName, IResultMode>> => {
    if (!result?.mode) return {};
    return result.mode.reduce(
      (acc, modeItem) => {
        const modeKey = modeItem.mode as ModeName;
        acc[modeKey] = modeItem;
        return acc;
      },
      {} as Partial<Record<ModeName, IResultMode>>,
    );
  }, [result?.mode]);

  if (!result) {
    return <ActivityIndicator />;
  }

  const resultTime =
    new Date(result.completionTime).getTime() -
    new Date(result.startedLearn).getTime();
  const formattedTime = formatTime(resultTime);

  const calculateCorrectPercentage = (): number => {
    const words: IWord[] = modesMap[selectedMode]?.words || [];
    const totalWords = words.length;
    const correctWords = words.filter(
      (word) => word.mistakesAmount === 0,
    ).length;
    return totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  };

  const correctPercentage = calculateCorrectPercentage();

  const modesOptionsButtons: { key: ModeName; label: string }[] = [
    { key: 'flashCards', label: i18n.t('resultDetailsScreen.flashCards') },
    { key: 'check', label: i18n.t('resultDetailsScreen.check') },
    { key: 'quiz', label: i18n.t('resultDetailsScreen.quiz') },
    { key: 'guessWord', label: i18n.t('resultDetailsScreen.guessWord') },
  ];

  const renderModeButtons = () => {
    return modesOptionsButtons
      .filter(
        (modeOption) =>
          modesMap[modeOption.key] &&
          Boolean(modesMap[modeOption.key]?.words?.length),
      )
      .map((modeOption) => (
        <PressableButton
          key={modeOption.key}
          text={modeOption.label}
          buttonStyle={{
            backgroundColor:
              selectedMode === modeOption.key ? '#004da4' : '#007AFF',
            padding: 4,
          }}
          onPress={() => setSelectedMode(modeOption.key)}
        />
      ));
  };

  const title = new Date(result.title);
  const isTitleNotDate = Number.isNaN(title.getTime());

  return (
    <ThemeBackground>
      <View
        style={[styles.header, { backgroundColor: colors.lightBackground }]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <BackButton />
          {isTitleNotDate && (
            <ThemeText style={[styles.title]}>{result.title}</ThemeText>
          )}
        </View>
      </View>

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress percentage={correctPercentage} />
      </View>

      <View style={{ marginHorizontal: 50 }}>
        <View style={styles.buttonsContainer}>{renderModeButtons()}</View>
        {isLoading && <Loading />}
        {modesMap[selectedMode] && (
          <FlatList
            style={{ height: 400, width: '100%' }}
            data={modesMap[selectedMode]?.words}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.itemContainer,
                  { backgroundColor: colors.lightBackground },
                ]}
              >
                <View style={styles.resultContainer}>
                  <ThemeText style={[styles.title]}>
                    {item.word} - {item.translate}
                  </ThemeText>
                </View>
                <View style={styles.mistakesAmountContainer}>
                  <ThemeText style={[styles.title]}>
                    {item.mistakesAmount}
                  </ThemeText>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ThemeBackground>
  );
};

export default ResultDetailsScreen;
