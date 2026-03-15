import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform,
    RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';

// API & Components
import { user as userApi, User } from '@/app/data/api';
import RecruiterProfileSkeleton from '@/components/skeletons/RecruiterProfileSkeleton';

export default function ProfileDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState('About');
    const [profileData, setProfileData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchUser = async (isRefreshing = false) => {
        try {
            if (isRefreshing) setRefreshing(true);
            else setLoading(true);

            const res = await userApi.getMe();

            if (res.success) {
                setProfileData(res.user);
                setError('');
            } else {
                setError('Failed to load profile');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const onRefresh = useCallback(() => {
        fetchUser(true);
    }, [id]);

    if (loading || refreshing) {
        return <RecruiterProfileSkeleton />;
    }

    if (error || !profileData) {
        return (
            <View className="flex-1 justify-center items-center px-10" style={{ backgroundColor: theme.background }}>
                <Text className="text-center mb-4" style={{ color: theme.text, fontFamily: 'Outfit-Medium' }}>
                    {error || 'Profile not found'}
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="px-8 py-3 rounded-full"
                    style={{ backgroundColor: theme.brand }}
                >
                    <Text className="text-white font-bold" style={{ fontFamily: 'Outfit-Bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isRecruiter = profileData.role === 'recruiter';
    const profileImage = profileData.profile?.resumeUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <StatusBar style="light" />

            {/* Header Overlay */}
            <View
                className="absolute z-50 w-full flex-row justify-between px-5"
                style={{ top: Platform.OS === 'ios' ? hp('6%') : hp('4%') }}
            >
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                    <Ionicons name="arrow-back" size={wp('5.5%')} color="#fff" />
                </TouchableOpacity>
                <View className="flex-row gap-x-3">
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                        <Feather name="search" size={wp('5%')} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                        <Ionicons name="ellipsis-horizontal" size={wp('5%')} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.brand} // Dark Green or Brand color
                        colors={[theme.brand]}
                    />
                }
            >
                {/* Section 1: Profile Top */}
                <View style={{ backgroundColor: theme.background }}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000' }}
                        className="w-full"
                        style={{ height: hp('22%') }}
                    />
                    <View className="flex-row justify-between items-end px-4 -mt-12">
                        <View className="p-1 rounded-3xl" style={{ backgroundColor: theme.background }}>
                            <Image
                                source={{ uri: profileImage }}
                                className="rounded-2xl bg-zinc-800"
                                style={{ width: wp('24%'), height: wp('24%') }}
                            />
                        </View>
                        <TouchableOpacity
                            className="px-6 py-2 rounded-full mb-1"
                            style={{ backgroundColor: theme.text }}
                        >
                            <Text style={{ color: theme.background, fontFamily: 'Outfit-Bold' }}>Follow</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-5 mt-3">
                        <View className="flex-row items-center">
                            <Text className="text-2xl" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>
                                {profileData.profile?.fullName || 'User'}
                            </Text>
                            {isRecruiter && (
                                <View className="ml-2 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                                    <Text className="text-green-500 text-[10px]" style={{ fontFamily: 'Outfit-Bold' }}>RECRUITER</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Regular' }}>@{profileData.email.split('@')[0]}</Text>

                        <Text className="mt-3 text-base leading-5" style={{ color: theme.text, fontFamily: 'Outfit-Regular' }}>
                            {profileData.profile?.bio || 'Professional at Dispatch.io'}
                        </Text>

                        <View className="flex-row mt-4 gap-x-5">
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={16} color="#71717a" />
                                <Text className="text-zinc-500 ml-1 text-sm">{profileData.profile?.location || 'Remote'}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={16} color="#71717a" />
                                <Text className="text-zinc-500 ml-1 text-sm">Joined {new Date(profileData.createdAt || Date.now()).getFullYear()}</Text>
                            </View>
                        </View>

                        <View className="flex-row mt-4 mb-4 gap-x-4">
                            <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold' }}>0 <Text className="text-zinc-500 font-normal">Following</Text></Text>
                            <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold' }}>{profileData.appliedJobsCount || 0} <Text className="text-zinc-500 font-normal">Applications</Text></Text>
                        </View>
                    </View>
                </View>

                {/* Section 2: STICKY TABS */}
                <View
                    className="flex-row border-b"
                    style={{
                        borderColor: isDark ? '#2f3336' : '#eff3f4',
                        backgroundColor: theme.background
                    }}
                >
                    {['About', 'Jobs', 'Posts', 'Media'].map((tab) => (
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className="flex-1 items-center py-4">
                            <Text style={{
                                fontFamily: activeTab === tab ? 'Outfit-Bold' : 'Outfit-Medium',
                                color: activeTab === tab ? theme.text : '#71717a',
                                fontSize: wp('3.8%')
                            }}>{tab}</Text>
                            {activeTab === tab && (
                                <View className="absolute bottom-0 w-12 h-1 rounded-full" style={{ backgroundColor: theme.brand }} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Section 3: Tab Content */}
                <View className="px-5 py-6" style={{ minHeight: hp('50%'), backgroundColor: theme.background }}>
                    {activeTab === 'About' ? (
                        <View>
                            <Text className="text-lg mb-2" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>About</Text>
                            <Text className="text-base leading-6" style={{ fontFamily: 'Outfit-Regular', color: isDark ? '#a1a1aa' : '#4b5563' }}>
                                {profileData.profile?.bio || 'No biography provided yet.'}
                            </Text>

                            {profileData.profile?.skills && profileData.profile.skills.length > 0 && (
                                <View className="mt-6">
                                    <Text className="text-lg mb-3" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Skills</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {profileData.profile.skills.map((skill: string) => (
                                            <View
                                                key={skill}
                                                className="px-4 py-2 rounded-full border"
                                                style={{
                                                    borderColor: isDark ? '#2f3336' : '#eff3f4',
                                                    backgroundColor: isDark ? '#16181c' : '#f9fafb'
                                                }}
                                            >
                                                <Text style={{ color: theme.text, fontFamily: 'Outfit-Medium', fontSize: wp('3.2%') }}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View className="items-center mt-10">
                            <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>No {activeTab.toLowerCase()} to display yet.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}