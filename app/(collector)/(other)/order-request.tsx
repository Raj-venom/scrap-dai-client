import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Alert,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import orderService from '@/services/order/orderService';
import { OrderRequestCard } from '@/components/collector/order-request/OrderRequestCards';

// Types
export interface OrderRequest {
    pickupAddress: {
        formattedAddress: string;
        latitude: number;
        longitude: number;
    };
    _id: string;
    user: {
        _id: string;
        fullName: string;
        avatar?: string;
    };
    collector: {
        _id: string;
        fullName: string;
    } | null;
    pickUpDate: string;
    status: string;
    estimatedAmount: number;
    orderItem: OrderItem[];
    scrapImage: string[];
    pickUpTime: string;
    contactNumber: string;
    timeline: {
        date: string;
        time: string;
        message: string;
        _id: string;
    }[];
    feedback: any | null;
    createdAt: string;
    updatedAt: string;
    distance?: number; // Added for nearby orders
}

interface OrderItem {
    scrap: {
        _id: string;
        name: string;
        pricePerKg: number;
    };
    weight: number;
    amount: number;
    _id: string;
}

export interface OrderResponse {
    success: boolean;
    message: string;
    data: OrderRequest[];
    statusCode: number;
}

// FilterBar Component
const FilterBar: React.FC<{
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}> = ({ activeFilter, onFilterChange }) => {
    const filters = ["All", "Nearby", "High Value", "Recent"];

    return (
        <View className="flex-row mt-4 mb-4 px-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        className={`px-4 py-2 mr-2 rounded-full ${activeFilter === filter ? 'bg-green-500' : 'bg-gray-100'
                            }`}
                        onPress={() => onFilterChange(filter)}
                    >
                        <Text className={`font-medium ${activeFilter === filter ? 'text-white' : 'text-gray-600'
                            }`}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// Main Screen Component
const OrderRequestScreen: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [orders, setOrders] = useState<OrderRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const fetchOrders = useCallback(async (filter: string) => {
        setIsLoading(true);
        try {
            let response;
            switch (filter) {
                case "Nearby":
                    if (!userLocation) {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission Denied', 'Location permission is required for nearby orders.');
                            setActiveFilter("All");
                            return;
                        }
                        const location = await Location.getCurrentPositionAsync({});
                        const { latitude, longitude } = location.coords;
                        setUserLocation({ latitude, longitude });
                        response = await orderService.getNearbyOrders(latitude, longitude);
                    } else {
                        response = await orderService.getNearbyOrders(
                            userLocation.latitude,
                            userLocation.longitude
                        );
                    }
                    break;
                case "High Value":
                    response = await orderService.getHighValueOrders();
                    break;
                case "Recent":
                    response = await orderService.getNewOrderRequest();
                    break;
                default:
                    response = await orderService.getAllPendingOrders();
            }

            if (response.success) {
                setOrders(response.data);
            } else {
                console.error('API Error:', response);
                Alert.alert('Error', response.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert('Error', 'Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    }, [userLocation]);

    useEffect(() => {
        fetchOrders(activeFilter);
    }, [activeFilter, fetchOrders]);

    const handleAccept = async (orderId: string) => {
        try {
            setIsLoading(true);
            const response = await orderService.acceptOrder(orderId);
            if (response.success) {
                setOrders(orders.filter(order => order._id !== orderId));
                Alert.alert('Success', 'Order accepted successfully');
                router.push(`/order-navigation/${orderId}`);
            } else {
                Alert.alert('Error', response.message || 'Failed to accept order');
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            Alert.alert('Error', 'Failed to accept order');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (orderId: string) => {
        try {
            setIsLoading(true);

            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            Alert.alert('Success', 'Order rejected successfully');

        } catch (error) {
            console.error('Error rejecting order:', error);
            Alert.alert('Error', 'Failed to reject order');
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchOrders(activeFilter);
        setRefreshing(false);
    }, [activeFilter, fetchOrders]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <OrderRequestCard
                        order={item}
                        onAccept={() => handleAccept(item._id)}
                        onReject={() => handleReject(item._id)}
                    />
                )}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center py-8">
                        <Ionicons name="document-text-outline" size={64} color="gray" />
                        <Text className="text-gray-500 text-lg mt-4">
                            {isLoading ? 'Loading orders...' : 'No order requests available'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default OrderRequestScreen;