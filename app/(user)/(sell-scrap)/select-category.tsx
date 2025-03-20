import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import NextButton from '@/components/NextButton';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubCategory } from '@/contexts/features/userOrder/orderSlice';
import { Scrap, ScrapCategory } from '@/types/type';


export default function SelectCategoryScreen(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get all data from Redux store at the component root level
  const selectedScrapCategoryWithSubCategory = useSelector((state: any) =>
    state.order.selectedScrapCategoryWithSubCategory
  );
  const storedSelectedSubCategory = useSelector((state: any) => state.order.selectedSubCategory);

  // State for tracking selected subcategories (scraps)
  const [selectedScraps, setSelectedScraps] = useState<Record<string, boolean>>({});

  // State for weights by category
  const [weights, setWeights] = useState<Record<string, string>>({});

  // Initialize selected scraps from Redux if available
  useEffect(() => {
    if (storedSelectedSubCategory && storedSelectedSubCategory.length > 0) {
      const initialSelectedScraps: Record<string, boolean> = {};
      storedSelectedSubCategory.forEach((scrapId: string) => {
        initialSelectedScraps[scrapId] = true;
      });
      setSelectedScraps(initialSelectedScraps);
    }
  }, [storedSelectedSubCategory]);

  // Function to toggle scrap selection
  const toggleScrapSelection = (scrapId: string) => {
    setSelectedScraps(prev => ({
      ...prev,
      [scrapId]: !prev[scrapId]
    }));
  };

  // Function to handle weight input
  const handleWeightChange = (categoryId: string, value: string) => {
    setWeights(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  // Check if any scrap is selected
  const isFormComplete = () => {
    return Object.keys(selectedScraps).some(key => selectedScraps[key]);
  };

  // Handle next button press
  const handleNextPress = () => {
    // Get all selected scrap IDs
    const selectedScrapIds = Object.keys(selectedScraps).filter(
      scrapId => selectedScraps[scrapId]
    );

    // Dispatch selected scraps to Redux store
    dispatch(setSelectedSubCategory(selectedScrapIds));
  };

  // Render scrap item for FlatList
  const renderScrapItem = ({ item }: { item: Scrap }) => (
    <TouchableOpacity
      key={item._id}
      className={`py-3 px-4 mr-3 mb-2 rounded-md border ${selectedScraps[item._id] ? 'bg-green-100 border-green-500' : 'border-gray-300'
        }`}
      onPress={() => toggleScrapSelection(item._id)}
      style={{ minWidth: 90 }}
    >
      <Text className="text-base font-medium text-center">{item.name}</Text>
      <Text className="text-sm text-gray-500 text-center mt-1">रु{item.pricePerKg}/kg</Text>
    </TouchableOpacity>
  );

  // Render category section
  const renderCategorySection = (category: ScrapCategory) => (
    <View key={category._id} className="mb-8">
      <Text className="text-lg font-bold mb-3">{category.name} Categories</Text>

      <FlatList
        data={category.scraps}
        renderItem={renderScrapItem}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      />

      <Text className="text-sm font-medium mt-2 mb-1">Enter Weight</Text>
      <View className="flex-row items-center">
        <TextInput
          className="border border-gray-300 rounded-md px-3 py-2 w-16 mr-2"
          keyboardType="numeric"
          placeholder="0.0"
          value={weights[category._id] || ''}
          onChangeText={(value) => handleWeightChange(category._id, value)}
        />
        <Text className="text-sm text-gray-500">kg</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 py-4">
        {selectedScrapCategoryWithSubCategory.map(renderCategorySection)}
      </ScrollView>

      {/* Next button */}
      <View className="p-7 z-10">
        <NextButton
          isFormComplete={isFormComplete()}
          nextRoute="/date-location"
          onPress={handleNextPress}
        />
      </View>
    </View>
  );
}