import { View, Text, ScrollView, Image, Alert, Switch } from 'react-native'
import React, { useState } from 'react'
import { icons, images, USER_ROLE } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import userAuthService from '@/services/user/auth'
import { setRole, setTokens } from '@/services/token/tokenService'
import { useDispatch, useSelector } from "react-redux"
import { login as authLogin } from '@/contexts/features/auth/authSlice'
import ModeToggle from '@/components/ModeToggle'
import collectorAuthService from '@/services/collector/collectorAuth'


const SignIn = () => {

  const userMode = useSelector((state: any) => state.auth.userMode)

  const [form, setForm] = useState({
    identifier: '',
    password: ''
  })
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const onSignUpPress = async () => {
    let newErrors: { identifier?: string; password?: string } = {};

    if (!form.identifier.trim()) {
      newErrors.identifier = "Email is required";
    }
    if (!form.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      let response: any = null;
      if (userMode === USER_ROLE.USER) {
        response = await userAuthService.login(form);
      }
      else if (userMode === USER_ROLE.COLLECTOR) {
        response = await collectorAuthService.login(form);

      } else {
        Alert.alert('Error', 'User mode not found')
      }

      if (!response.success) {
        Alert.alert('Error', response.message)
        return
      }

      if (response.success) {
        console.log(response.data.refreshToken, "refreshToken from login")
        await setTokens(response.data.accessToken, response.data.refreshToken);
        await setRole(response.data.user.role);

        let userDataResponse = null
        if (userMode === USER_ROLE.USER) {
          userDataResponse = await userAuthService.getCurrentUser();
        }
        else if (userMode === USER_ROLE.COLLECTOR) {
          userDataResponse = await collectorAuthService.getCurrentUser();
        } else {
          Alert.alert('Error', 'User mode not found')
        }


        if (userDataResponse.success) {
          console.log(userDataResponse.data, "userDataResponse")
          console.log(userDataResponse.data.role, "userDataResponse role")
          dispatch(authLogin({ userData: userDataResponse.data }))
          if (userDataResponse.data.role === USER_ROLE.USER) {
            router.replace('/(user)/(tabs)/home')

          } else if (userDataResponse.data.role === USER_ROLE.COLLECTOR) {
            router.replace('/(collector)/(tabs)/home')

          } else {
            Alert.alert('Error', 'Aunauthorized user role')
          }

        } else {
          Alert.alert('Error', userDataResponse.message)
        }

      }



    } catch (error: any) {
      Alert.alert('Error', error?.message)
    } finally {
      setLoading(false);
    }


  }

  return (
    <ScrollView className='flex-1 bg-secondary'>
      <View className='flex-1 bg-secondary'>

        <View >
          <Image source={userMode === "user" ? images.logo : images.collector} resizeMode='cover' className='w-52 h-52 rounded-full self-center' />
          <Text className='text-2xl ml-1
           text-textcolor-500 font-JakartaSemiBold'>
            Welcome Back
          </Text>
        </View>

        <View className='p-5' >

          <InputField
            label='Email or Phone'
            placeholder='Email or phone number'
            icon={icons.email}
            value={form.identifier}
            textContentType='emailAddress'
            onChangeText={(text) => {
              setForm({ ...form, identifier: text })
              setErrors({ ...errors, identifier: '' })
            }}
            error={errors.identifier}
          />

          <InputField
            label='Password'
            placeholder='Enter your password'
            icon={icons.lock}
            value={form.password}
            secureTextEntry
            textContentType='password'
            onChangeText={(text) => {
              setForm({ ...form, password: text })
              setErrors({ ...errors, password: '' })
            }}
            error={errors.password}
          />

          <View className='flex-row items-center justify-between'>


            <ModeToggle />


            <Link
              href="/forgot-password"
              className='text-lg text-right text-primary'
            >
              Forgot Password?
            </Link>
          </View>

          <CustomButton
            title='Login'
            onPress={onSignUpPress}
            className='mt-6'
            loading={loading}
          />

          <Link
            href="/sign-up"
            className='text-lg text-center text-textcolor-300 mt-4'
          >
            Don't have an account?{' '}
            <Text className='text-primary'> Sign Up</Text>
          </Link>

        </View>


        <Text className='text-lg text-center text-primary'>
          {userMode || "guest"}
        </Text>




      </View>
    </ScrollView >
  )
}

export default SignIn