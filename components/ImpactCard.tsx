import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ImpactCardProps {
    energySaved: string;
    waterSaved: string;
    treesSaved: string;
    oreSaved: string;
}

function ImpactCard({ energySaved, waterSaved, treesSaved, oreSaved }: ImpactCardProps) {
    return (
        <View className="bg-[#FFFFF7] p-4 rounded-lg mb-3 border border-[#D9D9D9]">
            <Text className="text-lg font-bold text-[#333333] mb-1">Impact on Environment</Text>
            <Text className="text-base text-[#666666] mb-3">You've saved:</Text>

            <View className="flex flex-row justify-between">
                <View className="items-center">
                    <Ionicons name="flash-outline" size={20} color="#333333" />
                    <Text className="text-base text-[#333333] mt-1">{energySaved}</Text>
                </View>

                <View className="items-center">
                    <Ionicons name="water-outline" size={20} color="#333333" />
                    <Text className="text-base text-[#333333] mt-1">{waterSaved}</Text>
                </View>

                <View className="items-center">
                    <Ionicons name="leaf-outline" size={20} color="#333333" />
                    <Text className="text-base text-[#333333] mt-1">{treesSaved}</Text>
                </View>

                <View className="items-center">
                    <Ionicons name="cube-outline" size={20} color="#333333" />
                    <Text className="text-base text-[#333333] mt-1">{oreSaved}</Text>
                </View>
            </View>
        </View>
    );
}

export default ImpactCard;