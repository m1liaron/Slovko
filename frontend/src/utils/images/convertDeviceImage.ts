import { Platform } from "react-native";
import { convertBlobToBase64 } from "./convertBlobToBase64";
import { convertImageToBase64 } from "./convertImageToBase64";

const convertDeviceImage = async (image: string): Promise<string> => {
	let finalImageUri = image;
	if (Platform.OS === "web" && image.startsWith("blob:")) {
		try {
			finalImageUri = await convertBlobToBase64(image);
		} catch (error) {
			console.error("Error converting blob to base64:", error);
			return finalImageUri;
		}
	} else if (finalImageUri) {
		try {
			const base64Image = await convertImageToBase64(finalImageUri);
			finalImageUri = base64Image;
		} catch (error) {
			console.error("Error converting image to base64:", error);
			return finalImageUri;
		}
	}

	return finalImageUri;
};

export { convertDeviceImage };
