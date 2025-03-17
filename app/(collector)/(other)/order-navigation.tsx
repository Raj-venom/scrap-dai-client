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
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import OrderDetailsCard from '@/components/collector/OrderDetailsCard';

// Type definitions
type ScrapItem = {
    id: string;
    name: string;
    estimatedWeight: number;
    price: number;
    weight?: number;
    amount?: number;
};

type OrderDetails = {
    id: string;
    customerName: string;
    address: string;
    scrapItems: ScrapItem[];
    destination: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    estimatedAmount: number;
    totalAmount?: number;
    phoneNumber: string;
};

type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const OrderNavigationScreen = (): JSX.Element => {
    const mapRef = useRef<MapView | null>(null);
    const locationSubscription = useRef<any>(null);

    const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number, longitude: number }>>([]);

    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        id: '123456',
        customerName: 'Dhruv Sachdeva',
        // ww.google.com/maps/place/Herald+College+Kathmandu/@27.712094,85.3281912,17
        address: 'Herald College Kathmandu',
        scrapItems: [
            { id: '1', name: 'Steel', estimatedWeight: 5, price: 45 },
            { id: '2', name: 'Brass', estimatedWeight: 3, price: 250 },
            { id: '3', name: 'Tin', estimatedWeight: 2, price: 30 },
            { id: '4', name: 'Cans', estimatedWeight: 1, price: 20 }
        ],
        destination: {
            latitude: 27.712094,
            longitude: 85.3281912,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        },
        estimatedAmount: 1245,
        phoneNumber: '9001'
    });

    // Update item weights and amounts
    const updateItem = (id: string, weight: string): void => {
        const updatedItems = orderDetails.scrapItems.map(item => {
            if (item.id === id) {
                const weightNum = parseFloat(weight) || 0;
                const amount = weightNum * item.price;
                return { ...item, weight: weightNum, amount: amount };
            }
            return item;
        });

        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);

        setOrderDetails({
            ...orderDetails,
            scrapItems: updatedItems,
            totalAmount: totalAmount
        });
    };

    // Get user's current location once
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
                setIsLoading(false);
            } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert(
                    'Location Error',
                    'Unable to retrieve your current location. Please check your device settings.',
                    [{ text: "OK" }]
                );
                setIsLoading(false);
            }
        })();

        // Clean up location tracking on unmount
        return () => {
            if (locationSubscription.current) {
                locationSubscription.current.remove();
            }
        };
    }, []);

    // Function to start navigation with route directions using OSRM
    const startNavigation = async (): Promise<void> => {
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

            // Fetch directions using OSRM API (free and open source)
            const startPoint = `${longitude},${latitude}`;
            const endPoint = `${orderDetails.destination.longitude},${orderDetails.destination.latitude}`;

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${startPoint};${endPoint}?overview=full&geometries=geojson`
            );

            const result = await response.json();

            if (result.code !== 'Ok') {
                throw new Error('Directions request failed');
            }

            // Define proper type for coordinates
            type OSRMCoordinate = [number, number];

            // Extract route coordinates from the response
            const routeCoords = result.routes[0].geometry.coordinates.map((coord: OSRMCoordinate) => ({
                longitude: coord[0],
                latitude: coord[1]
            }));

            // Set the route coordinates
            setRouteCoordinates(routeCoords);

            // Start watching position to update user's location along the route
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


    const stopNavigation = (): void => {
        // Remove location subscription
        if (locationSubscription.current) {
            locationSubscription.current.remove();
            locationSubscription.current = null;
        }
        setIsNavigating(false);

        // Fit map to show the entire route plus markers
        if (mapRef.current && routeCoordinates.length > 0) {
            // Make sure both points and the full route are visible
            setTimeout(() => {
                const coordsToFit = [
                    { latitude: currentLocation?.latitude || 0, longitude: currentLocation?.longitude || 0 },
                    { latitude: orderDetails.destination.latitude, longitude: orderDetails.destination.longitude },
                    ...routeCoordinates
                ].filter(coord => coord.latitude !== 0);

                mapRef.current?.fitToCoordinates(coordsToFit, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }, 200);
        } else {
            // Fallback to just showing the markers if no route coordinates
            mapRef.current?.fitToSuppliedMarkers(['current', 'destination'], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    };

    // Open external navigation app (Google Maps)
    const openExternalNavigation = (): void => {
        const { latitude, longitude } = orderDetails.destination;
        const destination = `${latitude},${longitude}`;

        // Scheme for different platforms
        const scheme = Platform.select({
            ios: 'maps:',
            android: 'google.navigation:'
        });

        // Query parameters
        const query = Platform.select({
            ios: `?daddr=${destination}&dirflg=d`,
            android: `?q=${destination}&mode=d`
        });

        // Full URL
        const url = `${scheme}${query}`;

        // Open external navigation app
        Linking.openURL(url).catch(err => {
            console.error('Error opening navigation app:', err);
            Alert.alert(
                'Navigation App Error',
                'Could not open navigation app. Make sure you have Google Maps installed.',
                [{ text: "OK" }]
            );
        });
    };

    // Center the map to show both current location and destination
    useEffect(() => {
        if (currentLocation && mapRef.current && !isNavigating) {
            setTimeout(() => {
                mapRef.current?.fitToSuppliedMarkers(['current', 'destination'], {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }, 1000);
        }
    }, [currentLocation, isNavigating]);

    const handleReachedDestination = (): void => {
        // Stop navigation tracking if active
        if (isNavigating) {
            stopNavigation();
        }
        setShowModal(true);
    };

    const handleSubmitOrder = (): void => {
        // Calculate if all weights are filled
        const allWeightsFilled = orderDetails.scrapItems.every(item =>
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

        // TODO: Submit order details to server
        Alert.alert(
            'Order Updated',
            `Total amount: रु${orderDetails.totalAmount?.toFixed(2) || 0}`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setShowModal(false);
                        router.push('/(collector)/(tabs)/home');  // Navigate to collector dashboard
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text>Loading map...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Map */}
            <View style={styles.mapContainer}>
                {currentLocation && (
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_DEFAULT}
                        style={styles.map}
                        initialRegion={currentLocation}
                        showsUserLocation={true}
                        followsUserLocation={isNavigating}
                    >
                        {/* Current location marker */}
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

                        {/* Destination marker */}
                        <Marker
                            identifier="destination"
                            coordinate={{
                                latitude: orderDetails.destination.latitude,
                                longitude: orderDetails.destination.longitude,
                            }}
                            title={orderDetails.customerName}
                            description={orderDetails.address}
                        >
                            <View style={styles.destinationMarker}>
                                <Ionicons name="flag" size={16} color="white" />
                            </View>
                        </Marker>

                        {/* Route line */}
                        {routeCoordinates.length > 1 && (
                            <Polyline
                                coordinates={routeCoordinates}
                                strokeWidth={4}
                                strokeColor="#4285F4"
                            />
                        )}
                    </MapView>
                )}

                {/* Navigation Control Buttons */}
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

            {/* Order Details */}
            <OrderDetailsCard
                orderDetails={orderDetails}
                handleReachedDestination={handleReachedDestination}
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
                            <Text className="text-gray-700 mb-2">Please enter the actual weight for each scrap item:</Text>

                            {orderDetails.scrapItems.map(item => (
                                <View key={item.id} className="mb-4 border-b border-gray-200 pb-3">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text className="font-bold">{item.name}</Text>
                                        <Text>रु{item.price}/kg</Text>
                                    </View>

                                    <View className="flex-row items-center">
                                        <View className="flex-1 mr-3">
                                            <Text className="text-gray-600 mb-1">Actual Weight (kg)</Text>
                                            <TextInput
                                                className="border border-gray-300 rounded-md py-2 px-3"
                                                keyboardType="numeric"
                                                placeholder="Enter weight"
                                                value={item.weight !== undefined ? item.weight.toString() : ''}
                                                onChangeText={(text) => updateItem(item.id, text)}
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
                                        रु{orderDetails.totalAmount !== undefined ? orderDetails.totalAmount.toFixed(2) : '0.00'}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            className="bg-primary py-3 rounded-lg"
                            onPress={handleSubmitOrder}
                        >
                            <Text className="text-white text-center font-bold">Complete Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// StyleSheet for MapView and map-related components
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

