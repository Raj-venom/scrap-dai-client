import { View, Text, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { InputFieldProps } from '@/types/type'

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
                            secureTextEntry={secureTextEntry}
                            {...props}
                        />
                    </View>
                    {error && <Text className="text-red-500 mt-1 ml-2">{error}</Text>}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default InputField