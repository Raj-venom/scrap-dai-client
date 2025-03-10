import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import NextButton from '@/components/NextButton';

// Define type for category items
interface CategoryItem {
  id: number;
  name: string;
  price: string;
}

// Define type for material categories
interface MaterialCategory {
  id: number;
  type: string;
  categories: CategoryItem[];
}

// Material subcategories data
const materialCategories: MaterialCategory[] = [
  {
    id: 1,
    type: 'Metal',
    categories: [
      { id: 101, name: 'Steel', price: '₹45/kg' },
      { id: 102, name: 'Brass', price: '₹300/kg' },
      { id: 103, name: 'Tin', price: '₹70/kg' },
      { id: 104, name: 'Cans', price: '₹50/kg' },
      { id: 105, name: 'Aluminum', price: '₹100/kg' },
      { id: 106, name: 'Copper', price: '₹400/kg' },
    ]
  },
  {
    id: 3,
    type: 'Paper',
    categories: [
      { id: 301, name: 'Copy', price: '₹15/kg' },
      { id: 302, name: 'Books', price: '₹8/kg' },
      { id: 303, name: 'Carton', price: '₹10/kg' },
      { id: 304, name: 'Tetra Pack', price: '₹5/kg' },
      { id: 305, name: 'Newspaper', price: '₹12/kg' },
      { id: 306, name: 'Magazines', price: '₹7/kg' },
    ]
  },
];

export default function SelectCategoryScreen(): JSX.Element {
  const router = useRouter();

  // TODO: Get selected material IDs from previous screen uSing router.query or context
  const selectedMaterialIds = [1, 3]; // Metal and Paper

  // Filter materials based on selected IDs
  const selectedMaterials = materialCategories.filter(material =>
    selectedMaterialIds.includes(material.id)
  );

  // State for weights by material
  const [weights, setWeights] = useState<Record<number, string>>({});

  // State for selected subcategories
  const [selectedCategories, setSelectedCategories] = useState<Record<number, boolean>>({});

  // Function to toggle category selection
  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Function to handle weight input
  const handleWeightChange = (materialId: number, value: string) => {
    setWeights(prev => ({
      ...prev,
      [materialId]: value
    }));
  };

  // Check if any category is selected and has weight
  const isFormComplete = () => {
    return Object.keys(selectedCategories).some(key => selectedCategories[parseInt(key)]);
  };

  // Render category item for FlatList
  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      key={item.id}
      className={`py-3 px-4 mr-3 mb-2 rounded-md border ${selectedCategories[item.id] ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}
      onPress={() => toggleCategorySelection(item.id)}
      style={{ minWidth: 90 }}
    >
      <Text className="text-base font-medium text-center">{item.name}</Text>
      <Text className="text-sm text-gray-500 text-center mt-1">{item.price}</Text>
    </TouchableOpacity>
  );

  // Render material section
  const renderMaterialSection = (material: MaterialCategory) => (
    <View key={material.id} className="mb-8">
      <Text className="text-lg font-bold mb-3">{material.type} Categories</Text>

      <FlatList
        data={material.categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
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
          value={weights[material.id] || ''}
          onChangeText={(value) => handleWeightChange(material.id, value)}
        />
        <Text className="text-sm text-gray-500">kg</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 py-4">
        {selectedMaterials.map(renderMaterialSection)}
      </ScrollView>

      {/* Next button */}
      <View className="p-7 z-10">
        <NextButton
          isFormComplete={isFormComplete()}
          nextRoute="/date-location"
        />
      </View>
    </View>
  );
}