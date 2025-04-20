import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const TermAndConditions = () => {
    return (
        <ScrollView className="flex-1 bg-white px-5 py-6">
            <Text className="text-2xl font-bold text-green-700 mb-4">
                Terms and Conditions
            </Text>

            <Text className="text-lg font-semibold text-green-800 mt-4">
                1. Introduction
            </Text>
            <Text className="text-base text-gray-700 mt-2 leading-relaxed">
                Welcome to ScrapDai. By using our services, you agree to the following terms and conditions. Please read them carefully.
            </Text>

            <Text className="text-lg font-semibold text-green-800 mt-4">
                2. User Responsibilities
            </Text>
            <Text className="text-base text-gray-700 mt-2 leading-relaxed">
                You are responsible for providing accurate information, ensuring recyclables are clean and sorted, and following scheduled pickup times.
            </Text>

            <Text className="text-lg font-semibold text-green-800 mt-4">
                3. Scrap Collection
            </Text>
            <Text className="text-base text-gray-700 mt-2 leading-relaxed">
                Our collectors will verify the type and weight of recyclables. Pricing will be based on the current market rates, subject to change.
            </Text>

            <Text className="text-lg font-semibold text-green-800 mt-4">
                4. Payments
            </Text>
            <Text className="text-base text-gray-700 mt-2 leading-relaxed">
                Users will receive payments based on agreed rates after successful collection and verification of materials.
            </Text>

            <Text className="text-lg font-semibold text-green-800 mt-4">
                5. Account Suspension
            </Text>
            <Text className="text-base text-gray-700 mt-2 leading-relaxed">
                We reserve the right to suspend or terminate accounts involved in fraudulent or abusive activities.
            </Text>

            <Text className="text-lg font-semibold text-green-800 mt-4">
                6. Privacy Policy
            </Text>
            <Text className="text-base text-gray-700 mt-2 leading-relaxed">
                Your personal information is protected under our Privacy Policy. We do not share your data without consent, unless required by law.
            </Text>

            <Text className="text-lg font-semibold text-green-800 mt-4">
                7. Changes to Terms
            </Text>
            <Text className="text-base text-gray-700 mt-2 leading-relaxed">
                We may update these terms from time to time. Continued use of the app after changes implies acceptance of the revised terms.
            </Text>

            <Text className="text-sm text-gray-500 mt-6 text-center">
                Last updated: April 20, 2025
            </Text>
            <View className="h-10" />
        </ScrollView>
    );
};

export default TermAndConditions;
