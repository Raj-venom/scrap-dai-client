import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusColor } from '@/constants';
import orderService from '@/services/order/orderService';

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
  isExpanded?: boolean;
  totalAmount?: number;
  timeline?: {
    date: string;
    time: string;
    message: string;
  }[];
}

export default function HistoryScreen(): JSX.Element {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();

        if (response.success) {
          const orders = response.data;
          const historyItems: HistoryItem[] = orders.map((order: any) => ({
            ...order,
            isExpanded: false,
          }));

          setHistoryItems(historyItems);
        }
      } catch (error: any) {
        console.log('API :: getMyOrders :: error', error.response?.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Function to toggle expansion of an item
  const toggleExpand = (_id: string) => {
    setHistoryItems(prevItems =>
      prevItems.map(item =>
        item._id === _id
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Format materials string
  const formatMaterials = (orderItems: OrderItem[]) => {
    return `Material: ${orderItems.map(item => `${item.weight} kg ${item.scrap.name}`).join(', ')}`;
  };

  // Get amount to display (totalAmount if available, otherwise estimatedAmount)
  const getDisplayAmount = (item: HistoryItem) => {
    if (item.totalAmount !== undefined && item.totalAmount !== null) {
      return {
        amount: item.totalAmount.toFixed(2),
        label: "Total Amount"
      };
    } else {
      return {
        amount: item.estimatedAmount.toFixed(2),
        label: "Estimated Amount"
      };
    }
  };

  // Render images
  const renderImages = (images: string[]) => {
    if (!images || images.length === 0) return null;

    return (
      <View className="mt-2">
        <Text className="font-medium mb-2">Scrap Images:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          {images.map((imageUrl, index) => (
            <View key={index} className="mr-2 rounded-lg overflow-hidden border border-gray-200">
              <Image
                source={{ uri: imageUrl }}
                className="w-24 h-24"
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render a single history item
  const renderItem = ({ item }: { item: HistoryItem }) => {
    const { amount, label } = getDisplayAmount(item);

    return (
      <View className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <TouchableOpacity
          className="px-4 py-3 bg-gray-50"
          onPress={() => toggleExpand(item._id)}
        >
          <View className="flex-row justify-between items-center">
            <Text className="font-bold">{formatDate(item.pickUpDate)}</Text>
            <Ionicons
              name={item.isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="gray"
            />
          </View>
          <Text className="text-gray-600 mt-1">{formatMaterials(item.orderItem)}</Text>
          <Text className={`font-medium mt-1 ${getStatusColor(item.status.toUpperCase())}`}>
            Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
          </Text>
          <Text className="text-gray-600 mt-1">{label}: 
            <Text className="font-bold"> रु</Text>
            {amount}</Text>
        </TouchableOpacity>

        {item.isExpanded && (
          <View className="px-4 py-3 border-t border-gray-200">
            {/* Images section */}
            {renderImages(item.scrapImage)}

            {/* Timeline section if available */}
            {item.timeline && item.timeline.length > 0 && (
              <View className="mt-3">
                <Text className="font-medium mb-2">Order Timeline:</Text>
                {item.timeline.map((timelineItem, index) => (
                  <View key={index} className="mb-3 pl-6 relative">
                    <View className="absolute left-0 top-0 h-full justify-center items-center">
                      <View className="w-3 h-3 rounded-full bg-green-500" />
                      {index < item.timeline!.length - 1 && (
                        <View className="w-0.5 h-full bg-green-200 absolute top-3" />
                      )}
                    </View>
                    <Text className="font-medium">
                      {timelineItem.date}: ({timelineItem.time})
                    </Text>
                    <Text className="text-gray-600 mt-1">{timelineItem.message}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

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
      />
    </View>
  );
}