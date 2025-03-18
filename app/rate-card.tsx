import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScrapItem {
    id: string;
    name: string;
    price: string;
    image: string; 
}

interface ScrapCategory {
    id: string;
    name: string;
    items: ScrapItem[];
}

export default function ScrapRatesScreen(): JSX.Element {
    const [searchQuery, setSearchQuery] = useState('');

    const categories: ScrapCategory[] = [
        {
            id: '1',
            name: 'Metal',
            items: [
                { id: '101', name: 'Steel', price: 'रु45/kg', image: 'https://cdn-icons-png.flaticon.com/512/1356/1356593.png' },
                { id: '102', name: 'Brass', price: 'रु300/kg', image: 'https://cdn-icons-png.flaticon.com/512/2698/2698398.png' },
                { id: '103', name: 'Tin', price: 'रु70/kg', image: 'https://cdn-icons-png.flaticon.com/512/3063/3063446.png' },
                { id: '104', name: 'Cans', price: 'रु50/kg', image: 'https://cdn-icons-png.flaticon.com/512/599/599359.png' },
                { id: '105', name: 'Aluminum', price: 'रु100/kg', image: 'https://cdn-icons-png.flaticon.com/512/4248/4248399.png' },
                { id: '106', name: 'Copper', price: 'रु400/kg', image: 'https://cdn-icons-png.flaticon.com/512/2245/2245840.png' },
            ]
        },
        {
            id: '2',
            name: 'Paper',
            items: [
                { id: '201', name: 'Copy', price: 'रु15/kg', image: 'https://cdn-icons-png.flaticon.com/512/3094/3094841.png' },
                { id: '202', name: 'Books', price: 'रु8/kg', image: 'https://cdn-icons-png.flaticon.com/512/867/867390.png' },
                { id: '203', name: 'Carton', price: 'रु10/kg', image: 'https://cdn-icons-png.flaticon.com/512/679/679821.png' },
                { id: '204', name: 'Tetra Pack', price: 'रु5/kg', image: 'https://cdn-icons-png.flaticon.com/512/3168/3168652.png' },
                { id: '205', name: 'Newspaper', price: 'रु12/kg', image: 'https://cdn-icons-png.flaticon.com/512/3596/3596091.png' },
                { id: '206', name: 'Magazines', price: 'रु7/kg', image: 'https://cdn-icons-png.flaticon.com/512/4674/4674724.png' },
            ]
        },
        {
            id: '3',
            name: 'Plastic',
            items: [
                { id: '301', name: 'PET Bottles', price: 'रु20/kg', image: 'https://cdn-icons-png.flaticon.com/512/3103/3103993.png' },
                { id: '302', name: 'Hard Plastic', price: 'रु15/kg', image: 'https://cdn-icons-png.flaticon.com/512/2943/2943659.png' },
                { id: '303', name: 'Soft Plastic', price: 'रु10/kg', image: 'https://cdn-icons-png.flaticon.com/512/1357/1357622.png' },
                { id: '304', name: 'Mixed Plastic', price: 'रु8/kg', image: 'https://cdn-icons-png.flaticon.com/512/3141/3141163.png' },
            ]
        },
        {
            id: '4',
            name: 'Electronics',
            items: [
                { id: '401', name: 'Computer', price: 'रु400/piece', image: 'https://cdn-icons-png.flaticon.com/512/3507/3507241.png' },
                { id: '402', name: 'Mobile Phone', price: 'रु100/piece', image: 'https://cdn-icons-png.flaticon.com/512/545/545245.png' },
                { id: '403', name: 'TV', price: 'रु200/piece', image: 'https://cdn-icons-png.flaticon.com/512/2933/2933115.png' },
                { id: '404', name: 'Refrigerator', price: 'रु500/piece', image: 'https://cdn-icons-png.flaticon.com/512/3507/3507205.png' },
                { id: '405', name: 'E-waste', price: 'रु70/kg', image: 'https://cdn-icons-png.flaticon.com/512/2499/2499911.png' },
            ]
        },
        {
            id: '5',
            name: 'Others',
            items: [
                { id: '501', name: 'Glass Bottles', price: 'रु2/kg', image: 'https://cdn-icons-png.flaticon.com/512/2674/2674317.png' },
                { id: '502', name: 'Batteries', price: 'रु50/kg', image: 'https://cdn-icons-png.flaticon.com/512/3103/3103520.png' },
                { id: '503', name: 'Rubber', price: 'रु10/kg', image: 'https://cdn-icons-png.flaticon.com/512/3576/3576211.png' },
                { id: '504', name: 'Cloth', price: 'रु5/kg', image: 'https://cdn-icons-png.flaticon.com/512/3721/3721619.png' },
            ]
        }
    ];

    // Filter categories and items based on search query
    const filteredCategories = searchQuery.trim() === ''
        ? categories
        : categories.map(category => {
            const filteredItems = category.items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return {
                ...category,
                items: filteredItems
            };
        }).filter(category => category.items.length > 0);

    const renderScrapItem = (item: ScrapItem) => (
        <View key={item.id} className="flex-row items-center bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4">
                <Image
                    source={{ uri: item.image }}
                    className="w-5 h-5"
                    resizeMode="contain"
                />
            </View>
            <Text className="flex-1 text-base font-medium">{item.name}</Text>
            <Text className="text-base text-green-600 font-bold">{item.price}</Text>
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
                    <View key={category.id} className="mb-6">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-lg font-bold">{category.name}</Text>
                            <View className="h-1 flex-1 bg-gray-200 ml-3 rounded-full" />
                        </View>

                        {category.items.map(renderScrapItem)}
                    </View>
                ))}

                {/* Extra space at bottom for better scrolling */}
                <View className="h-16" />
            </ScrollView>
        </SafeAreaView>
    );
}