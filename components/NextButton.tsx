import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

interface NextButtonProps {
    isFormComplete: boolean;
    nextRoute: string;
    onPress: () => void;
}

export default function NextButton({ isFormComplete, nextRoute, onPress }: NextButtonProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            className={`${isFormComplete ? 'bg-green-600' : 'bg-green-300'} h-14 w-14 rounded-full items-center justify-center self-end`}
            // onPress={() => isFormComplete && router.push(nextRoute as any || '/')}
            onPress={() => {
                if (isFormComplete) {
                    onPress()
                    router.push(nextRoute as any || '/')
                }
            }}
            disabled={!isFormComplete}
        >
            <Ionicons name="arrow-forward" size={28} color="white" />
        </TouchableOpacity>
    );
}