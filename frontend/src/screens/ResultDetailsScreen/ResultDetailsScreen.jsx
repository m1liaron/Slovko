import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import ThemeBackground from "../../common/components/ThemeBackground/Themebackground";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { getResultDetails } from "../../redux/resultReducer/resultSlice";
import formatDMTDate from "../../utils/formatDMTDate";
import { formatTime } from "../../utils/formatTime";
import styles from "./ResultDetailsScreen.styles";

const ResultDetailsScreen = ({ route }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { resultId } = route.params;
  const { result, isLoading } = useSelector((state) => state.results);
  const dispatch = useDispatch();

  // Instead of using an index, we store the selected mode as its key.
  // Default to the first mode that has words (if any) or default to "flashCards".
  const [selectedMode, setSelectedMode] = useState("flashCards");

  // Load result details on mount.
  useEffect(() => {
    dispatch(getResultDetails(resultId));
  }, [dispatch, resultId]);

  // Create a mapping of modes from the array for easier lookup.
  const modesMap = React.useMemo(() => {
    if (!result.mode) return {};
    return result.mode.reduce((acc, modeItem) => {
      acc[modeItem.mode] = modeItem;
      return acc;
    }, {});
  }, [result.mode]);

  // Calculate total learning time.
  const resultTime =
    new Date(result.completionTime) - new Date(result.startedLearn);
  const formattedTime = formatTime(resultTime);

  // Calculate correct percentage for the selected mode.
  const calculateCorrectPercentage = useCallback(() => {
    if (!modesMap[selectedMode] || !modesMap[selectedMode].words) return 0;
    const words = modesMap[selectedMode].words;
    const totalWords = words.length;
    const correctWords = words.filter(
      (word) => word.mistakesAmount === 0
    ).length;
    return totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  }, [modesMap, selectedMode]);

  const correctPercentage = calculateCorrectPercentage();

  // Define the available modes (keys and labels).
  const modesOptionsButtons = [
    { key: "flashCards", label: "Картки" },
    { key: "check", label: "Вибери переклад" },
    { key: "quiz", label: "Вікторина" },
    { key: "guessWord", label: "Вгадай слово" },
  ];

  // Render buttons for the modes that exist and have words.
  const renderModeButtons = () => {
    return modesOptionsButtons
      .filter(
        (modeOption) =>
          modesMap[modeOption.key] && modesMap[modeOption.key].words?.length > 0
      )
      .map((modeOption) => (
        <PressableButton
          key={modeOption.key}
          text={modeOption.label}
          buttonStyle={{
            backgroundColor:
              selectedMode === modeOption.key ? "#004da4" : "#007AFF",
            padding: 4,
          }}
          onPress={() => setSelectedMode(modeOption.key)}
        />
      ));
  };

  return (
    <ThemeBackground>
      <View
        style={[styles.header, { backgroundColor: colors.lightBackground }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <BackButton />
          <Text style={[styles.title, { color: colors.primary }]}>
            {result.title}
          </Text>
          <View
            style={[
              styles.wastedTimeContainer,
              { borderColor: colors.primary },
            ]}
          >
            <Text style={[styles.title, { color: colors.primary }]}>
              {formattedTime}
            </Text>
          </View>
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>
          {formatDMTDate(result.createdAt)}
        </Text>
      </View>

      <View
        style={{
          borderWidth: 4,
          borderColor: "#fff",
          backgroundColor: "#40FF80",
          borderRadius: 100,
          padding: 10,
          alignSelf: "center",
          marginVertical: 20,
        }}
      >
        <Text style={{ fontSize: 25, color: "#fff" }}>
          {correctPercentage}% Вірно
        </Text>
      </View>

      <View style={{ marginHorizontal: 50 }}>
        <View style={styles.buttonsContainer}>{renderModeButtons()}</View>
        {isLoading && <Loading />}
        {modesMap[selectedMode] && (
          <FlatList
            style={{ height: 600 }}
            data={modesMap[selectedMode].words}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.itemContainer,
                  { backgroundColor: colors.lightBackground },
                ]}
              >
                <View style={styles.resultContainer}>
                  <Text style={[styles.title, { color: colors.primary }]}>
                    {item.word} - {item.translate}
                  </Text>
                </View>
                <View style={styles.mistakesAmountContainer}>
                  <Text style={[styles.title, { color: colors.primary }]}>
                    {item.mistakesAmount}
                  </Text>
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
