import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NextButton from '@/components/NextButton';
import { Calendar } from 'react-native-calendars';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSelector, useDispatch } from 'react-redux';
import { setPickupDate, setPickupAddress, setPickupTime } from '@/contexts/features/userOrder/orderSlice';

export default function DateLocationScreen(): JSX.Element {
  const dispatch = useDispatch();

  const selectedScrapCategoryWithSubCategory = useSelector((state: any) =>
    state.order.selectedScrapCategoryWithSubCategory || []
  );

  const selectedCategory = useSelector((state: any) => state.order.selectedCategory || []);
  const selectedSubCategory = useSelector((state: any) => state.order.selectedSubCategory || []);
  const storedPickupDate = useSelector((state: any) => state.order.pickupDate || '');
  const storedPickupTime = useSelector((state: any) => state.order.pickupTime || '');
  const storedPickupAddress = useSelector((state: any) => state.order.pickupAddress || {
    formattedAddress: '',
    latitude: null,
    longitude: null
  });

  console.log("selectedScrapCategoryWithSubCategory", selectedScrapCategoryWithSubCategory);
  console.log("\n\nselectedCategory", selectedCategory);
  console.log("selectedSubCategory", selectedSubCategory);

  const mapRef = useRef<MapView | null>(null);

  const [pickupDate, setPickupDateState] = useState<string>(storedPickupDate);
  const [pickupDateISO, setPickupDateISO] = useState<string>(storedPickupDate);
  const [pickupTime, setPickupTimeState] = useState<string>(storedPickupTime);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddressState] = useState<string>(storedPickupAddress.formattedAddress);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  // Time slots
  const timeSlots = [
    "Select Time",
    "7 AM - 9 AM",
    "9 AM - 11 AM",
    "11 AM - 1 PM",
    "1 PM - 3 PM",
    "3 PM - 5 PM"
  ];

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: storedPickupAddress.latitude || 27.6915,
    longitude: storedPickupAddress.longitude || 85.3420,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  // Get today's date in YYYY-MM-DD format for calendar
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  // Check if form is complete
  const isFormComplete = () => {
    return pickupDate.trim() !== '' &&
      selectedAddress.trim() !== '' &&
      pickupTime !== '' &&
      pickupTime !== 'Select Time';
  };

  // Handle date selection
  const handleDateSelect = (date: any) => {
    // Store the original YYYY-MM-DD format for backend
    setPickupDateISO(date.dateString);

    // Convert from YYYY-MM-DD to DD/MM/YYYY for display only
    const parts = date.dateString.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    setPickupDateState(formattedDate);
    setShowCalendar(false);
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setPickupTimeState(time);
    setShowTimeDropdown(false);
  };

  // Format selected date for the calendar's markedDates prop
  const getMarkedDates = () => {
    if (!pickupDate) return {};

    // Convert from DD/MM/YYYY to YYYY-MM-DD
    let calendarFormat = '';
    if (pickupDateISO) {
      calendarFormat = pickupDateISO;
    } else if (pickupDate) {
      const parts = pickupDate.split('/');
      calendarFormat = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return {
      [calendarFormat]: { selected: true, selectedColor: '#22c55e' }
    };
  };

  // Handle current location retrieval
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "We need location permissions to set your current location.",
          [{ text: "OK" }]
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Update location state with increased zoom
      const newLocation = {
        latitude,
        longitude,
        latitudeDelta: 0.002, // Increased zoom level
        longitudeDelta: 0.002, // Increased zoom level
      };

      setSelectedLocation(newLocation);

      // Animate map to new location
      mapRef.current?.animateToRegion(newLocation, 500);

      // Get address details using reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        { headers: { 'User-Agent': 'YourApp/1.0' } }
      );
      const data = await response.json();

      if (data && data.display_name) {
        setSearchQuery(data.display_name);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        "Location Error",
        "Unable to retrieve your current location. Please check your device settings.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    ; (async () => {
      await getCurrentLocation();
    })();
  }, []);

  // Handle map marker drag
  const handleMarkerDrag = async (e: any) => {
    const newCoordinates = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };

    setSelectedLocation({
      ...selectedLocation,
      ...newCoordinates
    });

    try {
      setSearchQuery('Getting address...');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newCoordinates.latitude}&lon=${newCoordinates.longitude}&addressdetails=1`,
        { headers: { 'User-Agent': 'YourApp/1.0' } } // Nominatim requires a user agent
      );
      const data = await response.json();

      if (data && data.display_name) {
        console.log(data.display_name);
        setSearchQuery(data.display_name);
      } else {
        // Fallback if geocoding fails
        console.log(data);
        setSearchQuery(`Latitude: ${newCoordinates.latitude.toFixed(6)}, Longitude: ${newCoordinates.longitude.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      // Fallback if request fails
      setSearchQuery(`Latitude: ${newCoordinates.latitude.toFixed(6)}, Longitude: ${newCoordinates.longitude.toFixed(6)}`);
    }
  };

  // Handle confirming location from map
  const handleConfirmLocation = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.latitude}&lon=${selectedLocation.longitude}&addressdetails=1`,
        { headers: { 'User-Agent': 'YourApp/1.0' } } // Nominatim requires a user agent
      );
      const data = await response.json();

      let formattedAddress = '';
      if (data && data.display_name) {
        formattedAddress = data.display_name;
        setSelectedAddressState(formattedAddress);
      } else {
        // Fallback if geocoding fails
        console.log(data);
        formattedAddress = `Latitude: ${selectedLocation.latitude.toFixed(6)}, Longitude: ${selectedLocation.longitude.toFixed(6)}`;
        setSelectedAddressState(formattedAddress);
      }
      setShowMap(false);
    } catch (error) {
      console.error('Error getting address:', error);
      // Fallback if request fails
      const formattedAddress = `Latitude: ${selectedLocation.latitude.toFixed(6)}, Longitude: ${selectedLocation.longitude.toFixed(6)}`;
      setSelectedAddressState(formattedAddress);
      setShowMap(false);
    }
  };

  // Handle location search
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      // Use Nominatim for geocoding (search)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
        { headers: { 'User-Agent': 'YourApp/1.0' } }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        };

        setSelectedLocation(location);

        // Move map to the location
        mapRef.current?.animateToRegion(location, 500);
      } else {
        Alert.alert("Location not found", "please search exact location or nearby landmark");
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleNextPress = () => {
    dispatch(setPickupDate(pickupDateISO || convertDisplayDateToISO(pickupDate)));

    dispatch(setPickupTime(pickupTime));

    dispatch(setPickupAddress({
      formattedAddress: selectedAddress,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude
    }));
  };

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD if needed
  const convertDisplayDateToISO = (displayDate: string): string => {
    if (!displayDate) return '';
    const parts = displayDate.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {/* Date Picker Section */}
        <View className="mb-6">
          <Text className="text-base font-medium mb-2">Pick-Up Date</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
            onPress={() => setShowCalendar(true)}
          >
            <Text className={pickupDate ? "text-black" : "text-gray-400"}>
              {pickupDate || 'DD/MM/YYYY'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Time Picker Section */}
        <View className="mb-6">
          <Text className="text-base font-medium mb-2">Pick-Up Time</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
            onPress={() => setShowTimeDropdown(true)}
          >
            <Text className={pickupTime && pickupTime !== 'Select Time' ? "text-black" : "text-gray-400"}>
              {pickupTime || 'Select Time'}
            </Text>
            <Ionicons name="time-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Location Section */}
        <View className="mb-6">
          <Text className="text-base font-medium mb-2">Pick-Up Location</Text>

          {selectedAddress ? (
            <View className="border border-gray-300 rounded-md p-3 mb-4">
              <Text className="font-medium">Selected Location</Text>
              <Text className="text-gray-600 text-sm mt-1">{selectedAddress}</Text>

              <TouchableOpacity
                className="mt-2 flex-row items-center"
                onPress={() => setShowMap(true)}
              >
                <Ionicons name="location" size={16} color="#22c55e" />
                <Text className="text-green-500 ml-1">Change Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
              onPress={() => setShowMap(true)}
            >
              <Text className="text-gray-400">Select location from map</Text>
              <Ionicons name="location-outline" size={20} color="gray" />
            </TouchableOpacity>
          )}

          {/* Add Address Button */}
          <View className="items-center">
            <TouchableOpacity
              className="w-10 h-10 rounded-full border border-gray-300 border-dashed items-center justify-center"
              onPress={() => setShowMap(true)}
            >
              <Ionicons name="add" size={24} color="gray" />
            </TouchableOpacity>
            <Text className="text-center text-gray-500 text-sm mt-1">Add Address</Text>
          </View>
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 max-w-md bg-white rounded-xl p-4 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Calendar
              minDate={formattedToday}
              markedDates={getMarkedDates()}
              onDayPress={handleDateSelect}
              theme={{
                todayTextColor: '#22c55e',
                selectedDayBackgroundColor: '#22c55e',
                arrowColor: '#22c55e',
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Time Dropdown Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTimeDropdown}
        onRequestClose={() => setShowTimeDropdown(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 max-w-md bg-white rounded-xl overflow-hidden shadow-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-bold">Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimeDropdown(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={timeSlots.slice(1)} // Skip "Select Time" as it's just a placeholder
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-gray-100 ${pickupTime === item ? 'bg-green-50' : ''}`}
                  onPress={() => handleTimeSelect(item)}
                >
                  <Text className={`${pickupTime === item ? 'text-green-600 font-medium' : 'text-gray-800'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Map Modal*/}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showMap}
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.mapModalContainer}>
          {/* Header */}
          <View style={styles.mapHeader}>
            <View style={styles.mapHeaderRow}>
              <TouchableOpacity onPress={() => setShowMap(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.mapTitle}>Select Location</Text>
              <TouchableOpacity onPress={handleConfirmLocation}>
                <Text style={styles.confirmButton}>Confirm</Text>
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a location"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchLocation}
              >
                <Ionicons name="search" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Current Location Button */}
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
            >
              <Ionicons name="locate" size={16} color="#22c55e" />
              <Text style={styles.currentLocationText}>
                {isLoadingLocation ? "Getting location..." : "Use Current Location"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map */}
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.map}
            initialRegion={selectedLocation}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              draggable
              onDragEnd={handleMarkerDrag}
              pinColor="#22c55e"
            />
          </MapView>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>Drag the pin to your exact location</Text>
          </View>
        </View>
      </Modal>

      {/* Next button */}
      <View className="p-7 z-10">
        <NextButton
          isFormComplete={isFormComplete()}
          nextRoute="/upload-scrapImages"
          onPress={handleNextPress}
        />
      </View>
    </View>
  );
}

// StyleSheet for MapView and all map-related components 
const styles = StyleSheet.create({
  mapModalContainer: {
    flex: 1,
  },
  mapHeader: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    color: '#22c55e',
    fontWeight: '500',
  },
  searchContainer: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRightWidth: 0,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    padding: 8,
    width: '100%',
    height: 45,
  },
  searchButton: {
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    paddingHorizontal: 12,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    backgroundColor: '#f9fafb',
  },
  currentLocationText: {
    marginLeft: 8,
    color: '#22c55e',
    fontWeight: '500',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  instructionsText: {
    textAlign: 'center',
  },
});