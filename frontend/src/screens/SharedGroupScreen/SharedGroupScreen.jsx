import React from 'react';
import { Text } from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppTheme} from "../../contexts/ThemeProvider";

const SharedGroupScreen = () => {
    const { theme: { colors } } = useAppTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Text></Text>
        </SafeAreaView>
    );
};

export default SharedGroupScreen;
