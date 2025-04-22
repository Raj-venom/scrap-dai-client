import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Linking, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { logout } from '@/contexts/features/auth/authSlice';
import { CollectorStats } from '@/types/type';
import dashboardService from '@/services/dashboard/dashboardService';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import collectorAuthService from '@/services/collector/collectorAuth';

export default function Profile(): JSX.Element {
  const dispatch = useDispatch()

  const [collectorStats, setCollectorStats] = useState<CollectorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);


  useEffect(() => {
    loadCollectorStats();
  }, []);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCollectorStats();
    setRefreshing(false);
  }, []);

  const loadCollectorStats = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getCollectorStats();
      if (response.success) {
        setCollectorStats(response.data);
      }
      else {
        Alert.alert('Error', response.message || 'Failed to load user stats');
      }
      setCollectorStats(response.data);
    } catch (error: any) {
      console.log('HomeScreen :: error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await collectorAuthService.changePassword({
        oldPassword,
        newPassword
      });

      if (response.success) {
        Alert.alert('Success', 'Password changed successfully');
        setChangePasswordModalVisible(false);
      } else {
        Alert.alert('Error', response.message || 'Failed to change password');
      }
    } catch (error) {
      console.log('Change Password Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      throw error;
    }
  };

  const logoutCall = async () => {
    try {
      const response = await collectorAuthService.logout()
      console.log(response)
      if (response.success) {
        dispatch(logout())
        router.replace('/(auth)/sign-in')
      } else {
        Alert.alert('Error', response.message)
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Failed to logout. Please try again.')
    }
  }


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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#389936']} // Android
            tintColor="#389936" // iOS
          />
        }
      >
        {/* Profile Header */}
        <View className="pt-12 pb-6 px-4 bg-primary">
          <Text className="text-2xl font-bold text-white text-center mb-6">Scrapdai Profile</Text>

          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3">
              <Image
                source={{ uri: collectorStats?.collector?.avatar }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            </View>
            <Text className="text-xl font-bold text-white">{collectorStats?.collector?.fullName}</Text>
            <Text className="text-white opacity-80">{collectorStats?.collector?.email}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View className="flex-row px-4 py-4 bg-white shadow-sm">
          <View className="flex-1 items-center border-r border-gray-200">
            <Text className="text-gray-500">Total Recycled</Text>
            <Text className="text-lg font-bold text-green-600">{collectorStats?.totalWeight} kg</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-gray-500">Total Business</Text>
            <Text className="text-lg font-bold text-green-600">रु {collectorStats?.totalEarnings}</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold mb-2">Account</Text>

          <MenuItem
            icon="lock-closed-outline"
            title="Change Password"
            onPress={() => setChangePasswordModalVisible(true)}
          />
        </View>

        <View className="px-4 pb-4">
          <Text className="text-lg font-bold mb-2">Support</Text>

          <MenuItem
            icon="chatbubble-outline"
            title="Contact Us"
            onPress={() => Linking.openURL('tel:9823232323')}
          />

          <MenuItem
            icon="star-outline"
            title="Rate Us"
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
            onPress={() => router.push('/term-conditions')}
          />

          <MenuItem
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
        onSubmit={handleChangePassword}
      />
    </View>
  );
}