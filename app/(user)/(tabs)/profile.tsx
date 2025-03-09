import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from 'react-redux';
import userAuthService from '@/services/user/auth';
import { logout } from '@/contexts/features/auth/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const profile = () => {
  const dispatch = useDispatch()

  const handleLogout = async () => {

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
  }
  return (
    <SafeAreaView className="bg-primary h-full" >
      <View>
        <TouchableOpacity className='flex-row justify-center items-center h-screen' onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="black" />
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default profile