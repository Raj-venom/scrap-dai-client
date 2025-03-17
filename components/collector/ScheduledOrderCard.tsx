import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";


type ScheduledOrderCardProps = {
    date: string;
    material: string;
    location: string;
    onPress: () => void;
};

const ScheduledOrderCard: React.FC<ScheduledOrderCardProps> = ({ date, material, location, onPress }) => {
    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-lg border border-gray-200 mb-3 flex-row justify-between items-center"
            onPress={onPress}
        >
            <View>
                <Text className="font-bold mb-1 text-base">{date}</Text>
                <Text className="text-gray-600 text-base">{material}</Text>
                <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={16} color="gray" />
                    <Text className="text-gray-500 text-sm ml-1">{location}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color="gray" />
        </TouchableOpacity>
    );
};

export default ScheduledOrderCard;
