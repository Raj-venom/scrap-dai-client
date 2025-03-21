import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import categoryService from '@/services/category/categoryService';
import { Scrap, ScrapCategory } from '@/types/type';

export default function ScrapRatesScreen(): JSX.Element {
    const [searchQuery, setSearchQuery] = useState('');
    const [scrapCategory, setScrapCategory] = useState<ScrapCategory[]>([]);

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

    const filteredCategories = searchQuery.trim() === ''
        ? scrapCategory
        : scrapCategory.map(category => {
            const filteredItems = category.scraps.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return {
                ...category,
                scraps: filteredItems 
            };
        }).filter(category => category.scraps.length > 0);


    const renderScrapItem = (item: Scrap) => (
        <View key={item._id} className="flex-row items-center bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4">
                <Image
                    source={{ uri: item.scrapImage }}
                    className="w-5 h-5"
                    resizeMode="contain"
                />
            </View>
            <Text className="flex-1 text-base font-medium">{item.name}</Text>
            <Text className="text-base text-green-600 font-bold">रु{item.pricePerKg}/kg</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="pb-4 px-4 bg-white border-b border-gray-200">

                {/* Search Bar */}
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                    <Ionicons name="search-outline" size={20} color="gray" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Search scrap items..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="gray" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1 px-4 py-4">
                {filteredCategories.map((category) => (
                    <View key={category._id} className="mb-6">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-lg font-bold">{category.name}</Text>
                            <View className="h-1 flex-1 bg-gray-200 ml-3 rounded-full" />
                        </View>
                        {category.scraps.map(renderScrapItem)}
                    </View>
                ))}

                {/* Extra space at bottom for better scrolling */}
                <View className="h-16" />
            </ScrollView>
        </SafeAreaView>
    );
}