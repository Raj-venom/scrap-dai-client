import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import StatsCard from '@/components/StatsCard';
import OrderRequestCard from '@/components/collector/OrderRequestCard';
import ScheduledOrderCard from '@/components/collector/ScheduledOrderCard';
import orderService from '@/services/order/orderService';

// Type definitions
type PriceUpdateCardProps = {
    material: string;
    price: string;
    trend: 'up' | 'down';
};

type OrderRequestItem = {
    pickupAddress: {
        formattedAddress: string;
        latitude: number;
        longitude: number;
    };
    _id: string;
    user: string;
    collector: null;
    pickUpDate: string;
    status: string;
    estimatedAmount: number;
    orderItem: {
        scrap: {
            _id: string;
            name: string;
        };
        weight: number;
        amount: number;
        _id: string;
    }[];
    scrapImage: string[];
    pickUpTime: string;
    contactNumber: string;
}

// const todaysOrders: OrderRequestItem[] = [];


// Component for Price Update Card
const PriceUpdateCard: React.FC<PriceUpdateCardProps> = ({ material, price, trend }) => {
    return (
        <View className="bg-white py-3 px-4 rounded-lg border border-gray-200 flex-1 items-center">
            <Text className="text-gray-600 mb-1 text-base">{material}</Text>
            <View className="flex-row items-center">
                <Text className="font-bold mr-1 text-lg">रु{price}/kg</Text>
                <Ionicons
                    name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={trend === 'up' ? '#32CD32' : '#FF6347'}
                />
            </View>
        </View>
    );
};

const CollectorHomeScreen: React.FC = () => {
    const [orderRequests, setOrderRequests] = useState<OrderRequestItem[]>([]);
    const [todaysOrders, setTodaysOrders] = useState<OrderRequestItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNewOrderRequests = async () => {
        try {
            const response = await orderService.getNewOrderRequest();

            if (response.success) {
                console.log(response.data);
                setOrderRequests(response.data);
            }
        } catch (error: any) {
            console.log('API :: getNewOrderRequest :: error', error.response?.data);
        }
    };

    const fetchOrderScheduledForToday = async () => {

        try {
            const response = await orderService.getOrderScheduledForToday();

            if (response.success) {
                console.log(response.data);
                setTodaysOrders(response.data);
            }

        } catch (error: any) {
            console.log('API :: getMyOrders :: error', error.response?.data)
            return error.response?.data;
        }
    };

    useEffect(() => {
        setLoading(true);
        ; (async () => {
            await fetchNewOrderRequests();
            await fetchOrderScheduledForToday();
            setLoading(false);
        })().finally(() => setLoading(false));
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchNewOrderRequests();
        setRefreshing(false);
    }, []);

    // Format order item materials
    const formatMaterials = (orderItems: Array<{ scrap: { name: string }, weight: number }>) => {
        return `Material: ${orderItems.map(item => `${item.weight} Kg ${item.scrap.name}`).join(', ')}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const renderOrderRequestItem = ({ item }: { item: OrderRequestItem }) => (
        <OrderRequestCard
            date={formatDate(item.pickUpDate)}
            material={formatMaterials(item.orderItem)}
            location={item.pickupAddress.formattedAddress}
            onAccept={() => console.log(`Order ${item._id} accepted`)}
            onIgnore={() => console.log(`Order ${item._id} ignored`)}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-4 "
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0000ff']}
                        tintColor="#0000ff"
                    />
                }
            >
                <View className="pt-4 pb-2 flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-gray-800">Hi John,</Text>
                        <Text className="text-gray-500">You've earned रु10,700 till now</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View className="flex-row gap-3 my-4">
                    <StatsCard title="Quantity recycled" value="18 Kg" />
                    <StatsCard title="Orders Completed" value="2" />
                </View>

                {/* Price Updates */}
                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-bold text-gray-800 text-lg">Price Updates</Text>
                        <TouchableOpacity onPress={() => router.push('/rate-card')}>
                            <Text className="text-green-500 text-base">View More</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row gap-2">
                        <PriceUpdateCard material="Steel" price="45" trend="down" />
                        <PriceUpdateCard material="Bottles" price="25" trend="up" />
                        <PriceUpdateCard material="Newspaper" price="21" trend="up" />
                    </View>
                </View>

                {/* Order Requests - Horizontal FlatList */}
                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-bold text-gray-800 text-lg">Orders Requests</Text>
                        <TouchableOpacity onPress={() => router.push('/order-request')}>
                            <Text className="text-green-500 text-base">View More</Text>
                        </TouchableOpacity>
                    </View>

                    {orderRequests.length > 0 ? (
                        <FlatList
                            data={orderRequests}
                            renderItem={renderOrderRequestItem}
                            keyExtractor={item => item._id}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 16 }}
                        />
                    ) : (
                        <Text className="text-gray-500 text-center">No new order requests</Text>
                    )}
                </View>

                {/* Orders Scheduled*/}
                <View className="mb-4">
                    <Text className="font-bold text-gray-800 text-lg mb-2">Orders Scheduled for Today</Text>
                    {todaysOrders.map((order) => (
                        <ScheduledOrderCard
                            key={order._id}
                            date={order.pickUpDate}
                            material={order.orderItem.map(item => `${item.weight} Kg ${item.scrap.name}`).join(', ')}
                            location={order.pickupAddress.formattedAddress}
                            onPress={() => router.push("/order-navigation")}
                        />
                    ))}
                </View>

                <View className="h-16" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CollectorHomeScreen;