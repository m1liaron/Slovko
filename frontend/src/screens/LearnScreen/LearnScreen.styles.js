import { StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        gap: 10
    },
})

export default styles;