import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    TextInput,
    Alert,
    Linking,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import OrderDetailsCard from '@/components/collector/OrderDetailsCard';
import orderService from '@/services/order/orderService';
import { OrderRequest } from '@/types/type';


type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const OrderNavigationScreen = (): JSX.Element => {
    const { id } = useLocalSearchParams();
    const mapRef = useRef<MapView | null>(null);
    const locationSubscription = useRef<any>(null);

    const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number, longitude: number }>>([]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [orderDetails, setOrderDetails] = useState<OrderRequest | null>(null);

    // Fetch order details
    const fetchOrderDetails = async () => {
        try {
            const response = await orderService.getOrderById(Array.isArray(id) ? id[0] : id);

            if (response.success) {
                // console.log('Order Details:', response.data);
                setOrderDetails(response.data);
            } else {
                console.log('API :: getOrderById :: error', response);
                Alert.alert('Error', 'Could not fetch order details');
            }
        } catch (error: any) {
            console.log('API :: getOrderById :: error', error.response);
            Alert.alert('Error', 'An error occurred while fetching order details');
        }
    };

    // Get user's current location
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Denied',
                        'We need location permissions to navigate to the customer.',
                        [{ text: "OK" }]
                    );
                    setIsLoading(false);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });

                const { latitude, longitude } = location.coords;

                const initialLocation = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };

                setCurrentLocation(initialLocation);
                setRouteCoordinates([{ latitude, longitude }]);
            } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert(
                    'Location Error',
                    'Unable to retrieve your current location. Please check your device settings.',
                    [{ text: "OK" }]
                );
            } finally {
                setIsLoading(false);
            }
        })();

        // Fetch order details
        if (id) {
            fetchOrderDetails();
        }

        // Clean up location tracking on unmount
        return () => {
            if (locationSubscription.current) {
                locationSubscription.current.remove();
            }
        };
    }, [id]);


    // Start Navigation with Route Directions
    const startNavigation = async (): Promise<void> => {
        if (!orderDetails) return;

        try {
            // Clear any existing subscription
            if (locationSubscription.current) {
                locationSubscription.current.remove();
            }

            setIsNavigating(true);

            // Get current location
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const { latitude, longitude } = location.coords;

            // Set initial current location
            const newLocation: LocationType = {
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setCurrentLocation(newLocation);

            // Fetch directions using OSRM API
            const startPoint = `${longitude},${latitude}`;
            const endPoint = `${orderDetails.pickupAddress.longitude},${orderDetails.pickupAddress.latitude}`;

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${startPoint};${endPoint}?overview=full&geometries=geojson`
            );

            const result = await response.json();

            if (result.code !== 'Ok') {
                throw new Error('Directions request failed');
            }

            type OSRMCoordinate = [number, number];

            // Extract route coordinates
            const routeCoords = result.routes[0].geometry.coordinates.map((coord: OSRMCoordinate) => ({
                longitude: coord[0],
                latitude: coord[1]
            }));

            // Set the route coordinates
            setRouteCoordinates(routeCoords);

            // Start watching position
            locationSubscription.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000,
                    distanceInterval: 10,
                },
                (locationUpdate) => {
                    const { latitude: newLat, longitude: newLong } = locationUpdate.coords;

                    const updatedLocation: LocationType = {
                        latitude: newLat,
                        longitude: newLong,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    };

                    setCurrentLocation(updatedLocation);

                    // Move map to follow current location
                    mapRef.current?.animateToRegion(updatedLocation, 500);
                }
            );

            // Fit map to show the entire route
            if (mapRef.current && routeCoords.length > 0) {
                const routeLatLngs = routeCoords.map((coord: { latitude: number, longitude: number }) => ({
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                }));

                mapRef.current.fitToCoordinates(routeLatLngs, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }
        } catch (error) {
            console.error('Error starting navigation:', error);
            Alert.alert(
                'Navigation Error',
                'Unable to get directions. Please try again or use external navigation.',
                [{ text: "OK" }]
            );
            setIsNavigating(false);
        }
    };

    // call startNavigation function when orderDetails is fetched
    useEffect(() => {
        if (orderDetails) {
            startNavigation();
        }
    }, [orderDetails]);


    // Stop Navigation
    const stopNavigation = (): void => {
        // Remove location subscription
        if (locationSubscription.current) {
            locationSubscription.current.remove();
            locationSubscription.current = null;
        }
        setIsNavigating(false);

        // Fit map to show the entire route plus markers
        if (mapRef.current && routeCoordinates.length > 0 && orderDetails) {
            setTimeout(() => {
                const coordsToFit = [
                    { latitude: currentLocation?.latitude || 0, longitude: currentLocation?.longitude || 0 },
                    {
                        latitude: orderDetails.pickupAddress.latitude,
                        longitude: orderDetails.pickupAddress.longitude
                    },
                    ...routeCoordinates
                ].filter(coord => coord.latitude !== 0);

                mapRef.current?.fitToCoordinates(coordsToFit, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }, 200);
        }
    };

    // Open External Navigation App
    const openExternalNavigation = (): void => {
        if (!orderDetails) return;

        const { latitude, longitude } = orderDetails.pickupAddress;
        const destination = `${latitude},${longitude}`;

        const scheme = Platform.select({
            ios: 'maps:',
            android: 'google.navigation:'
        });

        const query = Platform.select({
            ios: `?daddr=${destination}&dirflg=d`,
            android: `?q=${destination}&mode=d`
        });

        const url = `${scheme}${query}`;

        Linking.openURL(url).catch(err => {
            console.error('Error opening navigation app:', err);
            Alert.alert(
                'Navigation App Error',
                'Could not open navigation app. Make sure you have Google Maps installed.',
                [{ text: "OK" }]
            );
        });
    };

    // Update Item Weight and Amount
    const updateItem = (itemId: string, weight: string): void => {
        if (!orderDetails) return;

        const updatedOrderItems = orderDetails.orderItem.map(item => {
            if (item._id === itemId) {
                const weightNum = parseFloat(weight) || 0;
                const amount = weightNum * item.scrap.pricePerKg;
                return { ...item, weight: weightNum, amount: amount };
            }
            return item;
        });

        const totalAmount = updatedOrderItems.reduce((sum, item) => sum + item.amount, 0);

        setOrderDetails({
            ...orderDetails,
            orderItem: updatedOrderItems,
            estimatedAmount: totalAmount
        });
    };

    // Submit Order
    const handleSubmitOrder = async () => {
        setIsSubmitting(true);

        if (!orderDetails) return;

        const allWeightsFilled = orderDetails.orderItem.every(item =>
            item.weight !== undefined && item.weight > 0
        );

        if (!allWeightsFilled) {
            Alert.alert(
                'Incomplete Information',
                'Please enter weights for all scrap items',
                [{ text: "OK" }]
            );
            return;
        }

        try {
            const updatedOrder = await orderService.completeOrder(orderDetails._id, orderDetails.orderItem);

            if (!updatedOrder.success) {
                Alert.alert('Error', updatedOrder.message || 'An error occurred while completing the order');
                return;
            }


            Alert.alert(
                'Order Successfully Updated',
                `The total amount for this order is रु${updatedOrder.data.totalAmount.toFixed(2)}.`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setShowModal(false);
                            router.replace('/(collector)/(tabs)/home');
                        },
                    },
                ]
            );
        } catch (error: any) {
            console.log('API :: completeOrder :: error', error.response);
            Alert.alert('Error', 'An error occurred while completing the order');

        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Loading State
    if (isLoading || !orderDetails) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text>Loading order details...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Map Container */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    initialRegion={{
                        latitude: orderDetails.pickupAddress.latitude,
                        longitude: orderDetails.pickupAddress.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={isNavigating}
                >
                    {/* Current Location Marker */}
                    {currentLocation && (
                        <Marker
                            identifier="current"
                            coordinate={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            }}
                            title="Your Location"
                        >
                            <View style={styles.currentLocationMarker}>
                                <Ionicons name="location" size={16} color="white" />
                            </View>
                        </Marker>
                    )}

                    {/* Destination Marker */}
                    <Marker
                        identifier="destination"
                        coordinate={{
                            latitude: orderDetails.pickupAddress.latitude,
                            longitude: orderDetails.pickupAddress.longitude,
                        }}
                        title={orderDetails.user.fullName}
                        description={orderDetails.pickupAddress.formattedAddress}
                    >
                        <View style={styles.destinationMarker}>
                            <Ionicons name="flag" size={16} color="white" />
                        </View>
                    </Marker>

                    {/* Route Line */}
                    {routeCoordinates.length > 1 && (
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeWidth={4}
                            strokeColor="#4285F4"
                        />
                    )}
                </MapView>

                {/* Navigation Controls */}
                <View style={styles.navigationControls}>
                    {!isNavigating ? (
                        <TouchableOpacity
                            style={styles.navigationButton}
                            onPress={startNavigation}
                        >
                            <Ionicons name="navigate" size={22} color="white" />
                            <Text style={styles.navigationButtonText}>Start Navigation</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.navigationButton, { backgroundColor: '#f97316' }]}
                            onPress={stopNavigation}
                        >
                            <Ionicons name="stop-circle" size={22} color="white" />
                            <Text style={styles.navigationButtonText}>Stop Navigation</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.navigationButton, { backgroundColor: '#3b82f6', marginTop: 8 }]}
                        onPress={openExternalNavigation}
                    >
                        <Ionicons name="map" size={22} color="white" />
                        <Text style={styles.navigationButtonText}>Open in Google Maps</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Order Details Card */}
            <OrderDetailsCard
                orderDetails={{
                    id: orderDetails._id,
                    customerName: orderDetails.user.fullName,
                    address: orderDetails.pickupAddress.formattedAddress,
                    scrapItems: orderDetails.orderItem.map(item => ({
                        id: item._id,
                        name: item.scrap.name,
                        estimatedWeight: item.weight,
                        price: item.scrap.pricePerKg,
                        weight: item.weight,
                        amount: item.amount
                    })),
                    destination: {
                        latitude: orderDetails.pickupAddress.latitude,
                        longitude: orderDetails.pickupAddress.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    },
                    estimatedAmount: orderDetails.estimatedAmount,
                    totalAmount: orderDetails.estimatedAmount,
                    phoneNumber: orderDetails.contactNumber
                }}
                handleReachedDestination={() => setShowModal(true)}
            />

            {/* Order Update Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-4 max-h-5/6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">Update Order Details</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="mb-4">
                            <Text className="text-gray-700 mb-2">
                                Please enter the actual weight for each scrap item:
                            </Text>

                            {orderDetails.orderItem.map(item => (
                                <View key={item._id} className="mb-4 border-b border-gray-200 pb-3">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text className="font-bold">{item.scrap.name}</Text>
                                        <Text>रु{item.scrap.pricePerKg}/kg</Text>
                                    </View>

                                    <View className="flex-row items-center">
                                        <View className="flex-1 mr-3">
                                            <Text className="text-gray-600 mb-1">Actual Weight (kg)</Text>
                                            <TextInput
                                                className="border border-gray-300 rounded-md py-2 px-3"
                                                keyboardType="numeric"
                                                placeholder="Enter weight"
                                                value={item.weight !== undefined ? item.weight.toString() : ''}
                                                onChangeText={(text) => updateItem(item._id, text)}
                                            />
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-gray-600 mb-1">Amount (रु)</Text>
                                            <View className="border border-gray-300 rounded-md py-2 px-3 bg-gray-50">
                                                <Text>{item.amount !== undefined ? item.amount.toFixed(2) : '0.00'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            <View className="mb-4 py-3 bg-gray-100 px-3 rounded-lg">
                                <View className="flex-row justify-between items-center">
                                    <Text className="font-bold">Total Amount:</Text>
                                    <Text className="font-bold text-lg">
                                        रु{orderDetails.orderItem.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            className="bg-primary py-3 rounded-lg"
                            onPress={() => {
                                Alert.alert(
                                    "Confirm Order Completion",
                                    "Are you sure you want to complete this order?",
                                    [
                                        {
                                            text: "Cancel",
                                            style: "cancel"
                                        },
                                        {
                                            text: "Confirm",
                                            onPress: handleSubmitOrder
                                        }
                                    ]
                                );
                            }}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-bold">Complete Order</Text>
                            )}
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

// StyleSheet
const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        width: '100%',
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    currentLocationMarker: {
        backgroundColor: '#3b82f6',
        padding: 8,
        borderRadius: 20,
    },
    destinationMarker: {
        backgroundColor: '#22c55e',
        padding: 8,
        borderRadius: 20,
    },
    navigationControls: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    navigationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f87171',
        borderRadius: 8,
    },
    navigationButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default OrderNavigationScreen;