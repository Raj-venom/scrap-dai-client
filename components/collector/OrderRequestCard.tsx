import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type OrderRequestCardProps = {
    date: string;
    material: string;
    location: string;
    onAccept: () => void;
    onIgnore: () => void;
};


const OrderRequestCard: React.FC<OrderRequestCardProps> = ({ date, material, location, onAccept, onIgnore }) => {
    return (
        <View className="bg-white p-4 rounded-lg border border-gray-200 mb-3 mr-3" style={{ width: 350 }}>
            <View className="flex-row justify-between items-center mb-1">
                <Text className="font-bold text-base">{date}</Text>
                <View className="flex-row">
                    <TouchableOpacity
                        className="bg-primary rounded-md px-3 py-1 mr-2"
                        onPress={onAccept}
                    >
                        <Text className="text-white text-sm">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-white border border-gray-300 rounded-md px-3 py-1"
                        onPress={onIgnore}
                    >
                        <Text className="text-gray-600 text-sm">Ignore</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text className="text-gray-600 text-base">{material}</Text>
            <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text className="text-gray-500 text-sm ml-1">{location}</Text>
            </View>
        </View>
    );
};


export default OrderRequestCard;