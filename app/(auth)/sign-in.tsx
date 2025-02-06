import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link } from 'expo-router'
import authService from '@/services/auth'

const SignIn = () => {

  const [form, setForm] = useState({
    identifier: '',
    password: ''
  })
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

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

      const response = await authService.login(form);

      if (response.statusCode === 200) {
        console.log("sucess", response)
        if (response.data.user) {
          Alert.alert('Success', 'user Login successful')
        } else if (response.data.collector) {
          Alert.alert('Success', 'collector Login successful')
        }
      } else {
        Alert.alert('Error', response.message)
      }

    } catch (error: any) {
      Alert.alert('Error', error?.message)
    }


  }

  return (
    <ScrollView className='flex-1 bg-secondary'>
      <View className='flex-1 bg-secondary'>

        <View >
          <Image source={images.logo} resizeMode='cover' className='w-52 h-52 rounded-full self-center' />
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



          <CustomButton
            title='Login'
            onPress={onSignUpPress}
            className='mt-6'
          />

          <Link
            href="/sign-up"
            className='text-lg text-center text-textcolor-300 mt-4'
          >
            Don't have an account?{' '}
            <Text className='text-primary'> Sign Up</Text>
          </Link>

        </View>




      </View>
    </ScrollView>
  )
}

export default SignIn