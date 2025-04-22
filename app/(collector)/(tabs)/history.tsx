import OrderHistoryCard from '@/components/order/OrderHistoryCard';
import orderService from '@/services/order/orderService';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';


interface OrderItem {
  scrap: {
    _id: string;
    name: string;
  };
  weight: number;
  amount: number;
  _id: string;
}

interface CollectorOrderItem {
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
  // Collector-specific fields
  user?: {
    _id: string;
    fullName: string;
  };
  contactNumber?: string;
  pickupAddress?: {
    formattedAddress: string;
  };
  feedback?: {
    userRating?: number;
    userReview?: string;
    collectorRating?: number;
    collectorReview?: string;
  };
}

export default function CollectorOrdersScreen(): JSX.Element {
  const [collectorOrders, setCollectorOrders] = useState<CollectorOrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchCollectorOrders = async () => {
    try {
      const response = await orderService.getCollectorsOrdersHistory();

      if (response.success) {
        // console.log('API :: getAssignedOrders :: response', response.data);
        setCollectorOrders(response.data);
      }
    } catch (error: any) {
      console.log('API :: getAssignedOrders :: error', error.response?.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCollectorOrders().finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCollectorOrders();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: CollectorOrderItem }) => (
    <OrderHistoryCard
      id={item._id}
      pickUpDate={item.pickUpDate}
      status={item.status}
      orderItems={item.orderItem}
      scrapImages={item.scrapImage}
      estimatedAmount={item.estimatedAmount}
      totalAmount={item.totalAmount}
      timeline={item.timeline}
      // User-related props
      user={item.user}
      contactNumber={item.contactNumber}
      pickupAddress={item.pickupAddress}
      // Show user info for collector view
      showUserInfo={true}
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

  if (collectorOrders.length === 0) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">No assigned orders found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={collectorOrders}
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