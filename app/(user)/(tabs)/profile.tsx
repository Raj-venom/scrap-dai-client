import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import userAuthService from '@/services/user/auth';
import { logout } from '@/contexts/features/auth/authSlice';
import { UserStats } from '@/types/type';
import dashboardService from '@/services/dashboard/dashboardService';

export default function Profile(): JSX.Element {
  const dispatch = useDispatch()

  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    try {
      ; (async () => {
        const response = await dashboardService.getUserStats();
        setUserStats(response.data);
      }
      )();

    } catch (error: any) {
      console.log('HomeScreen :: error', error)

    } finally {
      setLoading(false)
    }
  }, []);


  const logoutCall = async () => {

    try {
      const response = await userAuthService.logout()
      console.log(response)
      if (response.success) {
        dispatch(logout())
        router.replace('/(auth)/sign-in')
      } else {
        {
          Alert.alert('Error', response.message)
        }

      }
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Failed to logout. Please try again.')

    }
  }


  // Function to handle logout
  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: logoutCall
        }
      ]
    );
  };

  // Menu item component
  const MenuItem = ({ icon, title, onPress, showArrow = true, rightComponent = null }: {
    icon: any,
    title: string,
    onPress: () => void,
    showArrow?: boolean,
    rightComponent?: JSX.Element | null
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 border-b border-gray-100"
      onPress={onPress}
    >
      <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#16a34a" />
      </View>
      <Text className="flex-1 text-base">{title}</Text>
      {rightComponent || (showArrow && <Ionicons name="chevron-forward" size={18} color="gray" />)}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* Profile Header */}
        <View className="pt-12 pb-6 px-4 bg-primary">
          <Text className="text-2xl font-bold text-white text-center mb-6">Profile</Text>

          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3">
              <Image
                source={{ uri: userStats?.user.avatar }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            </View>
            <Text className="text-xl font-bold text-white">{userStats?.user.fullName}</Text>
            <Text className="text-white opacity-80">{userStats?.user.email}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View className="flex-row px-4 py-4 bg-white shadow-sm">
          <View className="flex-1 items-center border-r border-gray-200">
            <Text className="text-gray-500">Total Recycled</Text>
            <Text className="text-lg font-bold text-green-600">{userStats?.totalWeight} kg</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-gray-500">Total Earnings</Text>
            <Text className="text-lg font-bold text-green-600">रु {userStats?.totalEarnings}</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold mb-2">Account</Text>

          <MenuItem
            icon="person-outline"
            title="Personal Information"
            // onPress={() => router.push('/personal-info')}
            onPress={() => console.log('Personal Information')}
          />

          <MenuItem
            icon="location-outline"
            title="My Addresses"
            // onPress={() => router.push('/addresses')}
            onPress={() => console.log('Personal Information')}
          />
        </View>

        <View className="px-4 pb-4">
          <Text className="text-lg font-bold mb-2">Support</Text>

          <MenuItem
            icon="help-circle-outline"
            title="Help Center"
            // onPress={() => router.push('/help')}
            onPress={() => console.log('Personal Information')}
          />

          <MenuItem
            icon="chatbubble-outline"
            title="Contact Us"
            // onPress={() => router.push('/contact')}
            onPress={() => console.log('Personal Information')}
          />

          <MenuItem
            icon="star-outline"
            title="Rate Us"
            // if ok is pressed, open play store page for rating of pubg app
            onPress={() => Alert.alert("Rate Us", "This would open the app store rating page", [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "OK", onPress: () => router.push('https://play.google.com/store/apps/details?id=com.pubg.imobile')
              }
            ])}
          />
        </View>

        <View className="px-4 pb-24">
          <Text className="text-lg font-bold mb-2">Other</Text>

          <MenuItem
            icon="document-text-outline"
            title="Terms & Conditions"
            // onPress={() => router.push('/terms')}
            onPress={() => console.log('Personal Information')}
          />

          <MenuItem
            icon="shield-outline"
            title="Privacy Policy"
            // onPress={() => router.push('/privacy')}
            onPress={() => console.log('Personal Information')}
          />

          <MenuItem
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>

    </View>
  );
}