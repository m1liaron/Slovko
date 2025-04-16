const convertBlobToBase64 = (blobUri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fetch(blobUri)
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                const readerResult = reader.result?.toString();
                if (readerResult) {
                    reader.onloadend = () => resolve(readerResult);
                    reader.onerror = () =>
                        reject(new Error("Failed to convert blob to base64"));
                    reader.readAsDataURL(blob);
                }
            })
            .catch((error) => reject(error));
    });
};


export { convertBlobToBase64 };