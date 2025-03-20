import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import BackButton from "../../components/BackButton/BackButton";
import styles from "./StreakScreen.styles";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/userReducer/userSlice";
import { Text, View } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {
	buyFreeze,
	getUserStreakDates,
} from "../../redux/userReducer/userThunk";
import ThemeBackground from '../../common/components/ThemeBackground/Themebackground';

const StreakScreen = () => {
	const {
		theme: { colors },
	} = useAppTheme();
	const { streakDates, user: { frozen } } = useSelector(selectUser);
	const [date, setDate] = useState({});
	const dispatch = useDispatch();
	const now = new Date();

	useEffect(() => {
		if (Object.keys(date).length) {
			const { month, year } = date;
			dispatch(getUserStreakDates({ month, year }));
		}
	}, [date, dispatch]);

	const validatedMarkedDates = streakDates?.length
		? streakDates.reduce((total, item) => {
				total[item.date.slice(0, 10)] = {
					selected: true,
					marked: true,
					selectedColor: item?.frozen ? "#2aaef5" : "#f54100",
					dotColor: item?.frozen ? "#2aaef5" : "#f54100",
					disableTouchEvent: true,
				};
				return total;
			}, {})
		: {};

	function getLastDayOfCurrentMonth() {
		const year = now.getFullYear();
		const month = now.getMonth() + 1;

		const lastDay = new Date(year, month, 0).getDate();

		return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
	}

	const earliestDate = streakDates?.length
		? streakDates
				.map((item) => new Date(item.date))
				.reduce((earliest, current) =>
					current < earliest ? current : earliest,
				)
				.toISOString()
				.split("T")[0]
		: null;


	console.log(frozen)
	return (
		<ThemeBackground>
			<BackButton />
			<View style={styles.calendarContainer}>
				<Calendar
					markedDates={validatedMarkedDates}
					initialDate={now.toISOString().split("T")[0]}
					minDate={earliestDate}
					maxDate={getLastDayOfCurrentMonth()}
					onDayPress={(day) => console.log("selected day", day)}
					onDayLongPress={(day) => console.log("selected day", day)}
					monthFormat={"yyyy MM"}
					onMonthChange={(month) => setDate(month)}
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
						borderWidth: 1,
						borderColor: "gray",
						height: 450,
					}}
					theme={{
						backgroundColor: colors.background,
						calendarBackground: colors.lightBackground,
						textSectionTitleColor: "#b6c1cd",
						textSectionTitleDisabledColor: "#d9e1e8",
						selectedDayBackgroundColor: "#f54100",
						selectedDayTextColor: colors.primary,
						todayTextColor: "#00adf5",
						dayTextColor: colors.primary,
						textDisabledColor: "#d9e1e8",
						dotColor: "#f53500",
						selectedDotColor: colors.primary,
						arrowColor: colors.primary,
						disabledArrowColor: colors.primary,
						monthTextColor: colors.primary,
						indicatorColor: colors.primary,
						textDayFontFamily: "monospace",
						textMonthFontFamily: "monospace",
						textDayHeaderFontFamily: "monospace",
						textDayFontWeight: "300",
						textMonthFontWeight: "bold",
						textDayHeaderFontWeight: "300",
						textDayFontSize: 16,
						textMonthFontSize: 16,
						textDayHeaderFontSize: 16,
					}}
				/>

				<View
					style={{ width: 100, justifyContent: "center", alignItems: "center" }}
				>
					<FontAwesome6 name="fire-flame-simple" size={60} color="#2aaef5" />
					<PressableButton
						text="Купити Заморозку"
						onPress={() => dispatch(buyFreeze({ froze: 100 }))}
						buttonStyle={{ backgroundColor: !frozen && "#002d5d", padding: 20}}
						disabled={frozen}
					/>
					{frozen && <Text style={{ color: colors.primary }}>Заморозку вже купленно</Text>}
				</View>
			</View>
		</ThemeBackground>
	);
};

export default StreakScreen;
