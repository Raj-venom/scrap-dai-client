import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import ScrapCategory from '@/components/ScrapCategory';

// Define typings for material data
interface ScrapMaterial {
  id: number;
  type: string;
  description: string;
  iconName: string;
}


// Material categories data with Ionicons
const scrapMaterials: ScrapMaterial[] = [
  {
    id: 1,
    type: 'Metal',
    description: 'Copper, Brass, Iron, etc.',
    iconName: 'hardware-chip-outline'
  },
  {
    id: 2,
    type: 'Plastic',
    description: 'Container, soft plastic, etc.',
    iconName: 'water-outline'
  },
  {
    id: 3,
    type: 'Paper',
    description: 'Newspaper, Books, etc.',
    iconName: 'newspaper-outline'
  },
  {
    id: 4,
    type: 'Glass',
    description: 'Bottles, Jars, etc.',
    iconName: 'wine-outline'
  },
  {
    id: 5,
    type: 'E-Waste',
    description: 'Mobile phones, etc.',
    iconName: 'phone-portrait-outline'
  },
  {
    id: 6,
    type: 'Rubber',
    description: 'Old tires and other products',
    iconName: 'car-outline'
  },
  {
    id: 7,
    type: 'Textiles',
    description: 'Old clothes, Bedding, etc.',
    iconName: 'shirt-outline'
  },
];

export default function SellScrapScreen(): JSX.Element {
  const router = useRouter();

  // Handle material selection
  const handleMaterialSelect = (materialId: number): void => {
    console.log('Selected material:', materialId);

  };

  return (
    <View className="flex-1 bg-white">
      {/* Progress steps */}
      {/* <ProgressSteps currentStep={1} /> */}

      {/* Main content */}
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-lg font-JakartaBold mb-2">Select Scrap material</Text>

        <View className="flex-row flex-wrap mx-2 justify-between">
          {scrapMaterials.map((material) => (
            <ScrapCategory
              key={material.id}
              id={material.id}
              type={material.type}
              description={material.description}
              iconName={material.iconName}
              onSelect={handleMaterialSelect}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next button */}
      <View className="p-4">
        <TouchableOpacity
          className="bg-green-500 h-12 w-12 rounded-full items-center justify-center self-end"
          onPress={() => router.push('/select-category')}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}