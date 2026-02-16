import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions
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

const { width } = Dimensions.get('window');

export default function ProfileDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState('Posts');

    const profile = {
        isCompany: true,
        isHiring: true,
        name: 'Airbnb',
        verified: true,
        handle: '@airbnb_official',
        headline: 'Helping creators belong anywhere. Leading the revolution of flexible living and travel.',
        logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111320.png',
        banner: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000',
        industry: 'Hospitality',
        location: 'San Francisco, CA',
        website: 'airbnb.com/careers',
        joinedDate: 'Joined March 2008',
        stats: {
            followers: '1.2M',
            following: '428',
            openRoles: '14'
        },
        mutuals: ['Elon', 'Zuck', 'Dorsey'],
        about: 'Airbnb is a mission-driven company focused on creating a world where anyone can belong anywhere. We are looking for designers, engineers, and dreamers.',
        services: [
            { id: 1, title: 'Luxury Stays', desc: 'Curated high-end homes', icon: 'diamond-outline' },
            { id: 2, title: 'Online Experiences', desc: 'Interactive global activities', icon: 'videocam-outline' },
        ],
        jobs: [
            { id: 1, role: 'Senior UX Designer', loc: 'Remote', pay: '$150k - $200k', tags: ['Design', 'Mobile'] },
            { id: 2, role: 'Principal RN Engineer', loc: 'London, UK', pay: '$180k - $240k', tags: ['Engineering', 'React'] },
        ],
        posts: [
            {
                id: 1,
                user: 'Airbnb',
                handle: '@airbnb_official',
                avatar: 'https://cdn-icons-png.flaticon.com/512/2111/2111320.png',
                time: '2h',
                type: 'post',
                content: 'The future of work is remote. We just launched our "Live Anywhere" program for employees! 🏠✨',
                stats: {
                    comments: '230',
                    reposts: '1.1K',
                    likes: '14.2K',
                },
                attachments: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000'
                    }
                ]
            },
            {
                id: 2,
                user: 'Airbnb',
                handle: '@airbnb_official',
                avatar: 'https://cdn-icons-png.flaticon.com/512/2111/2111320.png',
                time: '2h',
                type: 'post',
                content: 'The future of work is remote. We just launched our "Live Anywhere" program for employees! 🏠✨',
                stats: {
                    comments: '230',
                    reposts: '1.1K',
                    likes: '14.2K',
                },
                attachments: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000'
                    }
                ]
            },
            {
                id: 3,
                user: 'Airbnb',
                handle: '@airbnb_official',
                avatar: 'https://cdn-icons-png.flaticon.com/512/2111/2111320.png',
                time: '2h',
                type: 'post',
                content: 'The future of work is remote. We just launched our "Live Anywhere" program for employees! 🏠✨',
                stats: {
                    comments: '230',
                    reposts: '1.1K',
                    likes: '14.2K',
                },
                attachments: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000'
                    }
                ]
            }
        ]
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
                                <Image source={{ uri: profile.logo }} className="w-24 h-24 rounded-2xl bg-white" resizeMode="contain" />
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
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={16} color="#71717a" />
                                <Text className="text-zinc-500 ml-1" style={{ fontSize: wp('3.3%') }}>{profile.location}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="link-outline" size={16} color={theme.brand} />
                                <Text style={{ color: theme.brand, marginLeft: 1, fontSize: wp('3.3%') }}>{profile.website}</Text>
                            </View>
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
                                <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.5%'), color: theme.text }} className="mb-2">Bio</Text>
                                <Text style={{ fontFamily: 'Outfit-Regular', color: isDark ? '#a1a1aa' : '#4b5563', lineHeight: 22 }}>{profile.about}</Text>
                            </View>

                            <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.5%'), color: theme.text }} className="mb-4">Services</Text>
                            {profile.services.map(s => (
                                <View key={s.id} className="flex-row items-center p-4 rounded-2xl mb-3 border"
                                    style={{ borderColor: isDark ? '#2f3336' : '#eff3f4' }}>
                                    <View className="w-10 h-10 rounded-xl bg-zinc-100 items-center justify-center mr-4">
                                        <Ionicons name={s.icon as any} size={20} color="#000" />
                                    </View>
                                    <View>
                                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>{s.title}</Text>
                                        <Text className="text-zinc-500 text-xs">{s.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {activeTab === 'Jobs' && (
                        <View className="px-4 py-6">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.5%'), color: theme.text }}>{profile.stats.openRoles} Open Roles</Text>
                                <Ionicons name="options-outline" size={20} color={theme.text} />
                            </View>
                            {profile.jobs.map(job => (
                                <TouchableOpacity key={job.id} className="p-4 rounded-3xl mb-3 border"
                                    style={{ backgroundColor: isDark ? '#16181c' : '#fff', borderColor: isDark ? '#2f3336' : '#eff3f4' }}>
                                    <View className="flex-row justify-between">
                                        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4%'), color: theme.text }}>{job.role}</Text>
                                        <Text style={{ color: theme.brand, fontFamily: 'Outfit-Bold' }}>{job.pay}</Text>
                                    </View>
                                    <Text className="text-zinc-500 mt-1">{job.loc} • Full-time</Text>
                                    <View className="flex-row mt-3 gap-2">
                                        {job.tags.map(t => (
                                            <View key={t} className="px-3 py-1 rounded-full bg-zinc-100">
                                                <Text className="text-zinc-600 text-[10px]" style={{ fontFamily: 'Outfit-Bold' }}>{t.toUpperCase()}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {activeTab === 'Posts' && (
                        <View>
                            {profile.posts.map((post) => (
                                <FeedItem
                                    key={post.id}
                                    item={post as any}
                                    onPress={() => console.log('Post pressed', post.id)}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({});