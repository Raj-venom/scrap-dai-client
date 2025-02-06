import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import authService from '@/services/auth'
import { ReactNativeModal } from "react-native-modal";

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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verification, setVerification] = useState<{
    state: "default" | "success" | "failed" | "pending",
    error: string,
    code: string,
  }>({
    state: "default",
    error: "",
    code: "",
  });


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

    try {
      const response = await authService.createAccount(form)

      if (response.statusCode === 201) {
        console.log("sucess", response)
        setVerification({ ...verification, state: "pending" })
      } else {
        console.log("failed", response)
        Alert.alert('Error', response.message)
        return
      }


    } catch (error: any) {
      console.log('error', error)
      Alert.alert('Error', error?.message)

    }


    console.log('Form Data', form)
  }

  const onVerifyPress = async () => {
    try {
      const response = await authService.verifyUser({
        email: form.email,
        otp: verification.code
      })


      if (response.statusCode === 200) {
        console.log("sucess verify", response)
        setVerification({ ...verification, state: "success" })
      } else {
        console.log("failed verify", response)
        setVerification({ ...verification, state: "failed", error: response.message })
      }

    } catch (error: any) {
      console.log('signup errror:;', error)
      setVerification({ ...verification, state: "failed", error: error?.message || "Something went wrong" })
      // Alert.alert('Error', error?.message)
    }
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

        <ReactNativeModal
          isVisible={verification.state === "pending" || verification.state === "failed"}

          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true)
            }
          }}

        >
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]' >
            <Text className='font-JakartaBold text-2xl mb-2'>
              Verification
            </Text>

            <Text className='font-Jakarta mb-5' >
              We've send a verification code to <Text className='font-JakartaBold'>{form.email}</Text>
            </Text>

            <InputField
              label='Verification Code'
              icon={icons.lock}
              placeholder='123456'
              value={verification.code}
              keyboardType='numeric'
              onChangeText={(text) => setVerification({ ...verification, code: text })}
            />

            {verification.error && (
              <Text className='text-red-500 text-sm mt-1' >
                {verification.error}
              </Text>
            )}

            <CustomButton
              title='Verify Email'
              className='mt-5 bg-success-500'
              onPress={onVerifyPress}
            />

          </View>

        </ReactNativeModal>



        <ReactNativeModal isVisible={showSuccessModal} >
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]' >
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className='text-3xl font-JakartaBold text-center'>
              Verified
            </Text>
            <Text
              className='text-base text-gray-400 font-Jakarta text-center mt-2'
            >
              Your account has been successfully verified.
            </Text>
            <CustomButton
              title='Browse Home'
              onPress={() => router.replace(`/(auth)/sign-in`)}
              className='mt-5'
            />
          </View>
        </ReactNativeModal>



      </View>
    </ScrollView>
  )
}

export default SignUp