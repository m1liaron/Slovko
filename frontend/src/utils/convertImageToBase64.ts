const convertImageToBase64 = async (uri: string): Promise<string> => {
	const response = await fetch(uri);
	const blob = await response.blob();
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onloadend = () => {
			if (reader?.result && typeof reader.result === 'string') {
				const base64data = reader.result.split(',')[1]; // Get the Base64 part
				resolve(base64data);
			} else {
				reject(new Error("Failed to read file as base64 string"));
			}
		};
		reader.onerror = () =>
			reject(new Error("Failed to convert image to base64"));
		reader.readAsDataURL(blob);
	});
};

export { convertImageToBase64 };
