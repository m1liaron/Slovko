import React, {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import BackButton from "../../components/BackButton/BackButton";
import {SafeAreaView} from "react-native-safe-area-context";
import styles from './StreakScreen.styles'
import {useAppTheme} from "../../contexts/ThemeProvider";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/userReducer/userSlice";
import {View} from "react-native";

const StreakScreen = () => {
    const { theme: { colors } } = useAppTheme();
    const { user } = useSelector(selectUser)
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    const validatedMarkedDates = user?.streakDates.reduce((total, item) => {
        total[item.date] = { selected: true, marked: true, selectedColor: 'orange'}
        return total;
    }, {})
    const isDisableRightArrow = currentMonth.month === new Date().getMonth();


    function getLastDayOfCurrentMonth() {
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const lastDay = new Date(year, month, 0).getDate();

        return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    }


    console.log(validatedMarkedDates)
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <BackButton/>
            <View style={styles.calendarContainer}>
                <Calendar
                    markedDates={validatedMarkedDates}
                    initialDate={now}
                    minDate={now}
                    maxDate={getLastDayOfCurrentMonth()}
                    onDayPress={day => console.log('selected day', day)}
                    onDayLongPress={day => console.log('selected day', day)}
                    monthFormat={'yyyy MM'}
                    onMonthChange={month => setCurrentMonth(month.month)}
                    hideArrows={false} // Show navigation arrows
                    hideExtraDays={true}
                    disableMonthChange={false} // Allow changing months
                    firstDay={1}
                    hideDayNames={false} // Show days of the week
                    showWeekNumbers={false} // Optional: Remove week numbers
                    disableArrowLeft={false} // Enable left arrow
                    disableArrowRight={isDisableRightArrow} // Enable right arrow
                    enableSwipeMonths={true} // Allow swiping between months
                    style={{
                        borderWidth: 1,
                        borderColor: 'gray',
                        height: 350
                    }}
                    theme={{
                        backgroundColor: '#000000',
                        calendarBackground: colors.lightBackground,
                        textSectionTitleColor: '#b6c1cd',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: '#f54100',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#ffffff',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#f53500',
                        selectedDotColor: '#ffffff',
                        arrowColor: '#fff',
                        disabledArrowColor: '#d9e1e8',
                        monthTextColor: '#fff',
                        indicatorColor: '#fff',
                        textDayFontFamily: 'monospace',
                        textMonthFontFamily: 'monospace',
                        textDayHeaderFontFamily: 'monospace',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default StreakScreen;
