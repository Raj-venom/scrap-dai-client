import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Modal, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import orderService from '@/services/order/orderService';
import { Ionicons } from '@expo/vector-icons';
import { ORDER_STATUS } from '@/constants';

interface OrderItem {
  scrap: {
    _id: string;
    name: string;
  };
  weight: number;
  amount: number;
  _id: string;
}

interface Order {
  _id: string;
  pickUpDate: string;
  pickUpTime: string;
  status: string;
  orderItem: OrderItem[];
  estimatedAmount: number;
  totalAmount?: number;
  pickupAddress: {
    formattedAddress: string;
  };
  paymentStatus?: string;
  createdAt: string;
}


// Status colors configuration
const statusColors = {
  [ORDER_STATUS.PENDING]: {
    bg: '#fef3c7',
    text: '#92400e',
    actionBg: '#f59e0b',
    actionText: '#ffffff'
  },
  [ORDER_STATUS.ACCEPTED]: {
    bg: '#dbeafe',
    text: '#1e40af',
    actionBg: '#3b82f6',
    actionText: '#ffffff'
  },
  [ORDER_STATUS.RECYCLED]: {
    bg: '#dcfce7',
    text: '#166534',
    actionBg: '#10b981',
    actionText: '#ffffff'
  },

  [ORDER_STATUS.CANCELLED]: {
    bg: '#fee2e2',
    text: '#b91c1c',
    actionBg: '#ef4444',
    actionText: '#ffffff'
  }
};

// Time slots for scheduling
const TIME_SLOTS = [
  "7 AM - 9 AM",
  "9 AM - 11 AM",
  "11 AM - 1 PM",
  "1 PM - 3 PM",
  "3 PM - 5 PM"
];

