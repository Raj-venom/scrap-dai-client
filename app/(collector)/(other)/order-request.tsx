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

// ScrapImageGallery Component
const ScrapImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const screenWidth = Dimensions.get('window').width - 40; // 40 for padding

    if (images.length === 0) return null;

    return (
        <View className="mb-4">
            <Text className="font-bold text-base mb-2">Scrap Images</Text>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                    setActiveIndex(index);
                }}
            >
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image }}
                        style={{ width: screenWidth, height: 180, borderRadius: 8 }}
                        resizeMode="cover"
                    />
                ))}
            </ScrollView>

            {images.length > 1 && (
                <View className="flex-row justify-center mt-2">
                    {images.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

// OrderItemDetails Component
const OrderItemDetails: React.FC<{ order: OrderRequest }> = ({ order }) => {
    // const totalAmount = items.reduce((total, item) => total + (item.amount || 0), 0);
    // const totalAmount = 9999;

    const items = order.orderItem;

    return (
        <View className="mb-4">
            <Text className="font-bold text-base mb-2">Materials</Text>
            {items?.map((item) => (
                <View
                    key={item._id}
                    className="flex-row justify-between items-center py-2 border-b border-gray-100"
                >
                    <View className="flex-1">
                        <Text className="text-base">{item.scrap.name}</Text>
                    </View>
                    <View className="flex-row items-center flex-1 justify-end">
                        <Text className="text-gray-600">
                            {item.weight} kg × रु{item.scrap.pricePerKg}
                        </Text>
                    </View>
                    <View className="w-20 items-end">
                        <Text className="font-bold">रु{item.amount}</Text>
                    </View>
                </View>
            ))}
            <View className="flex-row justify-between items-center pt-3">
                <Text className="font-bold text-base">Total Estimated</Text>
                <Text className="font-bold text-lg text-green-600">
                    रु{order.estimatedAmount}
                </Text>
            </View>
        </View>
    );
};

// OrderRequestCard Component
const OrderRequestCard: React.FC<{
    order: OrderRequest;
    onAccept: (orderId: string) => void;
    onReject: (orderId: string) => void;
}> = ({ order, onAccept, onReject }) => {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <View className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
            <TouchableOpacity
                className="flex-row justify-between items-center p-4 border-b border-gray-100"
                onPress={() => setExpanded(!expanded)}
            >
                <View className="flex-row items-center">
                    {order.user.avatar ? (
                        <Image
                            source={{ uri: order.user.avatar }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                    ) : (
                        <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center mr-3">
                            <Text className="text-xl font-bold text-gray-600">
                                {order.user?.fullName.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <View>
                        <Text className="font-bold text-base">{order.user.fullName}</Text>
                        <View className="flex-row items-center">
                            <Text className="text-gray-500">
                                {formatDate(order.pickUpDate)}
                            </Text>
                            <Text className="text-gray-500 ml-2">
                                {order.pickUpTime}
                            </Text>
                        </View>
                    </View>
                </View>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="gray"
                />
            </TouchableOpacity>

            {expanded && (
                <View className="p-4">
                    <View className="mb-4">
                        <Text className="font-bold text-base mb-1">Pickup Address</Text>
                        <View className="flex-row items-start">
                            <Ionicons name="location" size={18} color="#4CAF50" className="mt-1" />
                            <Text className="text-gray-600 ml-2 flex-1">
                                {order.pickupAddress.formattedAddress}
                            </Text>
                        </View>
                        {order.distance !== undefined && (
                            <Text className="text-gray-500 mt-1">
                                Distance: {order.distance.toFixed(2)} km
                            </Text>
                        )}
                    </View>

                    <ScrapImageGallery images={order.scrapImage} />
                    <OrderItemDetails order={order} />

                    <View className="flex-row justify-between mt-2">
                        <TouchableOpacity
                            className="bg-white border border-gray-300 rounded-md py-3 px-6 flex-1 mr-3 items-center"
                            onPress={() => onReject(order._id)}
                        >
                            <Text className="font-bold text-gray-700">Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-green-500 rounded-md py-3 px-6 flex-1 items-center"
                            onPress={() => onAccept(order._id)}
                        >
                            <Text className="font-bold text-white">Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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