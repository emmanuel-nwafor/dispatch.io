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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [filterVisible, setFilterVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingFeed, setIsLoadingFeed] = useState(true); // Loading only the feed
    const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
    const [searchQuery, setSearchQuery] = useState('');

    const loadFeed = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsLoadingFeed(true);

        setTimeout(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsLoadingFeed(false);
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        loadFeed();
    }, []);

    const feedData = [
        {
            id: 1,
            type: 'job',
            user: 'Airbnb Careers',
            handle: '@airbnb_jobs',
            avatar: 'https://i.pravatar.cc/150?u=airbnb',
            time: '2h',
            content: "We're looking for a UI Engineer to help us redefine travel. Must love Design Systems and React Native! ✈️ #hiring #uiux",
            jobRole: 'UI Engineer',
            salary: '$140k - $180k',
            stats: { comments: '12', reposts: '45', likes: '320' },
            attachments: [
                { type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000' }
            ]
        },
        {
            id: 2,
            type: 'post',
            user: 'Sarah Jenkins',
            handle: '@sarah_codes',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            time: '4h',
            content: "Just finished a technical interview with a fintech startup. The 'live coding' anxiety is real, but I think I nailed the system design portion! 🚀 Here are some shots from my home setup.",
            stats: { comments: '24', reposts: '5', likes: '128' },
            attachments: [
                { type: 'image', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800' },
                { type: 'image', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' },
                { type: 'image', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' }
            ]
        },
        {
            id: 3,
            type: 'post',
            user: 'TechCrunch',
            handle: '@techcrunch',
            avatar: 'https://i.pravatar.cc/150?u=tc',
            time: '6h',
            content: "Check out the new Apple Vision Pro workspace integration. The future of remote work is here. 🥽",
            stats: { comments: '89', reposts: '210', likes: '1.2k' },
            attachments: [
                { type: 'video', url: 'https://path-to-video.mp4', thumbnail: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800' }
            ]
        }
    ];

    const onRefresh = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setRefreshing(true);
        loadFeed();
    }, [loadFeed]);

    const filteredFeed = useMemo(() => {
        return feedData.filter(item =>
            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.user.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const FeedSkeleton = () => (
        <View style={{ paddingBottom: 100 }}>
            {[1, 2, 3].map((i) => (
                <View key={i} style={[styles.feedItemSkeleton, { borderBottomColor: isDark ? '#2f3336' : '#eff3f4' }]}>
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                        <Skeleton width={48} height={48} borderRadius={24} />
                        <View style={{ justifyContent: 'center', gap: 6 }}>
                            <Skeleton width={140} height={16} borderRadius={4} />
                            <Skeleton width={90} height={12} borderRadius={4} />
                        </View>
                    </View>
                    <Skeleton width="95%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                    <Skeleton width="85%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />
                    <Skeleton width="100%" height={200} borderRadius={16} />
                </View>
            ))}
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView className="flex-1" edges={['top']}>
                <HomeHeader
                    onFilterPress={() => {
                        Haptics.selectionAsync();
                        setFilterVisible(true);
                    }}
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
                        />
                    }
                >
                    <View>
                        <PromotedBanner onPress={() => router.push('/screens/refine' as any)} />
                        <FeaturedCompanies />
                    </View>

                    <View
                        className="flex-row border-b"
                        style={{
                            borderBottomColor: isDark ? '#2f3336' : '#eff3f4',
                            backgroundColor: theme.background,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setActiveTab('forYou')}
                            className="flex-1 py-4 items-center"
                        >
                            <Text style={{
                                fontFamily: activeTab === 'forYou' ? 'Outfit-Bold' : 'Outfit-Medium',
                                color: activeTab === 'forYou' ? theme.text : '#71717a'
                            }}>For You</Text>
                            {activeTab === 'forYou' && (
                                <View className="absolute bottom-0 w-12 h-1 rounded-full" style={{ backgroundColor: theme.brand }} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab('following')}
                            className="flex-1 py-4 items-center"
                        >
                            <Text style={{
                                fontFamily: activeTab === 'following' ? 'Outfit-Bold' : 'Outfit-Medium',
                                color: activeTab === 'following' ? theme.text : '#71717a'
                            }}>Following</Text>
                            {activeTab === 'following' && (
                                <View className="absolute bottom-0 w-12 h-1 rounded-full" style={{ backgroundColor: theme.brand }} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        {isLoadingFeed ? (
                            <FeedSkeleton />
                        ) : (
                            <View className="pb-32">
                                {filteredFeed.map((item) => (
                                    <FeedItem
                                        key={item.id}
                                        item={item as any}
                                        onApply={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                                    />
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
                <Ionicons name="add" size={wp('8%')} color="#000" />
            </TouchableOpacity>

            <JobFilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={() => setFilterVisible(false)}
            />
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
    },
    feedItemSkeleton: {
        padding: 16,
        borderBottomWidth: 1,
    }
});