export default function UserOrderScreen(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [newPickupDate, setNewPickupDate] = useState('');
  const [newPickupTime, setNewPickupTime] = useState('');

  // Fetch orders from API
  const fetchMyOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      if (response.success) {
        setOrders(response.data);
        setFilteredOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Apply filters when statusFilter or orders change
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMyOrders();
  }, []);

  // Update order with new date/time
  const handleUpdateOrder = async () => {
    if (!selectedOrder || !newPickupDate || !newPickupTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }

    try {
      const response = await orderService.updateOrderScheduledDate(
        selectedOrder._id,
        newPickupDate,
        newPickupTime
      );

      if (response.success) {
        Alert.alert('Success', 'Order rescheduled successfully');
        fetchMyOrders();
        setSelectedOrder(null);
        setNewPickupDate('');
        setNewPickupTime('');
      } else {
        Alert.alert('Error', response.message || 'Failed to update order');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update order');
    }
  };

  // Cancel order confirmation
  const handleCancelOrder = async (orderId: string) => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await orderService.cancelOrder(orderId);
              if (response.success) {
                Alert.alert('Success', 'Order cancelled successfully');
                await fetchMyOrders();
              } else {
                Alert.alert('Error', response.message || 'Failed to cancel order');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  // Calendar date selection
  const handleDateSelect = (date: any) => {
    setNewPickupDate(date.dateString);
    setShowCalendar(false);
  };

  // Time slot selection
  const handleTimeSelect = (time: string) => {
    setNewPickupTime(time);
    setShowTimeDropdown(false);
  };

  // Get marked dates for calendar
  const getMarkedDates = () => {
    if (!newPickupDate) return {};
    return {
      [newPickupDate]: { selected: true, selectedColor: '#22c55e' }
    };
  };

  // Render individual order item
  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusColor = statusColors[item.status] || statusColors[ORDER_STATUS.PENDING];

    return (
      <View className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="text-lg font-semibold">Order #{item._id.slice(0, 6)}</Text>
            <Text className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={{ color: statusColor.text }}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="mb-3">
          <Text className="text-gray-600 mb-1">
            <Text className="font-medium">Pickup Date:</Text> {new Date(item.pickUpDate).toLocaleDateString()}
          </Text>
          {item.pickUpTime && (
            <Text className="text-gray-600 mb-1">
              <Text className="font-medium">Time Slot:</Text> {item.pickUpTime}
            </Text>
          )}
          <Text className="text-gray-600">
            <Text className="font-medium">Address:</Text> {item.pickupAddress?.formattedAddress || 'N/A'}
          </Text>
        </View>

        <View className="border-t border-gray-100 pt-2 mt-2">
          <Text className="font-medium mb-1">Scrap Items:</Text>
          {item.orderItem.map((orderItem) => (
            <View key={orderItem._id} className="flex-row justify-between mb-1">
              <Text className="text-gray-600">{orderItem.scrap.name}</Text>
              <View className="flex-row">
                <Text className="text-gray-600 mr-4">{orderItem.weight} kg</Text>
                <Text className="text-gray-600">₹{orderItem.amount}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="border-t border-gray-100 pt-2 mt-2 flex-row justify-between">
          <Text className="font-medium">Total Amount:</Text>
          <Text className="font-semibold">₹{item.totalAmount || item.estimatedAmount}</Text>
        </View>

        {item?.paymentStatus && (
          <View className="border-t border-gray-100 pt-2 mt-2 flex-row justify-between">
            <Text className="font-medium">Payment Status:</Text>
            <Text className={`font-medium ${item.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`}>
              {item.paymentStatus.toUpperCase()}
            </Text>
          </View>
        )}

        {(item.status === ORDER_STATUS.PENDING || item.status === ORDER_STATUS.ACCEPTED) && (
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: statusColors[ORDER_STATUS.CANCELLED].actionBg }}
              onPress={() => handleCancelOrder(item._id)}
            >
              <Text style={{ color: statusColors[ORDER_STATUS.CANCELLED].actionText }} className="font-medium">
                Cancel Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: statusColor.actionBg }}
              onPress={() => {
                setSelectedOrder(item);
                setNewPickupDate(item.pickUpDate);
                setNewPickupTime(item.pickUpTime || '');
              }}
            >
              <Text style={{ color: statusColor.actionText }} className="font-medium">
                Reschedule
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render filter buttons
  const renderFilterButtons = () => (
    <View className="flex-row justify-between mx-4 mb-4">
      {['all', ...Object.values(ORDER_STATUS)].map((status) => (
        <TouchableOpacity
          key={status}
          className={`px-2 py-1 rounded-lg ${statusFilter === status ? 'bg-gray-800' : 'bg-gray-200'}`}
          onPress={() => setStatusFilter(status)}
        >
          <Text className={`text-xs ${statusFilter === status ? 'text-white' : 'text-gray-800'}`}>
            {status === 'all' ? 'All' : status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Empty state
  if (orders.length === 0 && !loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600 mb-4">No orders found</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={fetchMyOrders}
        >
          <Text className="text-white">Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderFilterButtons()}

      {filteredOrders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">
            No {statusFilter === 'all' ? '' : statusFilter.toLowerCase()} orders found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          contentContainerClassName="p-4"
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

      {/* Reschedule Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedOrder}
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="w-full bg-white rounded-xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Reschedule Order</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4">
              Current: {new Date(selectedOrder?.pickUpDate || '').toLocaleDateString()} • {selectedOrder?.pickUpTime || 'No time selected'}
            </Text>

            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-3 mb-4"
              onPress={() => setShowCalendar(true)}
            >
              <Text className={newPickupDate ? "text-gray-800" : "text-gray-400"}>
                {newPickupDate ? new Date(newPickupDate).toLocaleDateString() : "Select New Date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-3 mb-6"
              onPress={() => setShowTimeDropdown(true)}
            >
              <Text className={newPickupTime ? "text-gray-800" : "text-gray-400"}>
                {newPickupTime || "Select New Time Slot"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-200 px-6 py-3 rounded-lg"
                onPress={() => setSelectedOrder(null)}
              >
                <Text className="font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-600 px-6 py-3 rounded-lg"
                onPress={handleUpdateOrder}
                disabled={!newPickupDate || !newPickupTime}
              >
                <Text className="text-white font-medium">Confirm Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 max-w-md bg-white rounded-xl p-4 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Calendar
              minDate={new Date().toISOString().split('T')[0]}
              markedDates={getMarkedDates()}
              onDayPress={handleDateSelect}
              theme={{
                todayTextColor: '#22c55e',
                selectedDayBackgroundColor: '#22c55e',
                arrowColor: '#22c55e',
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Time Dropdown Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTimeDropdown}
        onRequestClose={() => setShowTimeDropdown(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 max-w-md bg-white rounded-xl overflow-hidden shadow-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-bold">Select Time Slot</Text>
              <TouchableOpacity onPress={() => setShowTimeDropdown(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={TIME_SLOTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-gray-100 ${newPickupTime === item ? 'bg-green-50' : ''}`}
                  onPress={() => handleTimeSelect(item)}
                >
                  <Text className={`${newPickupTime === item ? 'text-green-600 font-medium' : 'text-gray-800'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  }
});