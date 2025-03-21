import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import NextButton from '@/components/NextButton';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubCategory, setSelectedSubCategoryWithWeights } from '@/contexts/features/userOrder/orderSlice';
import { Scrap, ScrapCategory } from '@/types/type';

// Updated interface for subcategory with weight
interface SubCategoryWithWeight {
  _id: string;
  weight: string;
}

export default function SelectCategoryScreen(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get all data from Redux store at the component root level
  const selectedScrapCategoryWithSubCategory = useSelector((state: any) =>
    state.order.selectedScrapCategoryWithSubCategory
  );
  const storedSelectedSubCategory = useSelector((state: any) => state.order.selectedSubCategory);
  const storedSubCategoryWithWeights = useSelector((state: any) => state.order.selectedSubCategoryWithWeights);

  // State for tracking selected subcategories (scraps)
  const [selectedScraps, setSelectedScraps] = useState<Record<string, boolean>>({});

  // State for weights by subcategory ID
  const [weights, setWeights] = useState<Record<string, string>>({});

  // Initialize selected scraps and weights from Redux if available
  useEffect(() => {
    if (storedSelectedSubCategory && storedSelectedSubCategory.length > 0) {
      const initialSelectedScraps: Record<string, boolean> = {};
      storedSelectedSubCategory.forEach((scrapId: string) => {
        initialSelectedScraps[scrapId] = true;
      });
      setSelectedScraps(initialSelectedScraps);
    }

    if (storedSubCategoryWithWeights && storedSubCategoryWithWeights.length > 0) {
      const initialWeights: Record<string, string> = {};
      storedSubCategoryWithWeights.forEach((item: SubCategoryWithWeight) => {
        initialWeights[item._id] = item.weight;
      });
      setWeights(initialWeights);
    }
  }, [storedSelectedSubCategory, storedSubCategoryWithWeights]);

  // Function to toggle scrap selection
  const toggleScrapSelection = (scrapId: string) => {
    setSelectedScraps(prev => ({
      ...prev,
      [scrapId]: !prev[scrapId]
    }));
  };

  // Function to handle weight input for each scrap
  const handleWeightChange = (scrapId: string, value: string) => {
    setWeights(prev => ({
      ...prev,
      [scrapId]: value
    }));
  };

 
  const isFormComplete = () => {
    // Get all selected scrap IDs
    const selectedScrapIds = Object.keys(selectedScraps).filter(scrapId => selectedScraps[scrapId]);

    // If no scraps are selected, form is incomplete
    if (selectedScrapIds.length === 0) {
      return false;
    }

    return selectedScrapIds.every(scrapId => {
      const weight = weights[scrapId];
      return weight !== undefined &&
        weight.trim() !== '' &&
        !isNaN(parseFloat(weight)) &&
        parseFloat(weight) > 0;
    });
  };

  // Handle next button press
  const handleNextPress = () => {
    // Get all selected scrap IDs
    const selectedScrapIds = Object.keys(selectedScraps).filter(
      scrapId => selectedScraps[scrapId]
    );

    // Create array of subcategories with weights
    const subcategoriesWithWeights: SubCategoryWithWeight[] = selectedScrapIds.map(id => ({
      _id: id,
      weight: weights[id] || '1' // Default to '1' if no weight entered
    }));

    // Dispatch selected scraps to Redux store
    dispatch(setSelectedSubCategory(selectedScrapIds));

    // Dispatch selected scraps with weights to Redux store
    dispatch(setSelectedSubCategoryWithWeights(subcategoriesWithWeights));
  };

  const renderScrapItem = ({ item }: { item: Scrap }) => (
    <View key={item._id}>
      <TouchableOpacity
        className={`py-3 px-4 mr-3 mb-2 rounded-md border ${selectedScraps[item._id] ? 'bg-green-100 border-green-500' : 'border-gray-300'
          }`}
        onPress={() => toggleScrapSelection(item._id)}
        style={{ minWidth: 90 }}
      >
        <Text className="text-base font-medium text-center">{item.name}</Text>
        <Text className="text-sm text-gray-500 text-center mt-1">रु{item.pricePerKg}/kg</Text>
      </TouchableOpacity>

      {/* Show weight input only for selected scraps */}
      {selectedScraps[item._id] && (
        <View className="mt-2 mb-4">
          <Text className="text-xs font-medium text-center mb-1">Weight</Text>
          <View className="flex-row items-center justify-center">
            <TextInput
              className="border border-gray-300 rounded-md px-2 py-1 w-12 mr-1"
              keyboardType="numeric"
              placeholder="0.0"
              value={weights[item._id] || ''}
              onChangeText={(value) => handleWeightChange(item._id, value)}
            />
            <Text className="text-xs text-gray-500">kg</Text>
          </View>
        </View>
      )}
    </View>
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