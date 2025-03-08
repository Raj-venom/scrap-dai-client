import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MenuButton from "@/components/MenuButton";
import StatsCard from "@/components/StatsCard";
import { router } from 'expo-router';
import ImpactCard from '@/components/ImpactCard';


export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <View className="flex-row justify-between items-center mb-5">
                <View>
                    <Text className="text-2xl font-bold">Hi Dhruv,</Text>
                    <Text className="text-gray-500">What do you want to sell?</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View className="flex-row gap-3 mb-5">
                <StatsCard title="Quantity recycled" value="18 Kg" />
                <StatsCard title="Orders Completed" value="2" />
            </View>

            <View className="mb-5">
                <ImpactCard
                    energySaved="230 kWh"
                    waterSaved="1,823 Ltrs"
                    treesSaved="36 Trees"
                    oreSaved="18 kg Ore"
                />
            </View>


            <MenuButton
                title="Rate Card"
                subtitle="Know the real-time prices of different materials"
                onPress={() => { }}
            />

            <MenuButton
                title="Sell your scrap"
                subtitle="Schedule a pick-up with our partner and sell your scrap"
                onPress={() => router.push("/sell-scrap")}
            />

        </SafeAreaView>
    );
}
