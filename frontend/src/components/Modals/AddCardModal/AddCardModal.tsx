import ThemeText from "@/common/components/ThemeText/ThemeText";
import DefaultModal from "@/components/DefaultModal/DefaultModal";
import { i18n } from "@/localization/i18n";
import { View } from "moti";
import React from "react";
import styles from "./AddCardModal.styles";
import PressableButton from "@/common/components/PressableButton/PressableButton";
import { Platform } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/ThemeProvider";
import { FlatList } from "react-native-gesture-handler";

const AddCardModal: React.FC = ({
    showAddModal, 
    setShowAddModal,
    setAddCardMode,
    addCardMode,
    handleFileChange,
    handleImportMobile,
    jsonOutput
}) => {
    const { theme: { colors } } = useAppTheme();

    return (
        <DefaultModal
            isVisible={showAddModal}
            handleClose={() => setShowAddModal(false)}
        >
            <View style={styles.formContainer}>
                <ThemeText style={styles.title}>
                    {i18n.t("group.cardList.addCardTitle")}
                </ThemeText>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <PressableButton
                        text={i18n.t("group.cardList.oneCard")}
                        onPress={() => setAddCardMode(0)}
                        buttonStyle={{
                            flex: 1,
                            backgroundColor: addCardMode === 0 ? "#002044" : "#007AFF",
                        }}
                    />
                    <PressableButton
                        text={i18n.t("group.cardList.manyCards")}
                        onPress={() => setAddCardMode(1)}
                        buttonStyle={{
                            flex: 1,
                            backgroundColor: addCardMode === 1 ? "#002044" : "#007AFF",
                        }}
                    />
                </View>

                {addCardMode ? (
                    <View style={styles.bulkAddContainer}>
                        {Platform.OS === "web" ? (
                            <View>
                                <View style={styles.fileInputContainer}>
                                    <Fontisto
                                        name="import"
                                        size={30}
                                        color={colors.background}
                                    />
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        style={styles.fileInput}
                                    />
                                </View>
                                <ThemeText>{i18n.t("group.cardList.fileTypes")}</ThemeText>
                            </View>
                        ) : (
                            <View>
                                <PressableButton
                                    text={i18n.t("group.cardList.importTxt")}
                                    onPress={handleImportMobile}
                                />
                            </View>
                        )}

                        {Object.keys(jsonOutput).length > 0 && (
                            <View style={styles.jsonTableContainer}>
                                <View style={styles.jsonTable}>
                                    <Text style={styles.jsonTableTitle}>
                                        {i18n.t("group.cardList.dataTitle")}
                                    </Text>
                                    <FlatList
                                        data={Object.entries(jsonOutput)}
                                        keyExtractor={([key]) => key}
                                        renderItem={({ item }) => {
                                            const [key, value] = item;
                                            return (
                                                <View key={value} style={styles.jsonRow}>
                                                    <Text style={styles.jsonKey}>{key}</Text>
                                                    <Text style={styles.jsonValue}>{value}</Text>
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <View>
                        <PressableButton
                            text={i18n.t("group.cardList.chooseImage")}
                            onPress={() => pickImage(imageUri, setImageUri)}
                        />
                        {imageUri !== "" && (
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        )}

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: 5,
                            }}
                        >
                            {unsplashImages.length > 0 &&
                                unsplashImages.map((image, index) => (
                                    <Pressable
                                        key={image.slice(0, 10)}
                                        style={{
                                            borderWidth: 4,
                                            borderColor:
                                                chosenImage === index ? "#679bd7" : colors.primary,
                                        }}
                                        onPress={() => setChosenPhoto(image, index)}
                                    >
                                        <Image
                                            key={image.slice(0, 10)}
                                            source={{ uri: image }}
                                            style={styles.image}
                                        />
                                    </Pressable>
                                ))}
                        </View>

                        <AddInput
                            value={value}
                            onChangeText={setValue}
                            placeholder={i18n.t("group.cardList.wordPlaceholder")}
                            onFocus={fetchUnsplashPhotos}
                        />

                        <AddInput
                            value={answerWord}
                            onChangeText={setAnswerWord}
                            placeholder={i18n.t("group.cardList.answerPlaceholder")}
                        />
                        <View style={{ flexDirection: "row" }}>
                            <ThemeText>{i18n.t("group.cardList.validation")} </ThemeText>
                            <Checkbox
                                value={isValidateWord}
                                onValueChange={setIsValidateWord}
                            />
                        </View>
                    </View>
                )}

                <PressableButton
                    onPress={onSaveCard}
                    text={i18n.t("group.cardList.addButton")}
                />
                {error && status === DataStatus.ERROR && (
                    <Text style={{ fontSize: 30, color: "#ff0000" }}>{error}</Text>
                )}
            </View>
        </Def>
    )
}
export { AddCardModal };