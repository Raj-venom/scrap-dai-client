import { View, Text, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { InputFieldProps } from '@/types/type'
import { Ionicons } from "@expo/vector-icons";

const InputField = ({
    label,
    icon,
    secureTextEntry = false,
    labelStyle,
    containerStyle,
    inputStyle,
    iconStyle,
    className,
    error,
    ...props
}: InputFieldProps) => {

    const [focus, setFocus] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const isPasswordHidden = secureTextEntry && !passwordVisible

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View className='my-2 w-full'  >
                    <Text className={`text-lg ml-1 font-JakartaSemiBold mb-3 ${labelStyle}`} >
                        {label}
                    </Text>

                    <View
                        className={`flex flex-row items-center justify-center bg-neutral-100 rounded-full border relative border-neutral-100 ${focus ? "border-primary-500" : ""} ${containerStyle}`}
                    >
                        {icon && (
                            <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
                        )}

                        <TextInput
                            onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
                            secureTextEntry={isPasswordHidden}
                            {...props}
                        />

                        {secureTextEntry && (
                            <TouchableOpacity
                                onPress={togglePasswordVisibility}
                                className="pr-4"
                            >
                                <Ionicons
                                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    {error && <Text className="text-red-500 mt-1 ml-2">{error}</Text>}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default InputField