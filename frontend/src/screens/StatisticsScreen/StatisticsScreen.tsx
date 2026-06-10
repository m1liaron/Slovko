import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';

import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { IStatistics, ModeName } from '@/common/enums/types/result.type';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';

import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import BackButton from '../../components/BackButton/BackButton';
import { selectResult } from '../../redux/resultReducer/resultSlice';
import { getResultsStatistics } from '../../redux/resultReducer/resultThunk';

const StatisticsScreen = () => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { statistics } = useAppSelector((state) => state.results);
  const [selectedMode, setSelectedMode] = useState<string>('flashCards');
  const [selectedWordsMode, setSelectedWordsMode] =
    useState<string>('wordLength'); // Mistakes || wordLength;
  const [selectedGraph, setSelectedGraph] = useState<string>('LineChart');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(enqueueOrDispatch(getResultsStatistics, {}));
  }, [dispatch]);

  const modesOptions = [
    { label: i18n.t('statisticsScreen.quiz'), value: 'quiz' },
    { label: i18n.t('statisticsScreen.guessWord'), value: 'guessWord' },
  ];

  const wordsModeOptions = [
    { label: i18n.t('statisticsScreen.wordLength'), value: 'wordLength' },
  ];

  const graphOptions = [
    { label: i18n.t('statisticsScreen.linear'), value: 'LinearChart' },
    { label: i18n.t('statisticsScreen.bar'), value: 'BarChart' },
    { label: i18n.t('statisticsScreen.pie'), value: 'PieChart' },
  ];

  const renderGraph = () => {
    if (!statistics) {
      return <ActivityIndicator />;
    }

    const chartConfig = {
      backgroundColor: colors.highlightColor,
      backgroundGradientFrom: colors.highlightDarkColor,
      backgroundGradientTo: colors.highlightColor,
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    };

    const selectedModeKey =
      selectedMode as keyof IStatistics['amountMistakesCards'];
    const selectedWordsModeKey =
      selectedWordsMode as keyof IStatistics['amountMistakesCards'][ModeName];

    const currentModeData = statistics.amountMistakesCards[selectedModeKey];

    if (!currentModeData) {
      return (
        <ThemeText style={{ fontSize: 40 }}>
          {i18n.t('statisticsScreen.noData')}
        </ThemeText>
      );
    }

    const data = {
      labels: statistics.resultsMonths,
      datasets: [
        {
          data: currentModeData[selectedWordsModeKey] || [],
        },
      ],
    };

    const chartWidth = Dimensions.get('window').width - 100;

    switch (selectedGraph) {
      case 'BarChart':
        return (
          <BarChart
            yAxisLabel=""
            yAxisSuffix=""
            data={data}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        );
      case 'PieChart':
        return (
          <PieChart
            data={statistics.amountMistakesCards[selectedModeKey][
              selectedWordsModeKey
            ].map((value, index) => ({
              name: statistics.resultsMonths[index],
              population: value,
              color: `rgba(131, 167, 234, ${1 - index * 0.1})`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            }))}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        );
      default:
        return (
          <LineChart
            data={data}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        );
    }
  };

  return (
    <ThemeBackground style={{ padding: 10 }}>
      <BackButton />

      {statistics === null || statistics.resultsMonths.length <= 0 ? (
        <ThemeText style={{ fontSize: 40 }}>
          {i18n.t('statisticsScreen.noData')}
        </ThemeText>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <RNPickerSelect
                onValueChange={(value) => setSelectedMode(value)}
                items={modesOptions}
                value={selectedMode}
                placeholder={{
                  label: i18n.t('statisticsScreen.selectMode'),
                  value: 'flashCards',
                }}
                style={{
                  inputWeb: {
                    color: '#000',
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 5,
                  },
                  inputIOS: {
                    color: '#000',
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 5,
                    marginBottom: 10,
                  },
                  inputAndroid: {
                    color: '#000',
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 5,
                    marginBottom: 10,
                  },
                }}
              />
              <RNPickerSelect
                onValueChange={(value) => setSelectedWordsMode(value)}
                items={wordsModeOptions}
                value={selectedWordsMode}
                placeholder={{
                  label: i18n.t('statisticsScreen.mistakes'),
                  value: 'mistakes',
                }}
                style={{
                  inputWeb: {
                    color: '#000',
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 5,
                  },
                  inputIOS: {
                    color: '#000',
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 5,
                  },
                  inputAndroid: {
                    color: '#000',
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 5,
                  },
                }}
              />
            </View>

            <RNPickerSelect
              onValueChange={(value) => setSelectedGraph(value)}
              items={graphOptions}
              value={selectedGraph}
              placeholder={{
                label: i18n.t('statisticsScreen.selectGraph'),
                value: '',
              }}
              style={{
                inputWeb: {
                  color: '#000',
                  padding: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5,
                },
                inputIOS: {
                  color: '#000',
                  padding: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5,
                },
                inputAndroid: {
                  color: '#000',
                  padding: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5,
                },
              }}
            />
          </View>

          <View style={{ margin: 20 }}>
            {statistics?.amountMistakesCards ? renderGraph() : null}
          </View>
        </>
      )}
    </ThemeBackground>
  );
};

export default StatisticsScreen;
