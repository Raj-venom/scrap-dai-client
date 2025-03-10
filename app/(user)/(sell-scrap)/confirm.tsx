import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentOptionScreen(): JSX.Element {
    const router = useRouter();

    // Selected payment method state
    const [selectedPayment, setSelectedPayment] = useState<string>('cash');
    // Modal visibility state
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Order success state
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

    // Sample summary data (in a real app, this would come from context or params)
    const summary = [
        { item: 'Steel', weight: '3.5 kg', price: '₹135-₹175' },
        { item: 'Carton', weight: '1.9 kg', price: '₹45-₹72' }
    ];

    // Calculate estimated total range
    const totalEstimate = '₹180-₹247';

    // Estimated pickup date (just for display)
    const estimatedPickupDate = "March 13, 2025";

    // Function to handle order confirmation
    const handleConfirmOrder = () => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Simulate 90% success rate
            const success = Math.random() < 0.9;

            if (success) {
                setOrderSuccess(true);
                setModalVisible(true);
            } else {
                setIsLoading(false);
                Alert.alert("Order Failed", "Failed to place order. Please try again.");
            }
        }, 1500);
    };

    // Function to close modal and navigate
    const handleCloseModal = () => {
        setModalVisible(false);
        router.replace("/(user)/(tabs)/home");
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1 px-4 py-4">
                {/* Payment Method Section */}
                <Text className="text-lg font-bold mb-4">Payment Method</Text>

                {/* Cash Option */}
                <TouchableOpacity
                    className="flex-row items-center mb-3 p-4 border border-gray-200 rounded-lg bg-green-50"
                    onPress={() => setSelectedPayment('cash')}
                >
                    <View className="w-10 h-10 justify-center items-center bg-gray-100 rounded-md">
                        <Ionicons name="cash-outline" size={24} color="gray" />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-base font-medium">Cash</Text>
                        <Text className="text-sm text-gray-500">Get instant Cash</Text>
                    </View>
                    <View className="h-6 w-6 border-2 rounded-full border-green-500 justify-center items-center">
                        <View className="h-3 w-3 rounded-full bg-green-500" />
                    </View>
                </TouchableOpacity>

                {/* Summary Section */}
                <View className="mt-6">
                    <Text className="text-lg font-bold mb-3">Summary</Text>

                    {summary.map((item, index) => (
                        <View key={index} className="flex-row justify-between mb-2">
                            <Text className="text-base">{item.weight} {item.item}</Text>
                            <Text className="text-base">{item.price}</Text>
                        </View>
                    ))}

                    <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-200">
                        <View className="flex-row items-center">
                            <Text className="text-base font-bold">Total Estimate</Text>
                            <TouchableOpacity className="ml-1">
                                <Ionicons name="information-circle-outline" size={16} color="gray" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-base font-bold">{totalEstimate}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Confirm Order Button */}
            <View className="px-4 py-4 border-t border-gray-200">
                <TouchableOpacity
                    className="bg-green-500 py-3 rounded-lg items-center justify-center"
                    onPress={handleConfirmOrder}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Confirm Order</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-6 rounded-lg w-4/5 items-center">
                        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="checkmark-circle" size={40} color="green" />
                        </View>

                        <Text className="text-xl font-bold text-center mb-2">Thank You!</Text>
                        <Text className="text-base text-center mb-4">Order placed successfully</Text>

                        <View className="w-full mb-4">
                            <View className="flex-row justify-between py-2 border-b border-gray-200">
                                <Text className="text-gray-500">Estimated Pickup Date</Text>
                                <Text className="font-medium">{estimatedPickupDate}</Text>
                            </View>

                            <View className="flex-row justify-between py-2 border-b border-gray-200">
                                <Text className="text-gray-500">Payment Method</Text>
                                <Text className="font-medium">Cash on Delivery</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-green-500 py-3 px-6 rounded-lg w-full"
                            onPress={handleCloseModal}
                        >
                            <Text className="text-white font-bold text-center">Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}