import { Entypo } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { AppPath } from '@/common/enums/app/AppPath';
import type { IResultMode, IWord, ModeName } from '@/common/enums/types/types';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { RootStackParamList } from '@/navigation/ProtectedRoute/ProtectedRoute';

import PressableButton from '../../common/components/PressableButton/PressableButton';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import BackButton from '../../components/BackButton/BackButton';
import Loading from '../../components/Loading';
import { useAppTheme } from '../../contexts/ThemeProvider';
import {
  getResultDetails,
  getStateResult,
} from '../../redux/resultReducer/resultSlice';
import { formatDurationHHMMSS, formatMDYTime, formatTime } from '../../utils';

import styles from './ResultDetailsScreen.styles';

type ResultDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.ResultDetails
>;

const ResultDetailsScreen: React.FC<ResultDetailsScreenProps> = ({ route }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { width } = useWindowDimensions();
  const { resultId } = route.params as { resultId: string };
  const { result, isLoading } = useAppSelector((state) => state.results);
  const [selectedMode, setSelectedMode] = useState<ModeName>('flashCards'); // 0 - flashCards, 1 - quiz, 2 - guessWord
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(enqueueOrDispatch(getResultDetails, getStateResult, { resultId }));
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
          gradientColor={
            selectedMode === modeOption.key
              ? colors.highlightDarkColor
              : colors.highlightColor
          }
          buttonStyle={{
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: colors.lightText, fontSize: 20 }}>
          {formatMDYTime(result.createdAt)}
        </Text>
        <Text style={{ color: colors.lightText, fontSize: 20 }}>
          {formatDurationHHMMSS(
            new Date(result.completionTime).getTime() -
              new Date(result.startedLearn).getTime(),
          )}
        </Text>
      </View>

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 20,
        }}
      >
        <CircularProgress percentage={correctPercentage} />
      </View>

      <View style={{ marginHorizontal: width < 640 ? 10 : 50 }}>
        <View style={styles.buttonsContainer}>{renderModeButtons()}</View>
        {isLoading && <Loading />}

        {modesMap[selectedMode] && (
          <FlatList
            style={{ height: 400, width: '100%' }}
            data={modesMap[selectedMode]?.words}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.itemContainer,
                  { backgroundColor: colors.lightBackground },
                ]}
              >
                <View style={styles.resultContainer}>
                  <ThemeText
                    style={[styles.title, { fontSize: width < 640 ? 15 : 25 }]}
                  >
                    {item.word} - {item.translate}
                  </ThemeText>
                </View>
                <View
                  style={[
                    styles.mistakesAmountContainer,
                    {
                      paddingVertical: 10,
                      paddingHorizontal: item.mistakesAmount >= 1 ? 14 : 10,
                      backgroundColor:
                        item.mistakesAmount === 0 ? '#81DC9F' : '#FC8277',
                    },
                  ]}
                >
                  {item.mistakesAmount === 0 ? (
                    <Entypo name="check" size={15} color={colors.background} />
                  ) : (
                    <Text
                      style={[
                        styles.title,
                        {
                          fontWeight: 'bold',
                          fontSize: width < 640 ? 15 : 25,
                        },
                      ]}
                    >
                      {item.mistakesAmount}
                    </Text>
                  )}
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
