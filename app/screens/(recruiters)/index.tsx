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
    UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// New Dashboard Components
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

    const loadData = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsLoading(true);

        setTimeout(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsLoading(false);
            setRefreshing(false);
        }, 1500);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setRefreshing(true);
        loadData();
    }, [loadData]);

    const activeJobs = [
        {
            id: 1,
            type: 'job',
            user: 'Airbnb Careers',
            handle: '@airbnb_jobs',
            avatar: 'https://i.pravatar.cc/150?u=airbnb',
            time: '2d ago',
            content: "We're looking for a UI Engineer to help us redefine travel. Must love Design Systems and React Native! ✈️",
            jobRole: 'UI Engineer',
            salary: '$140k - $180k',
            stats: { comments: '12', reposts: '45', likes: '320' },
        },
        {
            id: 2,
            type: 'job',
            user: 'Airbnb Careers',
            handle: '@airbnb_jobs',
            avatar: 'https://i.pravatar.cc/150?u=airbnb',
            time: '5d ago',
            content: "Senior Backend Developer needed for our core infrastructure team. Focus on scalability and performance.",
            jobRole: 'Senior Backend Developer',
            salary: '$160k - $210k',
            stats: { comments: '8', reposts: '12', likes: '150' },
        }
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView className="flex-1" edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.brand}
                        />
                    }
                >
                    {/* LinkedIn Style Profile Header */}
                    <RecruiterProfileHeader
                        name="Emmanuel Nwafor"
                        headline="Talent Acquisition Specialist at Dispatch.io | Scaling Tech Teams 🚀"
                        location="London, United Kingdom"
                        avatarUrl="https://i.pravatar.cc/300?u=emmanuel"
                        bannerUrl="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000"
                        onEditPress={() => Haptics.selectionAsync()}
                    />

                    {/* Stats/Analytics Section */}
                    <RecruiterStats />

                    {/* Quick Actions */}
                    <QuickActions />

                    {/* Active Jobs/Postings Section */}
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

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Post Job FAB */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/screens/create-post' as any)}
                style={[styles.fab, { backgroundColor: theme.brand }]}
            >
                <Ionicons name="add" size={wp('8%')} color="#000" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: hp('4%'),
        right: wp('6%'),
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp('7.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    sectionContainer: {
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
    },
    seeAll: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
    },
    jobsList: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(113, 113, 122, 0.1)',
    }
});
