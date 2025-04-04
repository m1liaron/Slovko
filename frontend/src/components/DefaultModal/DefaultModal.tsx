import React, { useEffect, useRef } from "react";
import {
	View,
	Modal,
	Pressable,
	Animated,
	useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./styles";
import { useAppTheme } from "../../contexts/ThemeProvider";

/**
 * @param isVisible { boolean}
 * @param handleClose {function}
 * @param modalStyle {object}
 * @param backgroundColor {string}
 * @param animationType {"none" || "slide" || "fade"}
 * @param children {object}
 * @returns {JSX.Element}
 * @constructor
 */

const DefaultModal = ({
	isVisible,
	handleClose,
	modalStyle,
	backgroundColor,
	animationType,
	children,
}) => {
	const { width } = useWindowDimensions();
	const { theme } = useAppTheme();
	const opacity = useRef(new Animated.Value(0)).current; // Initial opacity for fade-in
	const scale = useRef(new Animated.Value(0.8)).current; // Initial scale for zoom-in

	useEffect(() => {
		if (isVisible) {
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.spring(scale, {
					toValue: 1,
					useNativeDriver: true,
					speed: 12,
					bounciness: 6,
				}),
			]).start();
		} else {
			Animated.timing(opacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible, opacity, scale]);

	const handleOverlayPress = (event) => {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	};

	return (
		<Modal
			visible={isVisible}
			onRequestClose={handleClose}
			transparent={true}
			animationType={animationType}
		>
			<Pressable
				style={[
					styles.modalContainer,
					{ backgroundColor: backgroundColor || "rgba(0, 0, 0, 0.5)" },
				]}
				onPress={handleOverlayPress}
			>
				<Animated.View
					style={[
						styles.modalContent,
						modalStyle,
						{
							width: width - 100,
							maxWidth: 400,
							opacity: opacity,
							transform: [{ scale: scale }],
							backgroundColor: theme.colors.background,
							margin: 50,
						}, // Applying animated opacity and scale
					]}
				>
					<View style={styles.header}>
						<Icon
							name="times"
							size={30}
							onPress={handleClose}
							color={theme.colors.primary}
						/>
					</View>
					{children}
				</Animated.View>
			</Pressable>
		</Modal>
	);
};

export default DefaultModal;
