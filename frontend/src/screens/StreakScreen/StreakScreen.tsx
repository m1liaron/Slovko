import ThemeText from '@/common/components/ThemeText/ThemeText';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import PressableButton from '../../common/components/PressableButton/PressableButton';
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';
import BackButton from '../../components/BackButton/BackButton';
import { useAppTheme } from '../../contexts/ThemeProvider';
import { selectUser } from '../../redux/userReducer/userSlice';
import {
  buyFreeze,
  getUserStreakDates,
} from '../../redux/userReducer/userThunk';
import styles from './StreakScreen.styles';

type DateType = {
  month: number;
  year: number;
};

type MarkedDate = {
  selected: boolean;
  marked: boolean;
  selectedColor: string;
  dotColor: string;
  disableTouchEvent: boolean;
};

const StreakScreen = () => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { streakDates, user } = useAppSelector(selectUser);
  const [date, setDate] = useState<DateType>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const now = new Date();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (date?.month && date.year) {
      const { month, year } = date;
      dispatch(enqueueOrDispatch(getUserStreakDates, { month, year }));
    }
  }, [date, dispatch]);

  const validatedMarkedDates = streakDates?.length
    ? streakDates.reduce<{ [key: string]: MarkedDate }>((total, item) => {
        total[item.date.slice(0, 10)] = {
          selected: true,
          marked: true,
          selectedColor: item?.frozen ? '#2aaef5' : '#f54100',
          dotColor: item?.frozen ? '#2aaef5' : '#f54100',
          disableTouchEvent: true,
        };
        return total;
      }, {})
    : {};

  function getLastDayOfCurrentMonth() {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const lastDay = new Date(year, month, 0).getDate();

    return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }

  const earliestDate = streakDates?.length
    ? streakDates
        .map((item) => new Date(item.date))
        .reduce((earliest, current) =>
          current < earliest ? current : earliest,
        )
        .toISOString()
        .split('T')[0]
    : null;

  return (
    <ThemeBackground>
      <BackButton />
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={validatedMarkedDates}
          initialDate={now.toISOString().split('T')[0]}
          minDate={earliestDate}
          maxDate={getLastDayOfCurrentMonth()}
          monthFormat={'yyyy MM'}
          onMonthChange={(month: DateType) => setDate(month)}
          hideArrows={false} // Show navigation arrows
          hideExtraDays={true}
          disableMonthChange={false} // Allow changing months
          firstDay={1}
          hideDayNames={false} // Show days of the week
          showWeekNumbers={false} // Optional: Remove week numbers
          disableArrowLeft={false} // Enable left arrow
          disableArrowRight={false} // Enable right arrow
          enableSwipeMonths={true} // Allow swiping between months
          style={{
            borderRadius: 12,
            padding: 8,
            backgroundColor: colors.lightBackground,
            elevation: 3,
          }}
          theme={{
            calendarBackground: colors.lightBackground,
            monthTextColor: colors.primary,
            todayTextColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#fff',
            arrowColor: colors.primary,
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />

        {user?.frozen && (
          <View style={styles.frozenContainer}>
            <FontAwesome6
              name="fire-flame-simple"
              size={60}
              color="#2aaef5"
              style={styles.frozenIcon}
            />
            <ThemeText style={styles.frozenText}>
              {i18n.t('streakScreen.frozenAlreadyBought')}
            </ThemeText>
          </View>
        )}

        {user?.frozen === false && (
          <View style={styles.buyFreezeContainer}>
            <FontAwesome6
              name="fire-flame-simple"
              size={60}
              color="#2aaef5"
              style={styles.frozenIcon}
            />
            <PressableButton
              text={i18n.t('streakScreen.buyFreeze')}
              onPress={() => dispatch(buyFreeze({ froze: 100 }))}
            />
          </View>
        )}
      </View>
    </ThemeBackground>
  );
};

export default StreakScreen;
