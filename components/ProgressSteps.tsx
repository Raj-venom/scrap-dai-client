import React from 'react';
import { View, Text } from 'react-native';

interface ProgressStepsProps {
    currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps): JSX.Element {
    const steps = [
        { id: 1, label: 'Select material' },
        { id: 2, label: 'Select category' },
        { id: 3, label: 'Date and Location' },
        { id: 4, label: 'Scrap Images' },
        { id: 5, label: 'Confirm Order' },
    ];

    return (
        <View className="pt-3 px-4 bg-white border-t border-gray-200">
            <View className="flex-row items-center justify-between relative">
                {/* Connecting Line */}
                <View className="absolute top-3 left-5 right-5 h-0.5 bg-gray-200" />

                {/* Steps */}
                {steps.map((step) => (
                    <View key={step.id} className="items-center z-10">
                        <View
                            className={`h-6 w-6 rounded-full items-center justify-center ${step.id < currentStep
                                ? 'bg-green-500'
                                : step.id === currentStep
                                    ? 'bg-green-500'
                                    : 'bg-white border border-gray-300'
                                }`}
                        >
                            {step.id < currentStep ? (
                                <Text className="text-white text-xs font-medium">✓</Text>
                            ) : (
                                <Text
                                    className={`text-xs font-medium ${step.id === currentStep ? 'text-white' : 'text-gray-400'}`}
                                >
                                    {step.id}
                                </Text>
                            )}
                        </View>
                        <Text
                            className={`text-xs mt-1 text-center max-w-16 ${step.id <= currentStep ? 'text-gray-800 font-medium' : 'text-gray-400'}`}
                        >
                            {step.label}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}