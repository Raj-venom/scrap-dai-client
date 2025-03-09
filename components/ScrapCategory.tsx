import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface ScrapCategoryProps {
  id: number;
  type: string;
  description: string;
  iconName: string;
  onSelect: (id: number) => void;
}

export default function ScrapCategory({
  id,
  type,
  description,
  iconName,
  onSelect
}: ScrapCategoryProps): JSX.Element {
  return (
    <TouchableOpacity
      className="w-1/3 p-2"
      onPress={() => onSelect(id)}
    >
      <View className="border border-gray-200 rounded-md p-3 items-center justify-center h-32">
        <Ionicons
          name={iconName as any}
          size={24}
          color="#333"
          className="mb-2"
        />
        <Text className="font-medium text-center">{type}</Text>
        <Text className="text-xs text-gray-500 text-center mt-1">{description}</Text>
      </View>
    </TouchableOpacity>
  );
}