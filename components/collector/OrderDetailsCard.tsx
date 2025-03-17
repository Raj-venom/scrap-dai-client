import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import * as Location from 'expo-location';

// Type definitions
type ScrapItem = {
    id: string;
    name: string;
    estimatedWeight: number;
    price: number;
    weight?: number;
    amount?: number;
};

type OrderDetails = {
    id: string;
    customerName: string;
    address: string;
    scrapItems: ScrapItem[];
    destination: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    estimatedAmount: number;
    totalAmount?: number;
    phoneNumber: string;
};

type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const OrderDetailsCard: React.FC<{ orderDetails: OrderDetails; handleReachedDestination: () => void }> = ({ orderDetails, handleReachedDestination }) => {
    return (
        <View className="bg-white rounded-t-3xl px-4 pt-4 pb-8 shadow-lg">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold">{orderDetails.customerName}</Text>
                <TouchableOpacity
                    className="bg-primary py-1 px-3 rounded-full"
                    onPress={() => {
                        const phoneNumber = orderDetails?.phoneNumber || "9001";
                        Linking.openURL(`tel:${phoneNumber}`);
                    }}
                >
                    <Text className="text-white">Call</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row items-start mb-3">
                <Ionicons name="location-outline" size={16} color="gray" className="mt-1" />
                <Text className="text-gray-700 ml-1 flex-1">{orderDetails.address}</Text>
            </View>

            <View className="border-t border-gray-200 pt-3 mb-4">
                <Text className="text-gray-700 mb-2">Estimated Order Value: रु{orderDetails.estimatedAmount}</Text>
                <Text className="text-gray-700">Scrap Items:</Text>
                <View className="flex-row flex-wrap mt-1">
                    {orderDetails.scrapItems.map((item) => (
                        <View key={item.id} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                            <Text className="text-gray-700">{item.name}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity className="bg-primary py-3 rounded-lg" onPress={handleReachedDestination}>
                <Text className="text-white text-center font-bold">Reached Destination</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OrderDetailsCard;
