import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NextButton from '@/components/NextButton';
import * as ImagePicker from 'expo-image-picker';

// Define type for image item
interface ScrapImage {
    uri: string;
    type: string;
    id: string;
}

export default function UploadScrapImagesScreen(): JSX.Element {
    const router = useRouter();
    const [images, setImages] = useState<ScrapImage[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Maximum number of images allowed
    const MAX_IMAGES = 4;

    // Pick images from device library
    const pickImages = async () => {
        if (images.length >= MAX_IMAGES) {
            Alert.alert('Maximum limit reached', `You can upload up to ${MAX_IMAGES} images only.`);
            return;
        }

        setIsUploading(true);

        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to your photo library to upload images.');
                setIsUploading(false);
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                allowsMultipleSelection: true,
                selectionLimit: MAX_IMAGES - images.length,
            });

            if (!result.canceled) {
                const selectedAssets = result.assets;

                // Add selected images to state
                const newImages = selectedAssets.map(asset => ({
                    uri: asset.uri,
                    type: 'image/jpeg', // Assume JPEG for simplicity
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                }));

                setImages(prevImages => {
                    const updatedImages = [...prevImages, ...newImages];
                    // Limit to maximum allowed
                    return updatedImages.slice(0, MAX_IMAGES);
                });
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Error', 'Failed to select images. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Take a photo with camera
    const takePhoto = async () => {
        if (images.length >= MAX_IMAGES) {
            Alert.alert('Maximum limit reached', `You can upload up to ${MAX_IMAGES} images only.`);
            return;
        }

        setIsUploading(true);

        try {
            // Request permissions
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to your camera to take photos.');
                setIsUploading(false);
                return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const asset = result.assets[0];

                // Add taken photo to state
                const newImage = {
                    uri: asset.uri,
                    type: 'image/jpeg', // Assume JPEG for simplicity
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                };

                setImages(prevImages => [...prevImages, newImage]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Remove an image
    const removeImage = (id: string) => {
        setImages(prevImages => prevImages.filter(image => image.id !== id));
    };

    // Check if form is complete (at least one image)
    const isFormComplete = () => {
        return images.length > 0;
    };

    return (
        <View className="flex-1 bg-white">
            {/* Main content */}
            <ScrollView className="flex-1 px-4 py-4">
                <Text className="text-lg font-JakartaBold mb-2">Upload Scrap Images</Text>
                <Text className="text-sm text-gray-500 mb-4">
                    Upload clear images of your scrap materials. This helps in faster verification by collectors.
                </Text>

                {/* Image upload area */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-base font-medium">Scrap Images</Text>
                        <Text className="text-sm text-gray-500">
                            {images.length}/{MAX_IMAGES} (Min: 1)
                        </Text>
                    </View>

                    {/* Image upload options */}
                    <View className="flex-row justify-between mb-4">
                        <TouchableOpacity
                            className="flex-1 mr-2 py-3 border border-gray-300 rounded-md items-center justify-center flex-row"
                            onPress={pickImages}
                            disabled={isUploading || images.length >= MAX_IMAGES}
                        >
                            <Ionicons name="images-outline" size={20} color="#22c55e" />
                            <Text className="ml-2 text-green-600 font-medium">Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 ml-2 py-3 border border-gray-300 rounded-md items-center justify-center flex-row"
                            onPress={takePhoto}
                            disabled={isUploading || images.length >= MAX_IMAGES}
                        >
                            <Ionicons name="camera-outline" size={20} color="#22c55e" />
                            <Text className="ml-2 text-green-600 font-medium">Camera</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Loading indicator */}
                    {isUploading && (
                        <View className="items-center justify-center py-4">
                            <ActivityIndicator size="large" color="#22c55e" />
                            <Text className="text-gray-500 mt-2">Processing image...</Text>
                        </View>
                    )}

                    {/* Image preview grid */}
                    <View className="flex-row flex-wrap">
                        {images.map((image) => (
                            <View key={image.id} className="w-1/2 p-1 relative">
                                <Image
                                    source={{ uri: image.uri }}
                                    className="h-40 rounded-md"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    className="absolute top-3 right-3 bg-black/50 rounded-full p-1"
                                    onPress={() => removeImage(image.id)}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* Placeholder when no images */}
                        {images.length === 0 && (
                            <View className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md items-center justify-center">
                                <Ionicons name="images-outline" size={48} color="#d1d5db" />
                                <Text className="text-gray-400 mt-2">No images selected</Text>
                            </View>
                        )}
                    </View>

                    {/* Instructions */}
                    <View className="mt-4 p-3 bg-gray-50 rounded-md">
                        <Text className="text-sm text-gray-600">
                            <Text className="font-medium">Tips: </Text>
                            Take clear photos in good lighting. Ensure the scrap material is clearly visible. This helps collectors assess the quality and condition accurately.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Next button */}
            <View className="p-7 z-10">
                <NextButton
                    isFormComplete={isFormComplete()}
                    nextRoute="/confirm"
                />
            </View>
        </View>
    );
}