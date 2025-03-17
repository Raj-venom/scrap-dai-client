import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import StatsCard from '@/components/StatsCard';
import OrderRequestCard from '@/components/collector/OrderRequestCard';
import ScheduledOrderCard from '@/components/collector/ScheduledOrderCard';

// Type definitions
type PriceUpdateCardProps = {
    material: string;
    price: string;
    trend: 'up' | 'down';
};



type OrderRequestItem = {
    id: string;
    date: string;
    material: string;
    location: string;
};

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
    // TODO: Fetch data from API
    // Sample data for order requests
    const orderRequests: OrderRequestItem[] = [
        {
            id: '1',
            date: '18 March, 2024',
            material: 'Material: 3-5 Kg Poly, 3-6 Kg Carton',
            location: '203, Sector 1, Ambala City'
        },
        {
            id: '2',
            date: '19 March, 2024',
            material: 'Material: 5-7 Kg Paper, 2-3 Kg Metal',
            location: '45, Green Park, Ambala City'
        },
        {
            id: '3',
            date: '20 March, 2024',
            material: 'Material: 8-10 Kg Glass, 4-6 Kg Plastic',
            location: '128, Lake Road, Ambala City'
        }
    ];

    const todaysOrders: OrderRequestItem[] = [
        {
            id: '1',
            date: '15 March, 2024',
            material: 'Material: 3-5 Kg Poly, 5-8 Kg Carton',
            location: '30 Model Town, Ambala City'
        },
        {
            id: '2',
            date: '15 March, 2024',
            material: 'Material: 3-5 Kg Tyre, 10-12 Kg Steel',
            location: '17 Kantar Nagar, Model Town, Ambala City'
        },
        {
            id: '3',
            date: '15 March, 2024',
            material: 'Material: 3-5 Kg Tyre, 10-12 Kg Steel',
            location: '17 Kantar Nagar, Model Town, Ambala City'
        },
        {
            id: '4',
            date: '15 March, 2024',
            material: 'Material: 3-5 Kg Tyre, 10-12 Kg Steel',
            location: '17 Kantar Nagar, Model Town, Ambala City'
        },
        {
            id: '5',
            date: '15 March, 2024',
            material: 'Material: 3-5 Kg Tyre, 10-12 Kg Steel',
            location: '17 Kantar Nagar, Model Town, Ambala City'
        }
    ];

    const renderOrderRequestItem = ({ item }: { item: OrderRequestItem }) => (
        <OrderRequestCard
            date={item.date}
            material={item.material}
            location={item.location}
            onAccept={() => console.log(`Order ${item.id} accepted`)}
            onIgnore={() => console.log(`Order ${item.id} ignored`)}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-4 ">
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

                    <FlatList
                        data={orderRequests}
                        renderItem={renderOrderRequestItem}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                    />
                </View>

                {/* Orders Scheduled */}
                <View className="mb-4">
                    <Text className="font-bold text-gray-800 text-lg mb-2">Orders Scheduled for Today</Text>
                    {todaysOrders.map((order) => (
                        <ScheduledOrderCard
                            key={order.id}
                            date={order.date}
                            material={order.material}
                            location={order.location}
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