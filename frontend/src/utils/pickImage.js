import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const pickImage = async (imageUri, setImageUri) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });

  if (!result.canceled) {
    const compressedResult = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );

    if (Platform.OS === 'web') {
      const response = await fetch(compressedResult.uri);
      const blob = await response.blob();
      const imageUri = URL.createObjectURL(blob);
      setImageUri(imageUri);
    } else {
      const localUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;

      try {
        await FileSystem.moveAsync({
          from: compressedResult.uri,
          to: localUri,
        });
        setImageUri(localUri);
      } catch (error) {
        console.error('Сталася помилка при збереганні зображення:', error);
      }
    }
  }
};

export default pickImage;
