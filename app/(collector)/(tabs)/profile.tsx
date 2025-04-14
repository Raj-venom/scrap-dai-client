import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import collectorAuthService from '@/services/collector/collectorAuth'
import { useDispatch } from 'react-redux'
import { logout } from '@/contexts/features/auth/authSlice'
import { router } from 'expo-router'

const profile = () => {
  const dispatch = useDispatch()
  const logoutCall = async () => {

    try {
      const response = await collectorAuthService.logout()
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

  return (
    <View>
      <TouchableOpacity onPress={logoutCall}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default profile