import { View, Text } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '@/components/CustomButton'

const index = () => {

    const authStatus = useSelector((state: any) => state.auth.status)
    const userData = useSelector((state: any) => state.auth.userData)
    const dispatch = useDispatch()
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
                onPress={() => dispatch({ type: 'auth/logout' })}
            />
        </View>
    )
}

export default index