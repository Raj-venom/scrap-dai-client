import { View, Text, Alert } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '@/components/CustomButton'
import userAuthService from '@/services/user/auth'
import { logout } from '@/contexts/features/auth/authSlice'

const index = () => {

    const authStatus = useSelector((state: any) => state.auth.status)
    const userData = useSelector((state: any) => state.auth.userData)
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            const res = await userAuthService.logout()

            if (res.success) {

                dispatch(logout())
            } else {
                Alert.alert('Error', res.message)
            }

        } catch (error) {
            console.log('Error', error)
        }




    }

    return (
        <View>
            <Text>
                {
                    authStatus ? `Welcome ${userData?.name || ''}` : 'Welcome Guest'
                }
            </Text>

            {
                authStatus && (
                    <Text>
                        {/* // display all  */}
                        {JSON.stringify(userData)}

                    </Text>
                )
            }

            {
                authStatus && (
                    <Text>
                        {/* // display all using loop */}
                        {Object.keys(userData).map((key, index) => (
                            <Text key={index}>{key} : {userData[key]}</Text>
                        ))}
                    </Text>
                )
            }

            <CustomButton
                title="Logout"
                onPress={handleLogout}
            />
        </View>
    )
}

export default index