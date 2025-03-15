import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CollectorOtherLayout() {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name="order-request"
                options={{
                    headerShown: true,
                    header: () => (
                        <View className="pt-4 pb-3 px-4 flex-row items-center border-b border-gray-200">
                            <TouchableOpacity onPress={() => router.back()} className="mr-4">
                                <Ionicons name="chevron-back" size={24} color="black" />
                            </TouchableOpacity>
                            <Text className="text-lg ml-28 font-semibold">Order Request</Text>
                        </View>

                    )
                }}
            />
        </Stack>
    );
}
