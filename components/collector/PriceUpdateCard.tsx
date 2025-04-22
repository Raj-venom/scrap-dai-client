import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type PriceUpdateCardProps = {
    material: string;
    price: string;
    trend?: 'up' | 'down';
};


const PriceUpdateCard: React.FC<PriceUpdateCardProps> = ({ material, price, trend }) => {
    return (
        <View className="bg-white py-3 px-4 rounded-lg border border-gray-200 flex-1 items-center justify-between h-28">
            <Text
                className="text-gray-600 mb-1 text-base text-center"
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {material}
            </Text>
            <View className="flex-row items-center">
                <Text className="font-bold mr-1 text-lg">रु{price}/kg</Text>
                {
                    trend === 'up' ? (
                        <Ionicons name="arrow-up" size={16} color="#32CD32" />
                    ) : trend === 'down' ? (
                        <Ionicons name="arrow-down" size={16} color="#FF6347" />
                    ) : null
                }
            </View>
        </View>
    );
};


export default PriceUpdateCard;