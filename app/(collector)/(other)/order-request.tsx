import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Types based on the provided schema
type ScrapItem = {
    _id: string;
    name: string; // Assuming the Scrap model has a name field
    pricePerKg: number; // Assuming the Scrap model has a price field
};

type OrderItem = {
    scrap: ScrapItem;
    weight: number | null;
    amount: number | null;
};

type OrderRequest = {
    _id: string;
    user: {
        _id: string;
        name: string;
        phoneNumber: string;
        profileImage?: string;
    };
    pickupAddress: {
        formattedAddress: string;
        latitude: number;
        longitude: number;
    };
    pickUpDate: Date;
    status: string;
    estimatedAmount: number;
    totalAmount: number | null;
    orderItem: OrderItem[];
    scrapImage: string[];
    createdAt: Date;
};

const ORDER_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    PICKED: 'PICKED'
};

// Sample data for demonstration
const sampleOrderRequests: OrderRequest[] = [
    {
        _id: '1',
        user: {
            _id: 'u1',
            name: 'Rahul Singh',
            phoneNumber: '+919876543210',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        pickupAddress: {
            formattedAddress: '203, Sector 1, Ambala City',
            latitude: 30.3752,
            longitude: 76.7821
        },
        pickUpDate: new Date('2024-03-18T14:00:00'),
        status: ORDER_STATUS.PENDING,
        estimatedAmount: 215,
        totalAmount: null,
        orderItem: [
            {
                scrap: { _id: 's1', name: 'Paper', pricePerKg: 12 },
                weight: 5,
                amount: 60
            },
            {
                scrap: { _id: 's2', name: 'Plastic', pricePerKg: 15 },
                weight: 3,
                amount: 45
            },
            {
                scrap: { _id: 's3', name: 'Carton', pricePerKg: 10 },
                weight: 11,
                amount: 110
            }
        ],
        scrapImage: [
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
            'https://images.unsplash.com/photo-1605600659453-388a652585e0'
        ],
        createdAt: new Date('2024-03-15T09:30:00')
    },
    {
        _id: '2',
        user: {
            _id: 'u2',
            name: 'Priya Sharma',
            phoneNumber: '+919876543211',
            profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        pickupAddress: {
            formattedAddress: '45, Green Park, Model Town, Ambala City',
            latitude: 30.3692,
            longitude: 76.7784
        },
        pickUpDate: new Date('2024-03-19T11:00:00'),
        status: ORDER_STATUS.PENDING,
        estimatedAmount: 378,
        totalAmount: null,
        orderItem: [
            {
                scrap: { _id: 's4', name: 'Metal', pricePerKg: 35 },
                weight: 8,
                amount: 280
            },
            {
                scrap: { _id: 's2', name: 'Plastic', pricePerKg: 15 },
                weight: 4,
                amount: 60
            },
            {
                scrap: { _id: 's3', name: 'Glass', pricePerKg: 8 },
                weight: 4.75,
                amount: 38
            }
        ],
        scrapImage: [
            'https://images.unsplash.com/photo-1533626904905-cc52fd99695e',
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9'
        ],
        createdAt: new Date('2024-03-16T14:45:00')
    },
    {
        _id: '3',
        user: {
            _id: 'u3',
            name: 'Amit Kumar',
            phoneNumber: '+919876543212'
        },
        pickupAddress: {
            formattedAddress: '128, Lake Road, Sector 5, Ambala City',
            latitude: 30.3601,
            longitude: 76.7951
        },
        pickUpDate: new Date('2024-03-20T16:30:00'),
        status: ORDER_STATUS.PENDING,
        estimatedAmount: 455,
        totalAmount: null,
        orderItem: [
            {
                scrap: { _id: 's5', name: 'Electronics', pricePerKg: 65 },
                weight: 7,
                amount: 455
            }
        ],
        scrapImage: [
            'https://images.unsplash.com/photo-1610056494052-6a4f5fb780b9'
        ],
        createdAt: new Date('2024-03-17T10:20:00')
    }
];

// Component for displaying scrap images
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

// Component for displaying order item details
const OrderItemDetails: React.FC<{ items: OrderItem[] }> = ({ items }) => {
    return (
        <View className="mb-4">
            <Text className="font-bold text-base mb-2">Materials</Text>
            {items.map((item, index) => (
                <View
                    key={index}
                    className="flex-row justify-between items-center py-2 border-b border-gray-100"
                >
                    <View className="flex-1">
                        <Text className="text-base">{item.scrap.name}</Text>
                    </View>
                    <View className="flex-row items-center flex-1 justify-end">
                        <Text className="text-gray-600">{item.weight} kg × रु{item.scrap.pricePerKg}</Text>
                    </View>
                    <View className="w-20 items-end">
                        <Text className="font-bold">रु{item.amount}</Text>
                    </View>
                </View>
            ))}
            <View className="flex-row justify-between items-center pt-3">
                <Text className="font-bold text-base">Total Estimated</Text>
                <Text className="font-bold text-lg text-green-600">
                    रु{items.reduce((total, item) => total + (item.amount || 0), 0)}
                </Text>
            </View>
        </View>
    );
};

// Order Request Card Component
const OrderRequestCard: React.FC<{ order: OrderRequest, onAccept: () => void, onReject: () => void }> = ({
    order,
    onAccept,
    onReject
}) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <View className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
            {/* Header */}
            <TouchableOpacity
                className="flex-row justify-between items-center p-4 border-b border-gray-100"
                onPress={toggleExpand}
            >
                <View className="flex-row items-center">
                    {order.user.profileImage ? (
                        <Image
                            source={{ uri: order.user.profileImage }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                    ) : (
                        <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center mr-3">
                            <Text className="text-xl font-bold text-gray-600">
                                {order.user.name.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <View>
                        <Text className="font-bold text-base">{order.user.name}</Text>
                        <Text className="text-gray-500">
                            {(new Date(order.pickUpDate), 'dd MMM, yyyy - h:mm a')}
                        </Text>
                    </View>
                </View>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="gray"
                />
            </TouchableOpacity>

            {/* Expandable Content */}
            {expanded && (
                <View className="p-4">
                    {/* Pickup Address */}
                    <View className="mb-4">
                        <Text className="font-bold text-base mb-1">Pickup Address</Text>
                        <View className="flex-row items-start">
                            <Ionicons name="location" size={18} color="#4CAF50" className="mt-1" />
                            <Text className="text-gray-600 ml-2 flex-1">{order.pickupAddress.formattedAddress}</Text>
                        </View>
                    </View>

                    {/* Scrap Images */}
                    <ScrapImageGallery images={order.scrapImage} />

                    {/* Order Items */}
                    <OrderItemDetails items={order.orderItem} />

                    {/* Action Buttons */}
                    <View className="flex-row justify-between mt-2">
                        <TouchableOpacity
                            className="bg-white border border-gray-300 rounded-md py-3 px-6 flex-1 mr-3 items-center"
                            onPress={onReject}
                        >
                            <Text className="font-bold text-gray-700">Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-green-500 rounded-md py-3 px-6 flex-1 items-center"
                            onPress={onAccept}
                        >
                            <Text className="font-bold text-white">Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

// Filter Bar Component
const FilterBar: React.FC<{ activeFilter: string, onFilterChange: (filter: string) => void }> = ({
    activeFilter,
    onFilterChange
}) => {
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
                        <Text
                            className={`font-medium ${activeFilter === filter ? 'text-white' : 'text-gray-600'
                                }`}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// Main Component
const OrderRequestScreen: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [orders, setOrders] = useState<OrderRequest[]>(sampleOrderRequests);

    const handleAccept = (orderId: string) => {
        console.log(`Order ${orderId} accepted`);
        // make an API call to update the order status
        // and then update the local state
        // TODO: Implement the API call
        setOrders(orders.filter(order => order._id !== orderId));
    };

    const handleReject = (orderId: string) => {
        console.log(`Order ${orderId} rejected`);
        // Similar to accept, but with different status
        setOrders(orders.filter(order => order._id !== orderId));
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 ">

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
                ListEmptyComponent={
                    <View className="items-center justify-center py-8">
                        <Ionicons name="document-text-outline" size={64} color="gray" />
                        <Text className="text-gray-500 text-lg mt-4">No order requests available</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

export default OrderRequestScreen;

