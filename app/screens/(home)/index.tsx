import { Colors } from '@/app/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    // Mock Data for "Recommended" section
    const recommendedJobs = [
        { id: 1, role: 'UI Engineer', company: 'Airbnb', salary: '$140k - $180k', logo: 'home-variant' },
        { id: 2, role: 'Fullstack Dev', company: 'Stripe', salary: '$160k - $200k', logo: 'credit-card-outline' },
        { id: 3, role: 'Product Lead', company: 'Meta', salary: '$190k - $240k', logo: 'infinity' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView className="flex-1">
                {/* Header: Minimal & Brand-focused */}
                <View className="flex-row justify-between items-center px-6 h-14">
                    <View className="flex-row items-center">
                        <View className="w-2 h-6 rounded-full mr-2" style={{ backgroundColor: theme.brand }} />
                        <Text className="text-xl tracking-tighter" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>
                            dispatch.io
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity className="mr-4">
                            <Ionicons name="search" size={22} color={theme.text} />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center overflow-hidden">
                            <Image source={{ uri: 'https://i.pravatar.cc/100' }} className="w-full h-full" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('5%') }}>

                    {/* AI CO-PILOT BANNER (The Hook) */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push('/screens/apply')}
                        className="mx-6 mt-6 overflow-hidden rounded-[32px]"
                    >
                        <LinearGradient
                            colors={isDark ? ['#064e3b', '#022c22'] : [theme.brand, '#accf00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-6 relative"
                        >
                            <View className="z-10">
                                <View className="bg-black/20 self-start px-2 py-1 rounded-md mb-2">
                                    <Text className="text-[9px] uppercase tracking-widest text-white" style={{ fontFamily: 'Outfit-Bold' }}>
                                        AI Co-Pilot Active
                                    </Text>
                                </View>
                                <Text className="text-2xl leading-7 text-white" style={{ fontFamily: 'Outfit-Bold' }}>
                                    Match your CV to{'\n'}any job in 1-tap.
                                </Text>
                                <TouchableOpacity className="mt-4 bg-white/20 self-start px-4 py-2 rounded-full border border-white/30">
                                    <Text className="text-white text-xs" style={{ fontFamily: 'Outfit-Bold' }}>Try AI Optimizer</Text>
                                </TouchableOpacity>
                            </View>
                            <MaterialCommunityIcons name="auto-fix" size={80} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: -10, bottom: -10 }} />
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* QUICK STATS */}
                    <View className="flex-row px-6 mt-6 justify-between">
                        <View className="items-center w-[30%] py-4 rounded-2xl bg-zinc-500/5 border border-zinc-500/10">
                            <Text className="text-xl" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>24</Text>
                            <Text className="text-[10px] text-zinc-500 uppercase tracking-tighter" style={{ fontFamily: 'Outfit-Medium' }}>Sent</Text>
                        </View>
                        <View className="items-center w-[30%] py-4 rounded-2xl bg-zinc-500/5 border border-zinc-500/10">
                            <Text className="text-xl" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>08</Text>
                            <Text className="text-[10px] text-zinc-500 uppercase tracking-tighter" style={{ fontFamily: 'Outfit-Medium' }}>Views</Text>
                        </View>
                        <View className="items-center w-[30%] py-4 rounded-2xl bg-zinc-500/5 border border-zinc-500/10">
                            <Text className="text-xl text-blue-500" style={{ fontFamily: 'Outfit-Bold' }}>03</Text>
                            <Text className="text-[10px] text-zinc-500 uppercase tracking-tighter" style={{ fontFamily: 'Outfit-Medium' }}>Interviews</Text>
                        </View>
                    </View>

                    {/* ACTIVE APPLICATIONS */}
                    <View className="mt-8 px-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>In Progress</Text>
                            <Text className="text-xs text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>See Tracked</Text>
                        </View>

                        <TouchableOpacity
                            className="p-4 rounded-3xl border mb-3 flex-row items-center"
                            style={{ backgroundColor: isDark ? '#111111' : '#fff', borderColor: isDark ? '#27272a' : '#e4e4e7' }}
                        >
                            <View className="w-12 h-12 bg-zinc-900 rounded-2xl items-center justify-center mr-4">
                                <MaterialCommunityIcons name="github" size={28} color="#fff" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-base" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Senior Dev</Text>
                                <Text className="text-xs text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>GitHub • Remote</Text>
                            </View>
                            <View className="items-end">
                                <View className="bg-blue-500/10 px-2 py-1 rounded-md mb-1">
                                    <Text className="text-[10px] text-blue-500" style={{ fontFamily: 'Outfit-Bold' }}>TECHNICAL TEST</Text>
                                </View>
                                <Text className="text-[10px] text-zinc-500" style={{ fontFamily: 'Outfit-Regular' }}>Due in 2 days</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* RECOMMENDED FOR YOU (New Section) */}
                    <View className="mt-8">
                        <View className="px-6 flex-row justify-between items-center mb-4">
                            <Text className="text-lg" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Recommended for You</Text>
                            <Ionicons name="options-outline" size={20} color={theme.text} />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}>
                            {recommendedJobs.map((job) => (
                                <TouchableOpacity
                                    key={job.id}
                                    className="mr-4 p-5 rounded-[32px] w-[220px] border"
                                    style={{ backgroundColor: isDark ? '#18181b' : '#f9f9f9', borderColor: isDark ? '#27272a' : '#e4e4e7' }}
                                >
                                    <View className="flex-row justify-between items-start mb-4">
                                        <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
                                            <MaterialCommunityIcons name={job.logo as any} size={24} color="#000" />
                                        </View>
                                        <TouchableOpacity>
                                            <Ionicons name="bookmark-outline" size={20} color="#71717a" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text className="text-base mb-1" numberOfLines={1} style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>{job.role}</Text>
                                    <Text className="text-xs text-zinc-500 mb-3" style={{ fontFamily: 'Outfit-Medium' }}>{job.company}</Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-xs" style={{ fontFamily: 'Outfit-Bold', color: theme.brand }}>{job.salary}</Text>
                                        <View className="bg-zinc-500/10 px-2 py-1 rounded-md">
                                            <Text className="text-[9px] text-zinc-400" style={{ fontFamily: 'Outfit-Bold' }}>FULL-TIME</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}