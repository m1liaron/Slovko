import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { IResult } from '@/common/enums/types/result.type';
import { useLanguage } from '@/contexts/LanguageProvider';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from '@expo/vector-icons';
import { Link, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import { AppPath } from '../../common/enums/app/app';
import { useAppTheme } from '../../contexts/ThemeProvider';
import {
  filterResults,
  getResults,
  resetResults,
  sortResults,
} from '../../redux/resultReducer/resultSlice';
import styles from './ResultsScreen.styles';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import RNPickerSelect from 'react-native-picker-select';

type GroupedResults = {
  [date: string]: IResult[];
};

const ResultsScreen = () => {
  const dispatch = useAppDispatch();
  const {
    theme: { colors },
  } = useAppTheme();
  const { results, haveMoreResults, firstResult, isLoading } = useAppSelector(
    (state) => state.results,
  );
  useLanguage();
  const navigation = useNavigation<StackNavigation>();
  const [filterValue, setFilterValue] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [groupedResults, setGroupedResults] = useState<GroupedResults>({});
  const [showResultsMonth, setShowResultsMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [showResultsYear, setShowResultsYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      const groupedData = groupResultsByDay(results);
      setGroupedResults(groupedData);
    }
  }, [results]);

  const groupResultsByDay = (results: IResult[]): GroupedResults => {
    return results.reduce<GroupedResults>((groups, item) => {
      const date = new Date(item.createdAt).toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  };

  useEffect(() => {
    setPage(1);
    dispatch(
      enqueueOrDispatch(getResults, {
        year: showResultsYear,
        month: showResultsMonth + 1,
        page: 1,
        replace: true,
      }),
    );
  }, [dispatch, showResultsMonth, showResultsYear]);

  const handleLoadMore = () => {
    if (haveMoreResults && !isLoading) {
      const nextPage = page + 1;
      dispatch(
        enqueueOrDispatch(getResults, {
          year: showResultsYear,
          month: showResultsMonth + 1,
          page: nextPage,
          replace: false,
        }),
      );
      setPage(nextPage);
    }
  };

  const handleSort = () => {
    dispatch(sortResults({ key: 'title', direction: sortOrder }));
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const renderFooter = () =>
    isLoading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;

  const monthes = i18n.t('resultsScreen.monthNames') as string[];
  const currentDate = new Date(showResultsYear, showResultsMonth);
  const firstResultDate = firstResult ? new Date(firstResult) : null;
  const moreFirstResult = firstResultDate
    ? currentDate > firstResultDate
    : false;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lessCurrentMonth = currentDate < new Date(currentYear, currentMonth);

  const decShowMonth = () => {
    if (showResultsMonth > 0) {
      setShowResultsMonth(showResultsMonth - 1);
    } else if (showResultsMonth === 0 && moreFirstResult) {
      setShowResultsMonth(monthes.length - 1);
      setShowResultsYear(showResultsYear - 1);
    }
  };

  const incShowMonth = () => {
    if (showResultsMonth === monthes.length - 1) {
      setShowResultsYear(showResultsYear + 1);
      setShowResultsMonth(0);
    } else {
      setShowResultsMonth(showResultsMonth + 1);
    }
  };

  const sortSelectStyle = {
    color: colors.primary,
    backgroundColor: colors.lightBackground,
    ...styles.sortSelect,
  };

  const sortOptions = [
    { label: i18n.t('sharedGroupsScreen.sortDate'), value: 'sortDate' },
    { label: i18n.t('sharedGroupsScreen.sortName'), value: 'sortName' },
    {
      label: i18n.t('sharedGroupsScreen.sortWordsAmount'),
      value: 'sortWordsAmount',
    },
  ];

  return (
    <ThemeBackground>
      <View style={{ justifyContent: 'center' }}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemeText style={{ fontSize: 40, fontWeight: 'bold' }}>
              {showResultsYear} -
            </ThemeText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {moreFirstResult && (
                <Pressable onPress={decShowMonth}>
                  <AntDesign
                    name="caretleft"
                    color={colors.primary}
                    size={30}
                  />
                </Pressable>
              )}
              <ThemeText style={{ fontSize: 40, fontWeight: 'bold' }}>
                {monthes[showResultsMonth]}
              </ThemeText>
              {lessCurrentMonth ? (
                <Pressable onPress={incShowMonth}>
                  <AntDesign
                    name="caretright"
                    color={colors.primary}
                    size={30}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.lightBackground,
          },
        ]}
      >
        <Ionicons name="search" size={20} color={colors.lightText} />
        <TextInput
          style={[styles.searchInput, { color: colors.primary }]}
          placeholder={i18n.t('sharedGroupsScreen.searchPlaceholder')}
          placeholderTextColor={colors.lightText}
          value={filterValue}
          onChangeText={setFilterValue}
        />
        <Pressable onPress={() => setShowFilter((prev) => !prev)}>
          {showFilter ? (
            <FontAwesome name="filter" size={21} color={colors.lightText} />
          ) : (
            <Feather name="filter" size={20} color={colors.lightText} />
          )}
        </Pressable>
      </View>

      {showFilter ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: colors.background,
            top: 100,
            left: 10,
            borderRadius: 20,
            padding: 20,
            zIndex: 2,
            borderColor: colors.lightText,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 20,
              alignItems: 'center',
            }}
          >
            <RNPickerSelect
              placeholder={{
                label: i18n.t('sharedGroupsScreen.sort'),
                value: 'sort',
              }}
              onValueChange={() => {}}
              items={sortOptions}
              style={{
                inputWeb: sortSelectStyle,
                inputIOS: sortSelectStyle,
                inputAndroid: sortSelectStyle,
              }}
            />
            <FontAwesome
              onPress={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              size={30}
              color={colors.primary}
              name={sortOrder == 'asc' ? 'sort-asc' : 'sort-desc'}
            />
          </View>
        </View>
      ) : null}

      <PressableButton
        text={i18n.t('resultsScreen.yourStats')}
        onPress={() => navigation.navigate(AppPath.Statistics)}
        buttonStyle={{ margin: 10 }}
      />

      <FlatList
        data={Object.entries(groupedResults)}
        contentContainerStyle={{ maxHeight: 500 }}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }: { item: [string, IResult[]] }) => (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 25,
                color: colors.lightText,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {item[0]} {/* Date */}
            </Text>
            {item[1].map((result) => (
              <Pressable
                key={result.id}
                style={[
                  styles.itemContainer,
                  { backgroundColor: colors.lightBackground },
                ]}
                onPress={() =>
                  navigation.navigate(AppPath.ResultDetails, {
                    resultId: result.id,
                  })
                }
              >
                <View style={styles.flex}>
                  <ThemeText
                    style={{
                      fontWeight: 'bold',
                      fontSize: 30,
                    }}
                  >
                    {result.title}
                  </ThemeText>
                  <Text style={{ color: colors.lightText, fontSize: 25 }}>
                    {`${i18n.t('resultsScreen.completed')} ${new Date(
                      result.createdAt,
                    )
                      .toLocaleTimeString()
                      .slice(0, 5)}`}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </ThemeBackground>
  );
};

export default ResultsScreen;
