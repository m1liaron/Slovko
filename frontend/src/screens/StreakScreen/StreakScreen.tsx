import ThemeText from "@/common/components/ThemeText/ThemeText";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import BackButton from "../../components/BackButton/BackButton";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { selectUser } from "../../redux/userReducer/userSlice";
import {
	buyFreeze,
	getUserStreakDates,
} from "../../redux/userReducer/userThunk";
import styles from "./StreakScreen.styles";

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
	const dispatch = useAppDispatch();
	const now = new Date();

	useEffect(() => {
		if (date?.month && date.year) {
			const { month, year } = date;
			dispatch(getUserStreakDates({ month, year }));
		}
	}, [date, dispatch]);

	const validatedMarkedDates = streakDates?.length
		? streakDates.reduce<{ [key: string]: MarkedDate }>((total, item) => {
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

	return (
		<ThemeBackground>
			<BackButton />
			<View style={styles.calendarContainer}>
				<Calendar
					markedDates={validatedMarkedDates}
					initialDate={now.toISOString().split("T")[0]}
					minDate={earliestDate}
					maxDate={getLastDayOfCurrentMonth()}
					monthFormat={"yyyy MM"}
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

				{user?.frozen && (
					<View>
						<FontAwesome6 name="fire-flame-simple" size={60} color="#2aaef5" />
						<ThemeText>Заморозку вже купленно</ThemeText>
					</View>
				)}

				{user?.frozen === false ? (
					<View
						style={{
							width: 100,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<FontAwesome6 name="fire-flame-simple" size={60} color="#2aaef5" />
						<PressableButton
							text="Купити Заморозку"
							onPress={() => dispatch(buyFreeze({ froze: 100 }))}
							buttonStyle={{
								padding: 20,
							}}
							disabled={user.frozen}
						/>
					</View>
				) : null}
			</View>
		</ThemeBackground>
	);
};

export default StreakScreen;
