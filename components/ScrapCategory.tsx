import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface ScrapCategoryProps {
  id: string;
  type: string;
  description: string;
  image: string; // Changed from iconName to image
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function ScrapCategory({
  id,
  type,
  description,
  image,
  isSelected,
  onToggleSelect
}: ScrapCategoryProps): JSX.Element {
  return (
    <TouchableOpacity
      className="w-1/3 p-2"
      onPress={() => onToggleSelect(id)}
    >
      <View
        className={`border rounded-md p-3 items-center justify-center h-32 ${isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200"
          }`}
      >
        <Image
          source={{ uri: image }}
          className="w-8 h-8"
          resizeMode="contain"
        />
        <Text
          className={`font-medium text-center ${isSelected ? "text-blue-600" : ""
            }`}
        >
          {type}
        </Text>
        <Text className="text-xs text-gray-500 text-center mt-1">{description}</Text>

        {isSelected && (
          <View className="absolute top-2 right-2">
            <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}