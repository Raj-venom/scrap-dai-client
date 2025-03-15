import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons, } from '@expo/vector-icons';

// Define types for our data
interface ScrapItem {
    id: string;
    name: string;
    price: string;
    icon: typeof Ionicons.defaultProps.name;
}

interface ScrapCategory {
    id: string;
    name: string;
    items: ScrapItem[];
}

export default function ScrapRatesScreen(): JSX.Element {
    const [searchQuery, setSearchQuery] = useState('');

    // Sample scrap rate data
    const categories: ScrapCategory[] = [
        {
            id: '1',
            name: 'Metal',
            items: [
                { id: '101', name: 'Steel', price: 'रु45/kg', icon: 'barbell-outline' },
                { id: '102', name: 'Brass', price: 'रु300/kg', icon: 'water-outline' },
                { id: '103', name: 'Tin', price: 'रु70/kg', icon: 'flower-outline' },
                { id: '104', name: 'Cans', price: 'रु50/kg', icon: 'beer-outline' },
                { id: '105', name: 'Aluminum', price: 'रु100/kg', icon: 'layers-outline' },
                { id: '106', name: 'Copper', price: 'रु400/kg', icon: 'flash-outline' },
            ]
        },
        {
            id: '2',
            name: 'Paper',
            items: [
                { id: '201', name: 'Copy', price: 'रु15/kg', icon: 'document-outline' },
                { id: '202', name: 'Books', price: 'रु8/kg', icon: 'book-outline' },
                { id: '203', name: 'Carton', price: 'रु10/kg', icon: 'cube-outline' },
                { id: '204', name: 'Tetra Pack', price: 'रु5/kg', icon: 'copy-outline' },
                { id: '205', name: 'Newspaper', price: 'रु12/kg', icon: 'newspaper-outline' },
                { id: '206', name: 'Magazines', price: 'रु7/kg', icon: 'journal-outline' },
            ]
        },
        {
            id: '3',
            name: 'Plastic',
            items: [
                { id: '301', name: 'PET Bottles', price: 'रु20/kg', icon: 'water-outline' },
                { id: '302', name: 'Hard Plastic', price: 'रु15/kg', icon: 'cube-outline' },
                { id: '303', name: 'Soft Plastic', price: 'रु10/kg', icon: 'bag-outline' },
                { id: '304', name: 'Mixed Plastic', price: 'रु8/kg', icon: 'apps-outline' },
            ]
        },
        {
            id: '4',
            name: 'Electronics',
            items: [
                { id: '401', name: 'Computer', price: 'रु400/piece', icon: 'desktop-outline' },
                { id: '402', name: 'Mobile Phone', price: 'रु100/piece', icon: 'phone-portrait-outline' },
                { id: '403', name: 'TV', price: 'रु200/piece', icon: 'tv-outline' },
                { id: '404', name: 'Refrigerator', price: 'रु500/piece', icon: 'snow-outline' },
                { id: '405', name: 'E-waste', price: 'रु70/kg', icon: 'hardware-chip-outline' },
            ]
        },
        {
            id: '5',
            name: 'Others',
            items: [
                { id: '501', name: 'Glass Bottles', price: 'रु2/kg', icon: 'wine-outline' },
                { id: '502', name: 'Batteries', price: 'रु50/kg', icon: 'battery-full-outline' },
                { id: '503', name: 'Rubber', price: 'रु10/kg', icon: 'ellipse-outline' },
                { id: '504', name: 'Cloth', price: 'रु5/kg', icon: 'shirt-outline' },
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

    // Render individual scrap item card
    const renderScrapItem = (item: ScrapItem) => (
        <View key={item.id} className="flex-row items-center bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4">
                <Ionicons name={item.icon} size={20} color="#16a34a" />
            </View>
            <Text className="flex-1 text-base font-medium">{item.name}</Text>
            <Text className="text-base text-green-600 font-bold">{item.price}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="pt-12 pb-4 px-4 bg-white border-b border-gray-200">
                <Text className="text-2xl font-bold text-center mb-4">Scrap Rates</Text>

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