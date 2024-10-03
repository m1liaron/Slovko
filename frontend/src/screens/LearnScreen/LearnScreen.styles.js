import { StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        flex: 1,
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        gap: 10
    },
})

export default styles;