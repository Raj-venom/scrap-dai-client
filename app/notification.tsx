import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, Alert } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import notificationService from '@/services/notification/notificationService';
import { getRole } from "@/services/token/tokenService";
import { USER_ROLE } from "@/constants";

const NOTIFICATION_TYPES = {
    ORDER_ACCEPTED: "ORDER_ACCEPTED",
    ORDER_RECYCLED: "ORDER_RECYCLED",
    ORDER_CANCELLED: "ORDER_CANCELLED",
    GENERAL: "GENERAL",
    PROMOTIONAL: "PROMOTIONAL",
    SYSTEM: "SYSTEM",
};

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    order?: {
        _id: string;
        status: string;
    };
    createdAt: string;
}

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
    const router = useRouter();
    const user = useSelector((state: any) => state.auth.userData);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getNotifications(user);
            if (res?.success) {
                setNotifications(res?.data);
            } else {
                // Alert.alert('Error', res?.message || 'Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setMarkingAllAsRead(true);
            const role = await getRole();
            let response;

            if (role === USER_ROLE.USER) {
                response = await notificationService.markAsAllReadUser(user._id);
            } else if (role === USER_ROLE.COLLECTOR) {
                response = await notificationService.markAsAllReadCollector(user._id);
            } else {
                Alert.alert("Error", "Invalid user role");
                setMarkingAllAsRead(false);
                return;
            }

            if (response.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                Alert.alert("Success", "All notifications marked as read");
            } else {
                Alert.alert("Error", response.message || "Failed to mark all as read");
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            Alert.alert("Error", "Failed to mark all notifications as read");
        } finally {
            setMarkingAllAsRead(false);
        }
    };

    const handleNotificationPress = async (notification: Notification) => {
        try {
            const role = await getRole();

            if (!notification.isRead) {
                markAsRead(notification._id);
            }

            if ([
                NOTIFICATION_TYPES.ORDER_ACCEPTED,
                NOTIFICATION_TYPES.ORDER_RECYCLED,
                NOTIFICATION_TYPES.ORDER_CANCELLED
            ].includes(notification.type)) {

                if (role === USER_ROLE.COLLECTOR) {
                    router.push(`/(collector)/(tabs)/history`);
                } else if (role === USER_ROLE.USER) {
                    router.push(`/(user)/(tabs)/history`);
                } else {
                    Alert.alert("Error", "Invalid user role.");
                }
            } else if (notification.type === NOTIFICATION_TYPES.PROMOTIONAL || notification.type === NOTIFICATION_TYPES.GENERAL || notification.type === NOTIFICATION_TYPES.SYSTEM) {
                router.push(`/PromotionsScreen`);
            }
        } catch (error) {
            console.error('Error handling notification press:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case NOTIFICATION_TYPES.ORDER_ACCEPTED:
                return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
            case NOTIFICATION_TYPES.ORDER_RECYCLED:
                return <Ionicons name="refresh-circle" size={24} color="#2196F3" />;
            case NOTIFICATION_TYPES.ORDER_CANCELLED:
                return <Ionicons name="close-circle" size={24} color="#F44336" />;
            default:
                return <Ionicons name="notifications" size={24} color="#FFC107" />;
        }
    };

    const hasUnreadNotifications = notifications.some(n => !n.isRead);

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            className={`flex-row p-4 border-b border-gray-200 ${!item.isRead ? 'bg-blue-50' : 'bg-white'}`}
            onPress={() => handleNotificationPress(item)}
        >
            <View className="mr-4 justify-center">
                {getNotificationIcon(item.type)}
            </View>
            <View className="flex-1">
                <Text className="text-lg font-bold">{item.title}</Text>
                <Text className="text-gray-600">{item.message}</Text>
                <Text className="text-gray-400 text-xs mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                </Text>
            </View>
            {!item.isRead && (
                <View className="w-2 h-2 rounded-full bg-blue-500 self-center" />
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">

            {notifications.length > 0 && (
                <View>
                    {hasUnreadNotifications && (
                        <View className="bg-green-200 p-2  flex-row justify-end items-center">
                            <TouchableOpacity
                                className="bg-green-600 px-3 py-2 rounded-md flex-row items-center"
                                onPress={markAllAsRead}
                                disabled={markingAllAsRead}
                            >
                                {markingAllAsRead ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                                        <Text className="text-white font-semibold ml-1">Mark All Read</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center p-5">
                        <Ionicons name="notifications-off" size={48} color="#ccc" />
                        <Text className="text-gray-500 mt-2">No notifications yet</Text>
                    </View>
                }
            />
        </View>
    );
}