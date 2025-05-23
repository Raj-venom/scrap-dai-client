import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusColor, ORDER_STATUS } from '@/constants';
import FeedbackComponent from './FeedbackComponent';

interface OrderItem {
    scrap: {
        _id: string;
        name: string;
    };
    weight: number;
    amount: number;
    _id: string;
}

interface TimelineItem {
    date: string;
    time: string;
    message: string;
}

interface User {
    _id: string;
    fullName: string;
}

interface PickupAddress {
    formattedAddress: string;
}

interface OrderCardProps {
    id: string;
    pickUpDate: string;
    status: string;
    orderItems: OrderItem[];
    scrapImages?: string[];
    estimatedAmount: number;
    totalAmount?: number;
    timeline?: TimelineItem[];
    initialExpanded?: boolean;
    user?: User;
    contactNumber?: string;
    pickupAddress?: PickupAddress;
    showUserInfo?: boolean;
    collector?: {
        _id: string;
        fullName: string;
        phone: string;
    };
    feedback?: {
        userRating?: number;
        userReview?: string;
        collectorRating?: number;
        collectorReview?: string;
    };
}

const OrderHistoryCard = ({
    id,
    pickUpDate,
    status,
    orderItems,
    scrapImages = [],
    estimatedAmount,
    totalAmount,
    timeline = [],
    initialExpanded = false,
    user,
    contactNumber,
    pickupAddress,
    showUserInfo = false,
    collector,
    feedback,
}: OrderCardProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);

    // Format date function
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Format materials string
    const formatMaterials = (items: OrderItem[]) => {
        return `Material: ${items.map(item => `${item?.weight} kg ${item.scrap?.name}`).join(', ')}`;
    };

    // Get amount to display (totalAmount if available, otherwise estimatedAmount)
    const getDisplayAmount = () => {
        if (totalAmount !== undefined && totalAmount !== null) {
            return {
                amount: totalAmount.toFixed(2),
                label: "Total Amount"
            };
        } else {
            return {
                amount: estimatedAmount.toFixed(2),
                label: "Estimated Amount"
            };
        }
    };

    type UserRole = "user" | "collector";

    const formatTimelineMessage = (message: string, role: UserRole = "user"): string => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("has been created")) {
            return role === "collector" ? "Order created" : "Your order has been created";
        }

        if (lowerMessage.includes("has been accepted")) {
            return role === "collector" ? "You accepted the order" : "Your order has been accepted by the collector";
        }

        if (lowerMessage.includes("has been cancelled")) {
            return role === "collector" ? "Order was cancelled" : message;
        }

        if (lowerMessage.includes("has been recycled")) {
            return role === "collector" ? "Order was recycled" : message;
        }

        return message;
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

    // Format address to be shorter if too long
    const formatAddress = (address: string) => {
        return address.length > 80
            ? `${address.slice(0, 80)}...`
            : address;
    };

    const { amount, label } = getDisplayAmount();

    return (
        <View className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
            {/* Order info section (common for both views) */}
            <TouchableOpacity
                className={`px-4 py-3 ${showUserInfo && user ? ' bg-gray-50' : 'bg-gray-50'}`}
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <View className="flex-row justify-between items-center">
                    <Text className="font-bold">{formatDate(pickUpDate)}</Text>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="gray"
                    />
                </View>
                <Text className="text-gray-600 mt-1">{formatMaterials(orderItems)}</Text>
                <Text className={`font-medium mt-1 ${getStatusColor(status.toUpperCase())}`}>
                    Status: {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                </Text>
                <Text className="text-gray-600 mt-1">{label}:
                    <Text className="font-bold"> रु</Text>
                    {amount}
                </Text>
            </TouchableOpacity>

            {isExpanded && (
                <View className="px-4 py-3 border-t border-gray-200">
                    {renderImages(scrapImages)}

                    {timeline && timeline.length > 0 && (
                        <View className="px-4 py-3 border-t border-gray-200">
                            <View className="mt-3">
                                <Text className="font-medium mb-2">Order Timeline:</Text>
                                {timeline.map((timelineItem, index) => (
                                    <View key={index} className="mb-3 pl-6 relative">
                                        <View className="absolute left-0 top-0 h-full justify-center items-center">
                                            <View className="w-3 h-3 rounded-full bg-green-500" />
                                            {index < timeline.length - 1 && (
                                                <View className="w-0.5 h-full bg-green-200 absolute top-3" />
                                            )}
                                        </View>
                                        <Text className="font-medium">
                                            {formatDate(timelineItem.date)}: ({timelineItem.time})
                                        </Text>
                                        <Text className="text-gray-600 mt-1">
                                            {formatTimelineMessage(timelineItem.message, showUserInfo ? "collector" : "user")}
                                        </Text>

                                    </View>
                                ))}
                            </View>
                            {status === ORDER_STATUS.RECYCLED && (
                                <FeedbackComponent
                                    orderId={id}
                                    role={showUserInfo ? 'collector' : 'user'}
                                    existingFeedback={feedback}
                                    onFeedbackSubmitted={() => {
                                        //    Alert.alert('Feedback submitted successfully!');
                                    }}
                                />
                            )}
                        </View>
                    )}

                    {/* User info section for collector view */}
                    {showUserInfo && user && (
                        <View className="px-4 pt-3 pb-1 bg-green-50 bg-opacity-10">
                            <Text className="font-medium">Customer: {user.fullName}</Text>
                            {contactNumber && (
                                <Text
                                onPress={() => Linking.openURL(`tel:${contactNumber}`)}
                                className="text-gray-600">Phone: {contactNumber}</Text>
                            )}
                            {pickupAddress?.formattedAddress && (
                                <Text className="text-gray-600 mt-1" numberOfLines={2}>
                                    Address: {formatAddress(pickupAddress.formattedAddress)}
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Collector info section for user view */}
                    {!showUserInfo && collector && (
                        <View className="px-4 pt-3 pb-1 bg-green-50 bg-opacity-10">
                            <Text className="font-medium">Collector: {collector?.fullName}</Text>
                            {collector?.phone && (
                                <Text
                                onPress={() => Linking.openURL(`tel:${collector.phone}`)}
                                className="text-gray-600">Phone: {collector.phone}</Text>
                            )}
                            {pickupAddress?.formattedAddress && (
                                <Text className="text-gray-600 mt-1" numberOfLines={2}>
                                    Collection Address: {formatAddress(pickupAddress.formattedAddress)}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default OrderHistoryCard;