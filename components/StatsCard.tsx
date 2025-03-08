import React from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string;
  mini?: boolean;
}

export default function StatsCard({ title, value, mini }: StatsCardProps) {
  if (mini) {
    return (
      <View className="items-center">
        <Text className="text-base font-bold">{value}</Text>
        <Text className="text-gray-600 text-xs">{title}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary p-4 rounded-lg">
      <Text className="text-white mb-2">{title}</Text>
      <Text className="text-white text-2xl font-bold">{value}</Text>
    </View>
  );
}