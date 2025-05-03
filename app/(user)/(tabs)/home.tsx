import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MenuButton from "@/components/MenuButton";
import StatsCard from "@/components/StatsCard";
import { router } from 'expo-router';
import ImpactCard from '@/components/ImpactCard';
import dashboardService from '@/services/dashboard/dashboardService';
import { UserStats } from '@/types/type';
import notificationService from '@/services/notification/notificationService';
import { useSelector } from 'react-redux';



export default function HomeScreen() {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector((state: any) => state.auth.userData);
    const [UnreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const fetchUserStats = async () => {
        try {
            const response = await dashboardService.getUserStats();
            setUserStats(response.data);
        } catch (error: any) {
            console.log('HomeScreen :: error', error);
        }
    };

    const fetchUnreadNotificationsCount = async () => {
        try {
            const response = await notificationService.getUnreadNotificationsCount(user);
            setUnreadNotificationsCount(response.data.count);
        } catch (error: any) {
            console.log('HomeScreen :: error', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                fetchUserStats(),
                fetchUnreadNotificationsCount()
            ]);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                await Promise.all([
                    fetchUserStats(),
                    fetchUnreadNotificationsCount()
                ]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white ">
            <ScrollView
                className="p-4"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#389936']} // Android
                        tintColor="#389936" // iOS
                    />
                }
            >
                <View className="flex-row justify-between items-center mb-5">
                    <View>
                        <Text className="text-2xl font-bold">Hi {userStats?.user.fullName || "User"}</Text>
                        <Text className="text-gray-500">What do you want to sell?</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/notification")}>
                        <View className="relative p-2">
                            <Ionicons name="notifications-outline" size={26} color="black" />
                            {UnreadNotificationsCount > 0 && (
                                <View className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                                    <Text className="text-white text-[10px] font-bold">{UnreadNotificationsCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-3 mb-5">
                    <StatsCard title="Quantity recycled" value={`${userStats?.totalWeight || 0} kg`} />
                    <StatsCard title="Orders Completed" value={`${userStats?.totalCompletedOrders || 0}`} />
                </View>

                <View className="mb-5">
                    <ImpactCard
                        energySaved={userStats?.environmentalImpact?.energySaved || "0 kWh"}
                        waterSaved={userStats?.environmentalImpact?.waterSaved || "0 Ltrs"}
                        co2EmissionsReduced={userStats?.environmentalImpact?.co2EmissionsReduced || "0 kg CO2"}
                    />
                </View>

                <MenuButton
                    title="Rate Card"
                    subtitle="Know the real-time prices of different materials"
                    onPress={() => router.push("/rate-card")}
                />

                <MenuButton
                    title="Sell your scrap"
                    subtitle="Schedule a pick-up with our partner and sell your scrap"
                    onPress={() => router.push("/select-material")}
                />
            </ScrollView>

        </SafeAreaView>
    );
}
