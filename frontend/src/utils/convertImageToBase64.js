const convertImageToBase64 = async (uri) => {
	const response = await fetch(uri);
	const blob = await response.blob();
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onloadend = () => {
			const base64data = reader.result.split(",")[1]; // Get the Base64 part
			resolve(base64data);
		};
		reader.onerror = () =>
			reject(new Error("Failed to convert image to base64"));
		reader.readAsDataURL(blob);
	});
};

export default convertImageToBase64;
