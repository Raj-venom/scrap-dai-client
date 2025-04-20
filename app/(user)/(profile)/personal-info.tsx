import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import userAuthService from '@/services/user/auth';
import InputField from '@/components/InputField';
import { GENDER_OPTIONS } from '@/constants';
import { router } from 'expo-router';

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: string;
  avatar?: string;
  createdAt: string;
}

const PersonalInformationScreen = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, []);


  useEffect(() => {
    fetchUserData();
  }, []);


  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await userAuthService.getCurrentUser();
      if (res.success) {
        const user = res.data as UserData;
        console.log("User data:", user);
        if (user) {
          setUserData(user);
          setFullName(user.fullName || '');
          setPhone(user.phone || '');
          setGender(user.gender || '');
          setSelectedGender(user.gender || '');
          setProfileImage(user.avatar || "");
        }
      } else {
        Alert.alert('Error', res.message || 'Failed to fetch user data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);

        // If user is in edit mode and picks an image, upload it immediately
        if (isEditing) {
          await uploadProfileImage(imageUri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Error picking image:', error);
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-image.jpg',
      } as any);

      const response = await userAuthService.updateUserAvatar(formData);
      if (response.success) {
        Alert.alert('Success', 'Profile image updated successfully');
        setProfileImage(response.data.avatar);
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile image');
      }

    } catch (error: any) {
      Alert.alert('Error', 'Failed to upload profile image');
      console.error('Error uploading profile image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!fullName.trim()) {
        Alert.alert('Error', 'Full name is required');
        return;
      }

      if (phone && phone.trim().length !== 10) {
        Alert.alert('Error', 'Phone number must be 10 digits');
        return;
      }

      setUploading(true);

      const updateData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender: selectedGender.trim(),
      };

      const response = await userAuthService.updateUserProfile(updateData);
      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
        fetchUserData();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      Alert.alert('Error', errorMessage);
      console.error('Error updating profile:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFullName(userData?.fullName || '');
    setPhone(userData?.phone || '');
    setSelectedGender(userData?.gender || '');
    setIsEditing(false);
  };

  const selectGender = (gender: string) => {
    setSelectedGender(gender);
    setShowGenderOptions(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#389936" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#389936']} // Android
          tintColor="#389936" // iOS
        />
      }
    >
      <View className="pt-2 pb-4 px-4 bg-white shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="arrow-back" size={20} color="#389936" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Personal Information</Text>
          {!isEditing ? (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="p-2"
            >
              <Text className="text-[#389936] font-medium">Edit</Text>
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}
        </View>
      </View>

      <View className="items-center justify-center p-5 relative">
        <TouchableOpacity
          disabled={!isEditing}
          onPress={handleImagePick}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage || userData?.avatar }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-gray-200 justify-center items-center">
              <Ionicons name="person" size={60} color="#CCC" />
            </View>
          )}

          {isEditing && (
            <View className="absolute bottom-0 right-0 bg-[#389936] w-9 h-9 rounded-full justify-center items-center border-2 border-white">
              <Ionicons name="camera" size={20} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
        {uploading && <ActivityIndicator className="mt-2" color="#389936" />}
      </View>

      <View className="p-4 bg-white mx-4 my-2 rounded-lg shadow">
        <InputField
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          className="mb-4 bg-white"
          editable={isEditing}
          containerStyle={`${isEditing ? 'border-[#389936]' : 'border-[#DDD]'}`}
        />

        <InputField
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
          className="mb-4 bg-white"
          editable={isEditing}
          containerStyle={`${isEditing ? 'border-[#389936]' : 'border-[#DDD]'}`}
        />


        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Gender</Text>

          {isEditing ? (
            <TouchableOpacity
              className="flex-row justify-between items-center border border-gray-300 rounded p-3 bg-white"
              onPress={() => setShowGenderOptions(!showGenderOptions)}
            >
              <Text className="text-base text-gray-800">
                {selectedGender || 'Select Gender'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#555" />
            </TouchableOpacity>
          ) : (
            <Text className="text-base text-gray-800 py-3">{gender || 'Not specified'}</Text>
          )}

          {showGenderOptions && (
            <View className="mt-1 border border-gray-300 rounded bg-white">
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  className="p-3 border-b border-gray-100"
                  onPress={() => selectGender(option)}
                >
                  <Text className={`text-base ${selectedGender === option ? 'text-[#389936] font-bold' : 'text-gray-800'}`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {userData?.email && (
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-base text-gray-500">Email</Text>
            <Text className="text-base text-gray-800 font-medium">{userData.email}</Text>
          </View>
        )}

        {userData?.createdAt && (
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-base text-gray-500">Member Since</Text>
            <Text className="text-base text-gray-800 font-medium">
              {new Date(userData.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {isEditing && (
        <View className="flex-row justify-between px-4 my-5 space-x-4">
          <CustomButton
            title="Cancel"
            onPress={handleCancel}
            bgVariant="outline"
            textVariant="primary"
            className="flex-1"
          />

          <CustomButton
            title="Save"
            onPress={handleUpdateProfile}
            loading={uploading}
            className="flex-1"
          />
        </View>
      )}
    </ScrollView>
  );
};

export default PersonalInformationScreen;