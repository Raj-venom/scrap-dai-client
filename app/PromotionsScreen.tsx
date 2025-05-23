import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import promotionService from '@/services/promotion/promotionService';

interface Promotion {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    url?: string;
}


const PromotionsScreen = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPromotions = async () => {
        try {
            const res = await promotionService.getActivePromotions();
            if (res.success) {
                const activePromotions = res?.data?.filter((promo: Promotion) => promo.isActive);

                if (activePromotions) {
                    setPromotions(activePromotions);
                }

            } else {
                console.error('Error fetching promotions:', res.error);
            }

        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPromotions();
    };

    const handleUrlPress = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const renderPromotionItem = ({ item }: { item: Promotion }) => (
        <View className="bg-white rounded-lg mb-4 overflow-hidden shadow-md shadow-black/10">
            {item.imageUrl && (
                <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
            )}
            <View className="p-4">
                <Text className="text-lg font-bold mb-2">{item.title}</Text>
                <Text className="text-sm text-gray-600 mb-2">
                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                </Text>
                <Text className="text-base text-gray-800">{item.description}</Text>

                {item.url && (
                    <TouchableOpacity
                        className="flex-row items-center mt-3 p-3 bg-gray-100 rounded-md"
                        onPress={() => handleUrlPress(item.url!)}
                    >
                        <MaterialIcons name="public" size={24} color="#2563eb" />
                        <Text className="ml-3 text-blue-500 font-bold">Open Link</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <MaterialIcons name="local-offer" size={48} color="#ccc" />
                <Text className="mt-2">Loading promotions...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">
            <FlatList
                data={promotions}
                renderItem={renderPromotionItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center p-5">
                        <MaterialIcons name="local-offer" size={48} color="#ccc" />
                        <Text className="mt-2">No active promotions available</Text>
                    </View>
                }
            />
        </View>
    );
};

export default PromotionsScreen;