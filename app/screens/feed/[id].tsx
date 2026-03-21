import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { feeds } from '@/app/data/api';
import FeedItem from '@/components/home/FeedItem';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';

export default function SingleFeedScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await feeds.getFeedItem(id as string);

                // Map backend data to FeedItem props
                const data = res.data;
                const mappedItem = {
                    id: data._id,
                    type: data.feedType,
                    user: data.creatorId?.profile?.fullName || data.recruiter?.recruiterProfile?.companyName || 'Unknown User',
                    handle: '@user',
                    avatar: data.creatorId?.avatar || data.recruiter?.avatar || 'https://via.placeholder.com/150',
                    time: new Date(data.createdAt).toLocaleDateString(),
                    content: data.content || data.description || data.title,
                    jobRole: data.title,
                    salary: data.salaryRange ? `${data.salaryRange.currency}${data.salaryRange.min}-${data.salaryRange.max}` : undefined,
                    location: data.location || data.recruiter?.recruiterProfile?.location,
                    stats: {
                        comments: (data.comments?.length || 0).toString(),
                        reposts: '0',
                        likes: (data.likes?.length || 0).toString(),
                    },
                    attachments: data.images?.map((url: string) => ({ type: 'image', url })) || [],
                };

                if (data.feedType === 'reel') {
                    // If it's a reel, redirect to the vertical swiper for a better experience
                    router.replace({ pathname: "/screens/reels/[id]", params: { id: data._id } } as any);
                    return;
                }

                setItem(mappedItem);
            } catch (error) {
                console.error('Error fetching feed item', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View className="flex-row items-center p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 18, color: theme.text }}>Post</Text>
            </View>
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator color={theme.brand} />
                </View>
            ) : item ? (
                <FeedItem item={item} />
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text style={{ color: theme.text }}>Post not found.</Text>
                </View>
            )}
        </SafeAreaView>
    );
}
