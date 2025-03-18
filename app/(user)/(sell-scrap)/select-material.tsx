import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ScrapCategory from '@/components/ScrapCategory';
import NextButton from '@/components/NextButton';
import categoryService from '@/services/category/categoryService';
import { ScrapCategory as ScrapCategoryType } from '@/types/type';

export default function SellScrapScreen(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [scrapCategory, setScrapCategory] = useState<ScrapCategoryType[]>([]);

  // Fetch Category from API
  useEffect(() => {
    ; (async () => {
      try {
        const response = await categoryService.getAllCategories();
        setScrapCategory(response.data);

      } catch (error) {
        console.error('API :: fetchCategory :: error', error);
      }
    })();
  }, []);

  const handleToggleSelect = (id: string) => {
    setSelectedCategory(prevSelected => {
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
  const isSelected = (id: string) => {
    return selectedCategory.includes(id);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Main content */}
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-lg font-JakartaBold mb-2">Select Scrap material</Text>

        <View className="flex-row flex-wrap w-full justify-between">
          {scrapCategory.map((material) => (
            <ScrapCategory
              key={material._id}
              id={material._id}
              type={material.name}
              description={material.description}
              image={material.image}
              isSelected={isSelected(material._id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next button */}
      <View className="p-7 z-10">
        <NextButton isFormComplete={selectedCategory.length > 0} nextRoute="/select-category" />
      </View>

    </View>
  );
}