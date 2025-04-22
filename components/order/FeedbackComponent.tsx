import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import feedbackService from '@/services/feedback/feedbackService';

interface FeedbackComponentProps {
    orderId: string;
    role: 'user' | 'collector';
    existingFeedback?: {
        userRating?: number;
        userReview?: string;
        collectorRating?: number;
        collectorReview?: string;
    };
    onFeedbackSubmitted?: () => void;
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({
    orderId,
    role,
    existingFeedback,
    onFeedbackSubmitted,
}) => {
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Initialize with existing feedback if available
    useEffect(() => {
        const checkExistingFeedback = async () => {
            try {
                if (!existingFeedback) {
                    // If no existing feedback prop was passed, fetch it
                    const response = await feedbackService.getFeedbackByOrderId(orderId);
                    console.log('API :: getFeedbackByOrderId :: response', response);
                    if (response?.data) {
                        existingFeedback = response.data;
                    }
                }

                if (existingFeedback) {
                    if (role === 'user' && existingFeedback.userRating) {
                        setRating(existingFeedback.userRating);
                        setReview(existingFeedback.userReview || '');
                        setIsFeedbackSubmitted(true);
                    } else if (role === 'collector' && existingFeedback.collectorRating) {
                        setRating(existingFeedback.collectorRating);
                        setReview(existingFeedback.collectorReview || '');
                        setIsFeedbackSubmitted(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkExistingFeedback();
    }, [orderId, role]);

    const handleSubmitFeedback = async () => {
        if (rating === 0) {
            setError('Please provide a rating');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {

            let response;
            if (role === 'user') {
                response = await feedbackService.upsertUserFeedback(orderId, {
                    userRating: rating,
                    userReview: review,
                });
            } else {
                response = await feedbackService.upsertCollectorFeedback(orderId, {
                    collectorRating: rating,
                    collectorReview: review,
                });
            }

            if (response?.success) {
                setIsFeedbackSubmitted(true);
                Alert.alert('Feedback Submitted', 'Thank you for your feedback!');
                if (onFeedbackSubmitted) {
                    onFeedbackSubmitted();
                }
            } else {
                setError(response?.message || 'Failed to submit feedback');
            }
        } catch (err) {
            setError('Failed to submit feedback. Please try again.');
            console.error('Feedback submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View className="mt-4 p-4 bg-gray-50 rounded-lg items-center justify-center">
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    }

    if (isFeedbackSubmitted) {
        return (
            <View className="mt-4 p-4 bg-gray-50 rounded-lg">
                <Text className="font-medium mb-2">Your Feedback:</Text>
                <View className="flex-row mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                            key={star}
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={24}
                            color="#FFD700"
                        />
                    ))}
                </View>
                {review ? (
                    <Text className="text-gray-600 mt-1">"{review}"</Text>
                ) : (
                    <Text className="text-gray-400 mt-1">No review provided</Text>
                )}
            </View>
        );
    }

    return (
        <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Text className="font-medium mb-2">Leave Feedback:</Text>

            {/* Star Rating */}
            <View className="flex-row mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={24}
                            color="#FFD700"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Optional Review */}
            <TextInput
                className="border border-gray-300 rounded p-2 mb-3 text-gray-700"
                placeholder="Optional: Write your review here..."
                placeholderTextColor="#9CA3AF"
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80 }}
            />

            {error ? (
                <Text className="text-red-500 mb-2 text-sm">{error}</Text>
            ) : null}

            <TouchableOpacity
                className="bg-green-500 py-2 px-4 rounded items-center"
                onPress={handleSubmitFeedback}
                disabled={isSubmitting}
                activeOpacity={0.7}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text className="text-white font-medium">Submit Feedback</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default FeedbackComponent;