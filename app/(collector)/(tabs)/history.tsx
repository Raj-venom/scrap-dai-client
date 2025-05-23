import OrderHistoryCard from '@/components/order/OrderHistoryCard';
import orderService from '@/services/order/orderService';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';

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

const FILTER_OPTIONS = {
  ALL: 'all',
  ACCEPTED: 'accepted',
  RECYCLED: 'recycled',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

export default function CollectorOrdersScreen(): JSX.Element {
  const [collectorOrders, setCollectorOrders] = useState<CollectorOrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<CollectorOrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>(FILTER_OPTIONS.ALL);

  const fetchCollectorOrders = async () => {
    try {
      const response = await orderService.getCollectorsOrdersHistory();

      if (response.success) {
        setCollectorOrders(response.data);
        applyFilter(activeFilter, response.data);
      }
    } catch (error: any) {
      console.log('API :: getAssignedOrders :: error', error.response?.data);
    }
  };

  const applyFilter = (filter: string, items: CollectorOrderItem[]) => {
    switch (filter) {
      case FILTER_OPTIONS.ALL:
        setFilteredOrders(items);
        break;
      case FILTER_OPTIONS.PENDING:
        setFilteredOrders(items.filter(item => item.status.toLowerCase() === 'pending'));
        break;
      case FILTER_OPTIONS.ACCEPTED:
        setFilteredOrders(items.filter(item => item.status.toLowerCase() === 'accepted'));
        break;
      case FILTER_OPTIONS.RECYCLED:
        setFilteredOrders(items.filter(item => item.status.toLowerCase() === 'recycled'));
        break;
      case FILTER_OPTIONS.CANCELLED:
        setFilteredOrders(items.filter(item => item.status.toLowerCase() === 'cancelled'));
        break;
      default:
        setFilteredOrders(items);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCollectorOrders().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    applyFilter(activeFilter, collectorOrders);
  }, [activeFilter, collectorOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCollectorOrders().finally(() => setRefreshing(false));
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
      user={item.user}
      contactNumber={item.contactNumber}
      pickupAddress={item.pickupAddress}
      showUserInfo={true}
      feedback={item?.feedback}
    />
  );

  const renderFilterButton = (filter: string, label: string) => (
    <TouchableOpacity
      className={`px-3 py-1.5 rounded-full border ${activeFilter === filter
        ? 'bg-green-500 border-green-500'
        : 'bg-white border-gray-300'
        }`}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        className={`text-sm font-medium ${activeFilter === filter ? 'text-white' : 'text-gray-600'
          }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center" >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Filter Options */}
      <View className="flex-row justify-around py-3 px-4 bg-gray-50 border-b border-gray-200">
        {renderFilterButton(FILTER_OPTIONS.ALL, 'All')}
        {renderFilterButton(FILTER_OPTIONS.PENDING, 'Pending')}
        {renderFilterButton(FILTER_OPTIONS.ACCEPTED, 'Accepted')}
        {renderFilterButton(FILTER_OPTIONS.RECYCLED, 'Recycled')}
        {renderFilterButton(FILTER_OPTIONS.CANCELLED, 'Cancelled')}
      </View>

      {filteredOrders.length === 0 ? (
        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-gray-600">
            No {activeFilter === FILTER_OPTIONS.ALL ? '' : activeFilter} orders found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerClassName="px-4 py-4"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0000ff']}
              tintColor="#0000ff"
            />
          }
        />
      )}

      <View className="h-16" />
    </View>
  );
}