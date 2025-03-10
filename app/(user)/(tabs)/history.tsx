import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusColor } from '@/constants';

interface HistoryItem {
  id: string;
  date: string;
  materials: string;
  status: 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'RECYCLED';
  timeline?: {
    date: string;
    time: string;
    message: string;
  }[];
  isExpanded?: boolean;
}

export default function HistoryScreen(): JSX.Element {
  // Sample history data
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: '1',
      date: '14 March, 2024',
      materials: 'Material: 3.5 kg Steel, 5.8 kg Carton',
      status: 'PENDING',
      isExpanded: false
    },
    {
      id: '2',
      date: '10 March, 2024',
      materials: 'Material: 7 kg Newspaper',
      status: 'ACCEPTED',
      isExpanded: false,
      timeline: [
        {
          date: '10 March, 2024',
          time: '11:07pm',
          message: 'Our partner has accepted your scrap request.'
        },
      ]
    },
    {
      id: '3',
      date: '16 March, 2024',
      materials: 'Material: 10 kg Carton, 2 kg Paper',
      status: 'CANCELLED',
      isExpanded: false
    },
    {
      id: '4',
      date: '25 December, 2023',
      materials: 'Material: 5 kg Tin, 11 kg Steel',
      status: 'RECYCLED',
      isExpanded: false,
      timeline: [
        {
          date: '25 December, 2023',
          time: '10:30am',
          message: 'Our partner has accepted your scrap request.'
        },
        {
          date: '25 December, 2023',
          time: '11:00am',
          message: 'Our partner has picked up the scrap from your location.'
        },
        {
          date: '25 December, 2023',
          time: '12:00pm',
          message: 'The scrap has been recycled successfully.'
        }
      ]
    }
  ]);

  // Function to toggle expansion of an item
  const toggleExpand = (id: string) => {
    setHistoryItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  };


  // Render a single history item
  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <TouchableOpacity
        className="px-4 py-3 bg-gray-50"
        onPress={() => toggleExpand(item.id)}
      >
        <View className="flex-row justify-between items-center">
          <Text className="font-bold">{item.date}</Text>
          <Ionicons
            name={item.isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="gray"
          />
        </View>
        <Text className="text-gray-600 mt-1">{item.materials}</Text>
        <Text className={`font-medium mt-1 ${getStatusColor(item.status)}`}>
          Status: {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
        </Text>
      </TouchableOpacity>

      {item.isExpanded && item.timeline && (
        <View className="px-4 py-3 border-t border-gray-200">
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
  );

  return (
    <View className="flex-1 bg-white">

      <FlatList
        data={historyItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerClassName="px-4 py-4"
      />
    </View>
  );
}