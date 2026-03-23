import { Colors } from '@/app/constants/Colors';
import JobFilterModal from '@/components/modals/JobFilterModal';
import FeedItem from '@/components/home/FeedItem'; // This now handles skeleton logic
import HomeHeader from '@/components/home/HomeHeader';
import PromotedBanner from '@/components/home/PromotedBanner';
import FeaturedCompanies from '@/components/home/FeaturedCompanies';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useMemo } from 'react';
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
import { feeds as feedsApi } from '@/app/data/api';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { useUserStore } from '@/hooks/useUserStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function UsersHomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const { user: currentUser } = useUserStore();
    const isDark = colorScheme === 'dark';

    const [filterVisible, setFilterVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingFeed, setIsLoadingFeed] = useState(true);
    const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
    const [searchQuery, setSearchQuery] = useState('');
    const [feedData, setFeedData] = useState<any[]>([]);

    const formatTime = (dateString: string) => {
        if (!dateString) return 'now';
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60) ;
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        return `${diffDays}d`;
    };

    const loadFeed = useCallback(async (isRefreshing = false) => {
        if (!isRefreshing) {
            // Keep UI stable but show loading state
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
                        userId: isJob ? item.recruiter?._id : item.creatorId?._id,
                        type: item.feedType,
                        user: creatorName,
                        handle: `@${creatorName.replace(/\s+/g, '').toLowerCase()}`,
                        avatar: item.recruiter?.avatar || item.creatorId?.avatar || `https://ui-avatars.com/api/?name=${creatorName.replace(/\s+/g, '+')}`,
                        time: formatTime(item.createdAt),
                        content: isJob ? item.description : item.content,
                        isLiked: item.likes?.includes(currentUser?._id || currentUser?.id),
                        isReshared: item.reshares?.some((r: any) => (r.userId || r) === (currentUser?._id || currentUser?.id)),
                        jobRole: item.title,
                        salary: isJob ? `${item.salaryRange?.min}-${item.salaryRange?.max}` : undefined,
                        location: item.location || 'Remote',
                        stats: {
                            comments: String(item.comments?.length || 0),
                            reposts: String(item.reshares?.length || 0),
                            likes: isJob ? String(item.applicantsCount || 0) : String(item.likes?.length || 0)
                        },
                        parentPost: item.parentPostId ? {
                            user: item.parentPostId.creatorId?.profile?.fullName || item.parentPostId.creatorId?.recruiterProfile?.companyName || 'User',
                            avatar: item.parentPostId.creatorId?.avatar || `https://ui-avatars.com/api/?name=User`,
                            content: item.parentPostId.content,
                            attachments: (item.parentPostId.images || []).map((url: string) => ({ type: 'image', url })),
                        } : undefined,
                        attachments: [
                            ...(item.images ? item.images.map((img: string) => ({ type: 'image', url: img })) : []),
                            ...(item.videoUrl ? [{
                                type: 'video',
                                url: item.videoUrl,
                                thumbnail: item.muxPlaybackId
                                    ? `https://image.mux.com/${item.muxPlaybackId}/thumbnail.jpg`
                                    : (item.thumbnailUrl || 'https://via.placeholder.com/400x225.png?text=Video')
                            }] : [])
                        ]
                    };
                });
                setFeedData(transformedData);
            }
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not update feed' });
        } finally {
            // Smooth transition from skeleton to content
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsLoadingFeed(false);
            setRefreshing(false);
        }
    }, [currentUser]);

    useFocusEffect(
        useCallback(() => {
            loadFeed();
        }, [loadFeed])
    );

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
                            tintColor="#006400"
                            colors={["#006400"]}
                        />
                    }
                >
                    <View>
                        <PromotedBanner onPress={() => router.push('/screens/refine' as any)} />
                        <FeaturedCompanies />
                    </View>

                    {/* Tabs */}
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

                    {/* Content Area */}
                    <View style={{ flex: 1 }}>
                        {isLoadingFeed ? (
                            <View>
                                {/* We render 5 skeletons to fill the screen */}
                                {[1, 2, 3, 4, 5].map((key) => (
                                    <FeedItem key={key} loading={true} />
                                ))}
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