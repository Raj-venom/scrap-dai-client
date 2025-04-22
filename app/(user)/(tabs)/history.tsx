import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import orderService from '@/services/order/orderService';
import OrderHistoryCard from '@/components/order/OrderHistoryCard';


interface OrderItem {
  scrap: {
    _id: string;
    name: string;
  };
  weight: number;
  amount: number;
  _id: string;
}

interface HistoryItem {
  _id: string;
  pickUpDate: string;
  status: string;
  orderItem: OrderItem[];
  scrapImage: string[];
  estimatedAmount: number;
  totalAmount?: number;
  timeline?: {
    date: string;
    time: string;
    message: string;
  }[];
  collector?: {
    _id: string;
    fullName: string;
    phone: string;
  };
  pickupAddress: {
    formattedAddress: string;
  };
  feedback?: {
    userRating?: number;
    userReview?: string;
    collectorRating?: number;
    collectorReview?: string;
  };
}

export default function HistoryScreen(): JSX.Element {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // console.log("feeback", historyItems[0]?.feedback);

  const fetchMyOrders = async () => {
    try {
      const response = await orderService.getMyOrders();

      if (response.success) {
        // console.log(response.data[1].collector);
        setHistoryItems(response.data);
      }
    } catch (error: any) {
      // console.log('API :: getMyOrders :: error', error.response?.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMyOrders().finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMyOrders().finally(() => setRefreshing(false));
  }, []);

  // Render a single history item
  const renderItem = ({ item }: { item: HistoryItem }) => (
    <OrderHistoryCard
      id={item._id}
      pickUpDate={item.pickUpDate}
      status={item.status}
      orderItems={item.orderItem}
      scrapImages={item.scrapImage}
      estimatedAmount={item.estimatedAmount}
      totalAmount={item.totalAmount}
      timeline={item.timeline}
      // Don't show user info in user view
      showUserInfo={false}
      collector={item.collector}
      pickupAddress={item?.pickupAddress}
      feedback={item?.feedback} 
    />
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (historyItems.length === 0) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">No history items found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={historyItems}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerClassName="px-4 py-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']} // Android
            tintColor="#0000ff" // iOS
          />
        }
      />

      <View className="h-16" />
    </View>
  );
}