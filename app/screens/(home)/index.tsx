import { Colors } from '@/app/constants/Colors';
import JobFilterModal from '@/components/modals/JobFilterModal';
import FeedItem from '@/components/home/FeedItem';
import HomeHeader from '@/components/home/HomeHeader';
import PromotedBanner from '@/components/home/PromotedBanner';
import FeaturedCompanies from '@/components/home/FeaturedCompanies';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { Skeleton } from '@/components/skeletons/HomeSkeleton';
import { feeds as feedsApi } from '@/app/data/api';
import Toast from 'react-native-toast-message';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function UsersHomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [filterVisible, setFilterVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingFeed, setIsLoadingFeed] = useState(true);
    const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
    const [searchQuery, setSearchQuery] = useState('');
    const [feedData, setFeedData] = useState<any[]>([]);

    const loadFeed = useCallback(async (isRefreshing = false) => {
        if (!isRefreshing) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsLoadingFeed(true);
        }
        try {
            const res = await feedsApi.getFeed();
            if (res.success) {
                const transformedData = (res as any).data.map((item: any) => {
                    const isJob = item.feedType === 'job';
                    const creatorName = isJob
                        ? (item.recruiter?.recruiterProfile?.companyName || 'Anonymous Company')
                        : (item.creatorId?.recruiterProfile?.companyName || item.creatorId?.profile?.fullName || 'Anonymous');

                    return {
                        id: item._id,
                        type: item.feedType,
                        user: creatorName,
                        handle: `@${creatorName.replace(/\s+/g, '').toLowerCase()}`,
                        avatar: item.recruiter?.avatar || item.creatorId?.avatar || `https://ui-avatars.com/api/?name=${creatorName.replace(/\s+/g, '+')}`,
                        time: '2h',
                        content: isJob ? item.description : item.content,
                        jobRole: item.title,
                        salary: isJob ? `${item.salaryRange?.min}-${item.salaryRange?.max}` : undefined,
                        location: item.location || 'Remote',
                        stats: {
                            comments: '12',
                            reposts: '5',
                            likes: isJob ? String(item.applicantsCount || 0) : String(item.likes?.length || 0)
                        },
                        attachments: [
                            ...(item.images ? item.images.map((img: string) => ({ type: 'image', url: img })) : []),
                            ...(item.videoUrl ? [{ type: 'video', url: item.videoUrl, thumbnail: item.thumbnailUrl || item.videoUrl.replace(/\.[^.]+$/, '.jpg') }] : [])
                        ]
                    };
                });
                setFeedData(transformedData);
            }
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not update feed' });
        } finally {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsLoadingFeed(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { loadFeed(); }, [loadFeed]);

    const onRefresh = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setRefreshing(true);
        loadFeed(true);
    }, [loadFeed]);

    const filteredFeed = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return feedData.filter(item => {
            const content = (item.content || '').toLowerCase();
            const user = (item.user || '').toLowerCase();

            return content.includes(query) || user.includes(query);
        });
    }, [searchQuery, feedData]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView className="flex-1" edges={['top']}>
                <HomeHeader
                    onFilterPress={() => setFilterVisible(true)}
                    onSearch={(query) => setSearchQuery(query)}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[1]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#006400" // Dark Green as requested
                            colors={["#006400"]}
                        />
                    }
                >
                    <View>
                        <PromotedBanner onPress={() => router.push('/screens/refine' as any)} />
                        <FeaturedCompanies />
                    </View>

                    <View className="flex-row border-b" style={{ borderBottomColor: isDark ? '#2f3336' : '#eff3f4', backgroundColor: theme.background }}>
                        {(['forYou', 'following'] as const).map((tab) => (
                            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className="flex-1 py-4 items-center">
                                <Text style={{
                                    fontFamily: activeTab === tab ? 'Outfit-Bold' : 'Outfit-Medium',
                                    color: activeTab === tab ? theme.text : '#71717a',
                                    fontSize: wp('3.5%')
                                }}>{tab === 'forYou' ? 'For You' : 'Following'}</Text>
                                {activeTab === tab && <View className="absolute bottom-0 w-12 h-1 rounded-full" style={{ backgroundColor: theme.brand }} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ flex: 1 }}>
                        {isLoadingFeed ? (
                            <View style={{ padding: wp('4%') }}>
                                <Skeleton width={wp('92%')} height={hp('20%')} borderRadius={16} />
                            </View>
                        ) : (
                            <View className="pb-32">
                                {filteredFeed.map((item) => (
                                    <FeedItem key={item.id} item={item} onApply={() => { }} />
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/screens/create-post' as any)}
                style={[styles.fab, { backgroundColor: theme.brand }]}
            >
                <Ionicons name="add" size={wp('8%')} color="#fff" />
            </TouchableOpacity>

            <JobFilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} onApply={() => setFilterVisible(false)} />
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    }
});