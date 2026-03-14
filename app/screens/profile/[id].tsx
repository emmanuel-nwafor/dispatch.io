import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import FeedItem from '@/components/home/FeedItem';
import { profile as profileApi } from '@/app/data/api';

const { width } = Dimensions.get('window');

export default function ProfileDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState('About');

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await profileApi.getUserProfile(id as string);
                if (res.success) {
                    setUser(res.user);
                } else {
                    setError('Failed to load profile');
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while loading the profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.brand} />
            </View>
        );
    }

    if (error || !user) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontFamily: 'Outfit-Medium' }}>{error || 'Profile not found'}</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-2 bg-zinc-800 rounded-full">
                    <Text className="text-white" style={{ fontFamily: 'Outfit-Bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Map Backend User Data to UI Schema
    const profile = {
        isCompany: user.role === 'recruiter',
        isHiring: user.role === 'recruiter', // Simplification for now
        name: user.profile?.fullName || 'Anonymous User',
        verified: user.isVerified || false,
        handle: user.email ? `@${user.email.split('@')[0]}` : '@user',
        headline: user.profile?.headline || (user.role === 'recruiter' ? 'Hiring at top companies' : 'Open to new opportunities'),
        logo: user.profile?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        banner: user.profile?.bannerImage || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000',
        industry: user.profile?.industry || 'Technology',
        location: user.profile?.location || 'Global',
        website: user.profile?.website || '',
        joinedDate: `Joined ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        stats: {
            followers: '0',
            following: '0',
            openRoles: '0'
        },
        about: user.profile?.bio || 'No biography provided yet.',
        services: [], // Add logic later if users have services
        jobs: [], // Add logic later to fetch recruiter jobs
        posts: [] // Add logic later to fetch user posts
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style="light" />

            {/* Sticky Top Nav Button Overlay */}
            <View className="absolute z-20 w-full flex-row justify-between px-5 items-center"
                style={{
                    top: Platform.OS === 'ios' ? hp('6%') : hp('4%'),
                }}>
                <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full items-center justify-center bg-black/50">
                    <Ionicons name="arrow-back" size={wp('5.5%')} color="#fff" />
                </TouchableOpacity>
                <View className="flex-row gap-x-3">
                    <TouchableOpacity className="w-9 h-9 rounded-full items-center justify-center bg-black/50">
                        <Feather name="search" size={wp('5%')} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-9 h-9 rounded-full items-center justify-center bg-black/50">
                        <Ionicons name="ellipsis-horizontal" size={wp('5%')} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={true}
                stickyHeaderIndices={[1]}
            >
                <View style={{ backgroundColor: theme.background }}>
                    <View>
                        <Image source={{ uri: profile.banner }} className="w-full h-44" resizeMode="cover" />
                        <View className="px-4 flex-row justify-between items-end -mt-10">
                            <View className="p-1 rounded-3xl" style={{ backgroundColor: theme.background }}>
                                <Image source={{ uri: profile.logo }} className="w-24 h-24 rounded-2xl bg-zinc-800" resizeMode="cover" />
                            </View>
                            <TouchableOpacity
                                className="px-6 py-2 rounded-full border-2 mb-2"
                                style={{ backgroundColor: theme.text, borderColor: theme.text }}
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.background }}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Professional Identity */}
                    <View className="px-4 mt-3">
                        <View className="flex-row items-center">
                            <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('6%'), color: theme.text }}>{profile.name}</Text>
                            {profile.verified && <MaterialCommunityIcons name="check-decagram" size={20} color="#1DA1F2" style={{ marginLeft: 4 }} />}
                            {profile.isHiring && (
                                <View className="ml-3 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                                    <Text className="text-green-500" style={{ fontFamily: 'Outfit-Bold', fontSize: 10 }}>HIRING</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Regular' }}>{profile.handle}</Text>

                        <Text className="mt-3" style={{ fontFamily: 'Outfit-Regular', fontSize: wp('4%'), color: theme.text, lineHeight: 20 }}>
                            {profile.headline}
                        </Text>

                        <View className="flex-row flex-wrap mt-3 gap-x-4 gap-y-1">
                            {profile.location && (
                                <View className="flex-row items-center">
                                    <Ionicons name="location-outline" size={16} color="#71717a" />
                                    <Text className="text-zinc-500 ml-1" style={{ fontSize: wp('3.3%') }}>{profile.location}</Text>
                                </View>
                            )}
                            {profile.website ? (
                                <View className="flex-row items-center">
                                    <Ionicons name="link-outline" size={16} color={theme.brand} />
                                    <Text style={{ color: theme.brand, marginLeft: 1, fontSize: wp('3.3%') }}>{profile.website}</Text>
                                </View>
                            ) : null}
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={16} color="#71717a" />
                                <Text className="text-zinc-500 ml-1" style={{ fontSize: wp('3.3%') }}>{profile.joinedDate}</Text>
                            </View>
                        </View>

                        <View className="flex-row mt-4 mb-4 gap-x-4">
                            <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold' }}>{profile.stats.following} <Text className="text-zinc-500 font-normal">Following</Text></Text>
                            <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold' }}>{profile.stats.followers} <Text className="text-zinc-500 font-normal">Followers</Text></Text>
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
                                color: activeTab === tab ? theme.text : '#71717a'
                            }}>{tab}</Text>
                            {activeTab === tab && (
                                <View className="absolute bottom-0 w-12 h-1 rounded-full" style={{ backgroundColor: theme.brand }} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Section 3: Tab Content */}
                <View style={{ minHeight: hp('70%'), backgroundColor: theme.background }}>
                    {activeTab === 'About' && (
                        <View className="px-4 py-6">
                            <View className="mb-6">
                                <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.5%'), color: theme.text }} className="mb-2">About</Text>
                                <Text style={{ fontFamily: 'Outfit-Regular', color: isDark ? '#a1a1aa' : '#4b5563', lineHeight: 22 }}>{profile.about}</Text>
                            </View>

                            {/* Skills Section for candidates */}
                            {user.profile?.skills && user.profile.skills.length > 0 && (
                                <View className="mb-6">
                                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.5%'), color: theme.text }} className="mb-3">Skills</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {user.profile.skills.map((skill: string) => (
                                            <View key={skill} className="px-3 py-1.5 rounded-full border"
                                                style={{ borderColor: isDark ? '#2f3336' : '#eff3f4', backgroundColor: isDark ? '#16181c' : '#f9fafb' }}>
                                                <Text style={{ color: theme.text, fontFamily: 'Outfit-Medium' }}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                        </View>
                    )}

                    {activeTab === 'Jobs' && (
                        <View className="px-4 py-6">
                            <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium', textAlign: 'center', marginTop: 20 }}>No jobs to display yet.</Text>
                        </View>
                    )}

                    {activeTab === 'Posts' && (
                        <View className="px-4 py-6">
                            <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium', textAlign: 'center', marginTop: 20 }}>No posts to display yet.</Text>
                        </View>
                    )}

                    {activeTab === 'Media' && (
                        <View className="px-4 py-6">
                            <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium', textAlign: 'center', marginTop: 20 }}>No media to display yet.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({});