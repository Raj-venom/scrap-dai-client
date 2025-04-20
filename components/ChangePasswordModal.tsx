import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import InputField from './InputField';

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    visible,
    onClose,
    onSubmit
}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    const handleUpdate = async () => {
        // Validate passwords
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match');
            return;
        }

        // Password strength validation
        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(currentPassword, newPassword);
            resetFields();
        } catch (error) {
            console.log('Password Update Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white w-5/6 rounded-lg p-5">
                    <Text className="text-xl font-bold mb-4 text-center">Change Password</Text>

                    <InputField
                        placeholder='Enter current password'
                        secureTextEntry={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        label='Current Password'
                    />

                    <InputField
                        placeholder='Enter new password'
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        label='New Password'
                    />

                    <InputField
                        placeholder='Confirm new password'
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        label='Confirm New Password'
                    />

                    <View className="flex-row justify-end">
                        <TouchableOpacity
                            className="bg-gray-200 px-4 py-2 rounded-md mr-2"
                            onPress={handleClose}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-primary px-4 py-2 rounded-md"
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text className="text-white">Update</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ChangePasswordModal;