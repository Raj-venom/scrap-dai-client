import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'

const SignUp = () => {

  const router = useRouter()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  })

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
  }>({});
  const onSignUpPress = async () => {

    let newErrors: { fullName?: string; email?: string; password?: string; phone?: string } = {};

    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    console.log('newErrors', newErrors)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form Data', form)
  }

  return (
    <ScrollView className='flex-1 bg-secondary'>
      <View className='flex-1 bg-secondary'>

        <View >
          <Image source={images.logo} resizeMode='cover' className='w-52 h-52 rounded-full self-center' />
          <Text className='text-2xl ml-1
           text-textcolor-500 font-JakartaSemiBold'>
            Create Your Account
          </Text>
        </View>
      </View>

      <View className='p-5' >
        <InputField
          label='Name'
          placeholder='Enter your name'
          icon={icons.person}
          value={form.fullName}
          onChangeText={(text) => {
            setForm({ ...form, fullName: text })
            setErrors({ ...errors, fullName: '' })
          }}
          error={errors.fullName}
        />

        <InputField
          label='Email'
          placeholder='Enter your email'
          icon={icons.email}
          value={form.email}
          textContentType='emailAddress'
          keyboardType='email-address'
          onChangeText={(text) => {
            setForm({ ...form, email: text })
            setErrors({ ...errors, email: '' })
          }}
          error={errors.email}
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

        <InputField
          label='Phone'
          placeholder='Enter your phone number'
          icon={icons.star}
          value={form.phone}
          keyboardType='phone-pad'
          onChangeText={(text) => {
            setForm({ ...form, phone: text })
            setErrors({ ...errors, phone: '' })
          }}
          error={errors.phone}
        />

        <CustomButton
          title='Sign Up'
          onPress={onSignUpPress}
          className='mt-6'
        />

        <Link
          href="/sign-in"
          className='text-lg text-center text-textcolor-300 mt-4'
        >
          Already have an account? {' '}
          <Text className='text-primary'> Sign In</Text>
        </Link>

      </View>
    </ScrollView>
  )
}

export default SignUp