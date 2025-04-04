import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

// Type definitions
type PriceUpdateCardProps = {
    material: string;
    price: string;
    trend: 'up' | 'down';
};


// Component for Price Update Card
const PriceUpdateCard: React.FC<PriceUpdateCardProps> = ({ material, price, trend }) => {
    return (
        <View className="bg-white py-3 px-4 rounded-lg border border-gray-200 flex-1 items-center">
            <Text className="text-gray-600 mb-1 text-base">{material}</Text>
            <View className="flex-row items-center">
                <Text className="font-bold mr-1 text-lg">रु{price}/kg</Text>
                <Ionicons
                    name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={trend === 'up' ? '#32CD32' : '#FF6347'}
                />
            </View>
        </View>
    );
};

export default PriceUpdateCard;