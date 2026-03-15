import { Colors } from '@/app/constants/Colors';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect } from 'react';
import {
    ScrollView,
    View,
    useColorScheme,
    RefreshControl,
    Text,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// API and Components
import { user, User } from '@/app/data/api';
import { storage } from '@/app/utils/storage'; // Added storage for logout
import RecruiterProfileHeader from '@/components/recruiters/RecruiterProfileHeader';
import RecruiterStats from '@/components/recruiters/RecruiterStats';
import QuickActions from '@/components/recruiters/QuickActions';
import FeedItem from '@/components/home/FeedItem';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RecruitersHomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<User | null>(null);

    const loadData = useCallback(async () => {
        try {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const response = await user.getMe();
            if (response.success) {
                setUserData(response.user);
            }
        } catch (error) {
            console.error("Failed to fetch recruiter profile:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setRefreshing(true);
        loadData();
    }, [loadData]);

    const handleLogout = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await storage.clearAll();
        router.replace('/screens/auth/login');
    };

    const activeJobs = [
        {
            id: 1,
            type: 'job',
            user: userData?.profile?.fullName || 'Company Name',
            handle: `@${userData?.profile?.fullName?.toLowerCase().replace(/\s/g, '_') || 'recruiter'}`,
            avatar: userData?.profile?.resumeUrl || 'https://i.pravatar.cc/150?u=fallback',
            time: '2d ago',
            content: "We're looking for a UI Engineer to help us redefine travel. Must love Design Systems and React Native! ✈️",
            jobRole: 'UI Engineer',
            salary: '$140k - $180k',
            stats: { comments: '12', reposts: '45', likes: '320' },
        }
    ];

    if (isLoading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color="#006400" />
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header with Logout */}
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('6%'), color: theme.text }}>
                        Dashboard
                    </Text>
                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.7}
                        className="bg-red-50 dark:bg-red-900/10 p-2.5 rounded-2xl flex-row items-center border border-red-100 dark:border-red-900/20"
                    >
                        <Ionicons name="log-out-outline" size={wp('5%')} color="#ef4444" />
                        <Text className="text-red-500 ml-2 text-[13px]" style={{ fontFamily: 'Outfit-Bold' }}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp('12%') }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.brand}
                            colors={[theme.brand]}
                        />
                    }
                >
                    <RecruiterProfileHeader
                        name={userData?.profile?.fullName || "Recruiter Name"}
                        headline={userData?.profile?.bio || "Talent Acquisition Specialist"}
                        location={userData?.profile?.location || "Global"}
                        avatarUrl={userData?.profile?.resumeUrl || "https://i.pravatar.cc/300?u=recruiter"}
                        bannerUrl="https://images.unsplash.com/photo-1557683316-973673baf926?w=1000"
                        onEditPress={() => {
                            Haptics.selectionAsync();
                            router.push('/screens/profile/edit');
                        }}
                    />

                    <RecruiterStats />
                    <QuickActions />

                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Job Postings</Text>
                            <TouchableOpacity>
                                <Text style={[styles.seeAll, { color: theme.brand }]}>Manage</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.jobsList}>
                            {activeJobs.map((job) => (
                                <FeedItem
                                    key={job.id}
                                    item={job as any}
                                    onApply={() => { }}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Post Job FAB */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/screens/create-post' as any);
                }}
                style={[styles.fab, { backgroundColor: theme.brand }]}
                className="shadow-lg"
            >
                <Ionicons name="add" size={wp('8%')} color={isDark ? "#000" : "#FFF"} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: hp('4%'),
        right: wp('6%'),
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8%'),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    sectionContainer: {
        marginTop: hp('1.5%'),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        marginBottom: hp('1.5%'),
    },
    sectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('4.5%'),
    },
    seeAll: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('3.5%'),
    },
    jobsList: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(113, 113, 122, 0.1)',
    }
});