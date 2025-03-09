import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ScrapCategory from '@/components/ScrapCategory';
import NextButton from '@/components/NextButton';

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
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);

  const handleToggleSelect = (id: number) => {
    setSelectedMaterials(prevSelected => {
      // If already selected, remove it
      if (prevSelected.includes(id)) {
        return prevSelected.filter(materialId => materialId !== id);
      }
      // If not selected, add it
      else {
        return [...prevSelected, id];
      }
    });
  };

  // Check if a material is selected
  const isSelected = (id: number) => {
    return selectedMaterials.includes(id);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Main content */}
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-lg font-JakartaBold mb-2">Select Scrap material</Text>

        <View className="flex-row flex-wrap w-full justify-between">
          {scrapMaterials.map((material) => (
            <ScrapCategory
              key={material.id}
              id={material.id}
              type={material.type}
              description={material.description}
              iconName={material.iconName}
              isSelected={isSelected(material.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next button */}
      <View className="p-7 z-10">
        <NextButton isFormComplete={selectedMaterials.length > 0} nextRoute="/select-category" />
      </View>

    </View>
  );
}