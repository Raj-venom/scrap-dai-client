import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import userAuthService from '@/services/user/auth'
import { ReactNativeModal } from "react-native-modal"
import collectorAuthService from '@/services/collector/collectorAuth'

// Define constants and types
enum USER_ROLE {
  USER = 'user',
  COLLECTOR = 'collector'
}

interface FormState {
  email: string;
  otp: string;
  password: string;
}

interface ErrorState {
  email: string;
  otp: string;
  password: string;
}

interface UserModeState {
  auth: {
    userMode: USER_ROLE;
  }
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data?: any;
}

const ForgotPassword = () => {
  const router = useRouter()
  const userMode = useSelector((state: UserModeState) => state.auth.userMode)

  const [step, setStep] = useState<'email' | 'resetPassword'>('email')

  const [form, setForm] = useState<FormState>({
    email: '',
    otp: '',
    password: ''
  })

  const [errors, setErrors] = useState<ErrorState>({
    email: '',
    otp: '',
    password: ''
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)


  const getLogo = () => {
    return userMode === USER_ROLE.USER ? images.logo : images.collector
  }

  const handleRequestPasswordReset = async () => {

    if (!form.email.trim()) {
      setErrors({ ...errors, email: 'Email is required' })
      return
    }

    try {

      let response: ApiResponse | null = null;

      if (userMode === USER_ROLE.USER) {
        response = await userAuthService.forgotPassword({ email: form.email })
      } else if (userMode === USER_ROLE.COLLECTOR) {
        response = await collectorAuthService.forgotPassword({ email: form.email })
      } else {
        Alert.alert('Error', 'User mode not found')
        return
      }

      if (response && response.statusCode === 200) {
        console.log("Reset request success", response)
        setStep('resetPassword')
      } else {
        console.log("Reset request failed", response)
        Alert.alert('Error', response?.message || 'Failed to request password reset')
      }
    } catch (error: any) {
      console.log('Request password reset error:', error)
      Alert.alert('Error', error?.message || 'Failed to request password reset')
    }
  }

  const handleResetPassword = async () => {

    let newErrors: Partial<ErrorState> = {}

    if (!form.otp.trim()) {
      newErrors.otp = 'Verification code is required'
    }

    if (!form.password.trim()) {
      newErrors.password = 'New password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors })
      return
    }

    try {

      let response: ApiResponse | null = null;

      if (userMode === USER_ROLE.USER) {
        response = await userAuthService.resetPassword({
          email: form.email,
          otp: form.otp,
          password: form.password
        })
      } else if (userMode === USER_ROLE.COLLECTOR) {
        response = await collectorAuthService.resetPassword({
          email: form.email,
          otp: form.otp,
          password: form.password
        })
      } else {
        Alert.alert('Error', 'User mode not found')
        return
      }

      if (response && response.statusCode === 200) {
        console.log("Password reset success", response)
        setShowSuccessModal(true)
      } else {
        console.log("Password reset failed", response)
        Alert.alert('Error', response?.message || 'Failed to reset password')
      }
    } catch (error: any) {
      console.log('Password reset error:', error)
      Alert.alert('Error', error?.message || 'Failed to reset password')
    }
  }

  const renderEmailStep = () => (
    <View className='p-5'>
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

      <CustomButton
        title='Request Reset'
        onPress={handleRequestPasswordReset}
        className='mt-6'
      />

      <Link
        href="/sign-in"
        className='text-lg text-center text-textcolor-300 mt-4'
      >
        Remember your password? {' '}
        <Text className='text-primary'>Sign In</Text>
      </Link>
    </View>
  )

  const renderResetPasswordStep = () => (
    <View className='p-5'>
      <Text className='font-Jakarta mb-5'>
        We've sent a verification code to <Text className='font-JakartaBold'>{form.email}</Text>
      </Text>

      <InputField
        label='Verification Code'
        placeholder='Enter verification code'
        icon={icons.lock}
        value={form.otp}
        keyboardType='numeric'
        onChangeText={(text) => {
          setForm({ ...form, otp: text })
          setErrors({ ...errors, otp: '' })
        }}
        error={errors.otp}
      />

      <InputField
        label='New Password'
        placeholder='Enter your new password'
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
        title='Reset Password'
        onPress={handleResetPassword}
        className='mt-6'
      />
    </View>
  )

  const getTitle = () => {
    const roleText = userMode === USER_ROLE.USER ? 'User' : 'Collector'

    if (step === 'email') return `${roleText} Password Reset`
    return 'Reset Your Password'
  }

  return (
    <ScrollView className='flex-1 bg-secondary'>
      <View className='flex-1 bg-secondary'>
        <View>
          <Image
            source={getLogo()}
            resizeMode='cover'
            className='w-52 h-52 rounded-full self-center'
          />
          <Text className='text-2xl ml-1 text-textcolor-500 font-JakartaSemiBold'>
            {getTitle()}
          </Text>
        </View>

        {step === 'email' && renderEmailStep()}
        {step === 'resetPassword' && renderResetPasswordStep()}

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className='text-3xl font-JakartaBold text-center'>
              Success
            </Text>
            <Text
              className='text-base text-gray-400 font-Jakarta text-center mt-2'
            >
              Your password has been successfully reset.
            </Text>
            <CustomButton
              title='Sign In'
              onPress={() => router.replace('/(auth)/sign-in')}
              className='mt-5'
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  )
}

export default ForgotPassword