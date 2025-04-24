import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        width: "100%",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        maxWidth: 400,
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: "#fff",
        fontSize: 16,
        borderWidth: 0
    },
    passwordContainer: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        width: "100%",
        maxWidth: 400,
        marginBottom: 20,
        alignItems: "center"
    },
    iconContainer: {
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        width: "100%",
        maxWidth: 400,
        height: 50,
        backgroundColor: "#3498db",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    switchText: {
        color: "#3498db",
        fontSize: 14,
    },
});

export default styles;
