import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import StatsCard from '@/components/StatsCard';
import OrderRequestCard from '@/components/collector/OrderRequestCard';
import ScheduledOrderCard from '@/components/collector/ScheduledOrderCard';
import orderService from '@/services/order/orderService';
import { OrderRequest as OrderRequestItem } from '@/types/type';
import PriceUpdateCard from '@/components/collector/PriceUpdateCard';
import dashboardService from '@/services/dashboard/dashboardService';
import scrapService from '@/services/scrap/scrapService';


type CollectorDashboardStats = {
    collector: {
        _id: string;
        avatar: string;
        email: string;
        fullName: string;
    };
    totalCompletedOrders: number;
    totalEarnings: number;
    totalWeight: number;
}


type RandomScrapPrice = {
    scrap: string;
    price: number;
}

const CollectorHomeScreen: React.FC = () => {
    const [orderRequests, setOrderRequests] = useState<OrderRequestItem[]>([]);
    const [todaysOrders, setTodaysOrders] = useState<OrderRequestItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [collectorStats, setCollectorStats] = useState<CollectorDashboardStats | null>(null);
    const [randomScrapPrice, setRandomScrapPrice] = useState<RandomScrapPrice[] | null>(null);


    const fetchRandomScrap = async () => {
        try {
            const response = await scrapService.getRandomScrapPrice();
            if (response?.success) {
                setRandomScrapPrice(response.data);
            }
        } catch (error: any) {
            console.log('API :: getRandomScrap :: error', error.response?.data);
        }
    };
    const fetchNewOrderRequests = async () => {
        try {
            const response = await orderService.getNewOrderRequest();

            if (response.success) {
                // console.log(response.data);
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
                // console.log(response.data);
                setTodaysOrders(response.data);
            }

        } catch (error: any) {
            console.log('API :: getMyOrders :: error', error.response?.data)
            return error.response?.data;
        }
    };

    const handleAccept = async (orderId: string) => {
        try {
            const response = await orderService.acceptOrder(orderId);
            if (response.success) {
                setOrderRequests(orderRequests.filter(order => order._id !== orderId));
                Alert.alert('Success', 'Order accepted successfully');
                router.push(`/order-navigation/${orderId}`);
            } else {
                Alert.alert('Error', response.message || 'Failed to accept order');
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            Alert.alert('Error', 'Failed to accept order');
        }
    };

    const fetchCollectorStats = async () => {
        try {
            const response = await dashboardService.getCollectorStats();
            if (response.success) {
                setCollectorStats(response.data);
            }
        } catch (error: any) {
            console.log('API :: getCollectorStats :: error', error.response?.data)
            return error.response?.data;
        }
    };

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                await Promise.all([
                    fetchCollectorStats(),
                    fetchNewOrderRequests(),
                    fetchOrderScheduledForToday(),
                    fetchRandomScrap()
                ]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                fetchCollectorStats(),
                fetchNewOrderRequests(),
                fetchOrderScheduledForToday(),
                fetchRandomScrap()
            ]);
        } finally {
            setRefreshing(false);
        }
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
            onAccept={() => handleAccept(item._id)}
            onIgnore={() => setOrderRequests(orderRequests.filter(order => order._id !== item._id))}
        />
    );

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

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
                        <Text className="text-2xl font-bold text-gray-800">{collectorStats?.collector.fullName || 'Collector'},</Text>
                        <Text className="text-gray-500">Your Total Business रु{collectorStats?.totalEarnings?.toLocaleString('en-NP', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} till now</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/notification")}>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View className="flex-row gap-3 my-4">
                    <StatsCard title="Quantity recycled" value={`${collectorStats?.totalWeight}  Kg`} />
                    <StatsCard title="Orders Completed" value={`${collectorStats?.totalCompletedOrders}`} />
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
                        {randomScrapPrice?.map((item, index) => (
                            <PriceUpdateCard
                                key={index}
                                material={item.scrap}
                                price={item.price.toString()}
                            />
                        ))}
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
                    {todaysOrders.length > 0 ? (todaysOrders.map((order) => (
                        <ScheduledOrderCard
                            key={order._id}
                            date={order.pickUpDate}
                            material={order.orderItem.map(item => `${item.weight} Kg ${item.scrap.name}`).join(', ')}
                            location={order.pickupAddress.formattedAddress}
                            // onPress={() => router.push("/order-navigation")}
                            onPress={() => router.push(`/(collector)/(other)/order-navigation/${order._id}`)}
                        />
                    ))
                    ) : (
                        <Text className="text-gray-500 text-center">No orders scheduled for today</Text>
                    )}
                </View>

                <View className="h-16" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CollectorHomeScreen;