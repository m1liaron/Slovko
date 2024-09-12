import React, {useMemo, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native'
import BottomSheet from "@gorhom/bottom-sheet";

const BottomSheetComponent = () => {
    // const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

    return (
        <View style={styles.container}>
            <BottomSheet snapPoints={snapPoints}>
                <View style={styles.contentContainer}>
                    <Text style={styles.containerHeadline}>This is  Awesome!</Text>
                </View>
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#000',
        alignItems:'center',
        justifyContent:'center'
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#969696',
        alignItems: 'center',
    },
    containerHeadline: {
        fontSize:24
    }
});

export default BottomSheetComponent;
