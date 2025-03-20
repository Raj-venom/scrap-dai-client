import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ScrapCategory, Scrap } from '@/types/type';
import orderService from '@/services/order/orderService';


interface SubCategoryWithWeight {
    _id: string;
    weight: string;
}

export default function PaymentOptionScreen(): JSX.Element {
    const router = useRouter();

    // Get all data from Redux store
    const selectedScrapCategoryWithSubCategory = useSelector((state: any) =>
        state.order.selectedScrapCategoryWithSubCategory
    );
    const selectedSubCategory = useSelector((state: any) => state.order.selectedSubCategory);
    const selectedSubCategoryWithWeights = useSelector((state: any) =>
        state.order.selectedSubCategoryWithWeights
    );
    const pickupDate = useSelector((state: any) => state.order.pickupDate);
    const pickupAddress = useSelector((state: any) => state.order.pickupAddress);
    const scrapImages = useSelector((state: any) => state.order.scrapImages);

    // Selected payment method state
    const [selectedPayment, setSelectedPayment] = useState<string>('cash');
    // Modal visibility state
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Order success state
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

    // Prepare summary data from redux state
    const [summary, setSummary] = useState<{ item: string; weight: string; price: string }[]>([]);
    // Calculate total estimate range
    const [totalEstimate, setTotalEstimate] = useState<string>('');

    // Process the selected scraps and prepare summary with the weights
    useEffect(() => {
        if (selectedScrapCategoryWithSubCategory && selectedSubCategoryWithWeights?.length > 0) {
            const summaryItems: { item: string; weight: string; price: string }[] = [];
            let minTotal = 0;
            let maxTotal = 0;

            // Create a map of scrap ID to weight for quick lookup
            const weightMap = new Map<string, string>();
            selectedSubCategoryWithWeights.forEach((item: SubCategoryWithWeight) => {
                weightMap.set(item._id, item.weight);
            });

            selectedScrapCategoryWithSubCategory.forEach((category: ScrapCategory) => {
                const selectedScrapsInCategory = category.scraps.filter((scrap: Scrap) =>
                    selectedSubCategory.includes(scrap._id)
                );

                selectedScrapsInCategory.forEach((scrap: Scrap) => {
                    // Get weight from the map or use 1.0 kg as default if not found
                    const weightStr = weightMap.get(scrap._id) || "1.0";
                    // Convert weight string to number for calculations (remove 'kg' if present)
                    const weight = parseFloat(weightStr.replace('kg', '').trim());
                    const weightDisplay = `${weightStr}${!weightStr.includes('kg') ? ' kg' : ''}`;

                    // Calculate price range (±15% around the base price)
                    const basePrice = scrap.pricePerKg * weight;
                    const minPrice = Math.floor(basePrice * 0.85);
                    const maxPrice = Math.ceil(basePrice * 1.15);

                    summaryItems.push({
                        item: scrap.name,
                        weight: weightDisplay,
                        price: `रु${minPrice}-रु${maxPrice}`
                    });

                    minTotal += minPrice;
                    maxTotal += maxPrice;
                });
            });

            setSummary(summaryItems);
            setTotalEstimate(`रु${minTotal}-रु${maxTotal}`);
        }
    }, [selectedScrapCategoryWithSubCategory, selectedSubCategory, selectedSubCategoryWithWeights]);

    // Format pickup date for display
    const formattedPickupDate = pickupDate;

    // Function to handle order confirmation
    const handleConfirmOrder = async () => {
        try {
            setIsLoading(true);

            // Create a weight map for quick lookup
            const weightMap = new Map<string, string>();
            if (selectedSubCategoryWithWeights?.length > 0) {
                selectedSubCategoryWithWeights.forEach((item: SubCategoryWithWeight) => {
                    weightMap.set(item._id, item.weight);
                });
            }

            // Prepare order items for API with proper weights
            const orderItems = selectedSubCategory.map((scrapId: string) => {
                // Find the scrap in the categories
                let scrap: Scrap | null = null;

                // Get weight from the map or use 1.0 as default if not found
                const weightStr = weightMap.get(scrapId) || "1.0";
                // Convert weight string to number for calculations (remove 'kg' if present)
                const weight = parseFloat(weightStr.replace('kg', '').trim());

                for (const category of selectedScrapCategoryWithSubCategory) {
                    const foundScrap = category.scraps.find((s: Scrap) => s._id === scrapId);
                    if (foundScrap) {
                        scrap = foundScrap;
                        break;
                    }
                }

                if (!scrap) return null;

                return {
                    scrap: scrapId,
                    weight: weight,
                    amount: scrap.pricePerKg * weight
                };
            }).filter((item: any) => item !== null);

            // Calculate estimated amount
            const estimatedAmount = orderItems.reduce((sum: number, item: any) => sum + item.amount, 0);

            // Create FormData for multipart/form-data request
            const formData = new FormData();
            formData.append('pickUpDate', pickupDate);
            formData.append('estimatedAmount', estimatedAmount.toString());
            formData.append('orderItems', JSON.stringify(orderItems));
            formData.append('pickupAddress', JSON.stringify(pickupAddress));

            // Process and append images
            if (scrapImages && scrapImages.length > 0) {
                for (let i = 0; i < scrapImages.length; i++) {
                    const imageInfo = scrapImages[i];

                    // Create file object from URI
                    const fileObj = {
                        uri: imageInfo.uri,
                        type: imageInfo.type,
                        name: imageInfo.id + '.jpg',  
                    };

                    // @ts-ignore - FormData append expects a different type than TypeScript allows
                    formData.append('scrapImages', fileObj);
                }
            }

            const response = await orderService.createOrderWithFormData(formData);

            if (response.success) {
                setOrderSuccess(true);
                setModalVisible(true);
            } else {
                Alert.alert("Order Failed", response.message || "Failed to place order. Please try again.");
            }

        } catch (error) {
            console.error('API :: createOrder :: error', error);
            Alert.alert("Order Failed", "Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
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

                {/* Pickup Location */}
                <View className="mt-6">
                    <Text className="text-lg font-bold mb-3">Pickup Details</Text>
                    <View className="p-3 border border-gray-200 rounded-lg">
                        <View className="flex-row items-start mb-2">
                            <Ionicons name="location-outline" size={18} color="gray" className="mt-1" />
                            <Text className="text-base ml-2 flex-1">{pickupAddress?.formattedAddress || "Address not specified"}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={18} color="gray" />
                            <Text className="text-base ml-2">{formattedPickupDate}</Text>
                        </View>
                    </View>
                </View>

                {/* Image Preview (Optional) */}
                {scrapImages && scrapImages.length > 0 && (
                    <View className="mt-6">
                        <Text className="text-lg font-bold mb-3">Images ({scrapImages.length})</Text>
                        <Text className="text-sm text-gray-500 mb-2">Images will be uploaded when you confirm order</Text>
                    </View>
                )}
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
                                <Text className="font-medium">{formattedPickupDate}</Text>
                            </View>

                            <View className="flex-row justify-between py-2 border-b border-gray-200">
                                <Text className="text-gray-500">Payment Method</Text>
                                <Text className="font-medium">Cash on Delivery</Text>
                            </View>

                            <View className="flex-row justify-between py-2 border-b border-gray-200">
                                <Text className="text-gray-500">Estimated Amount</Text>
                                <Text className="font-medium">{totalEstimate}</Text>
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