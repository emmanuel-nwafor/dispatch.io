import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    StatusBar,
    RefreshControl,
    ScrollView // Added ScrollView for long text containment
} from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus, Audio } from 'expo-av';
import { feeds, reels as reelsApi, user as userApi } from '@/app/data/api';
import { useUserStore } from '@/hooks/useUserStore';
import { storage } from '@/app/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import CommentsModal from '@/components/modals/CommentsModal';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

// --- Sub-Component: ReelPlayer ---
const ReelPlayer = ({ item, isVisible }: { item: any, isVisible: boolean }) => {
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item.likes?.length || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>(item.comments || []);
    const [userId, setUserId] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    // "See More" state
    const [showFullDescription, setShowFullDescription] = useState(false);

    const { user: currentUser } = useUserStore();

    useEffect(() => {
        if (currentUser && item.creatorId?._id) {
            setIsFollowing(currentUser.following?.includes(item.creatorId._id));
        }
    }, [currentUser, item.creatorId?._id]);

    useEffect(() => {
        const checkUser = async () => {
            const user = await storage.getUser();
            if (user) {
                setUserId(user._id || user.id);
                setIsLiked(item.likes?.includes(user._id || user.id));
            }
        };
        checkUser();
    }, [item.likes]);

    useEffect(() => {
        const prepareAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                });
            } catch (e) {
                console.log("Audio mode error", e);
            }
        };
        prepareAudio();
    }, []);

    useEffect(() => {
        if (isVisible) {
            videoRef.current?.playAsync();
        } else {
            videoRef.current?.pauseAsync();
            videoRef.current?.setPositionAsync(0);
            setShowFullDescription(false);
        }
    }, [isVisible]);

    const isLoaded = status && status.isLoaded;
    const isPlaying = isLoaded && status.isPlaying;

    const togglePlayPause = () => {
        if (isLoaded) {
            isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync();
        }
    };

    const handleLike = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            setLikeCount((prev: number) => newIsLiked ? prev + 1 : prev - 1);

            await reelsApi.like(item._id);
        } catch (error) {
            console.error('Like error', error);
            setIsLiked(!isLiked);
            setLikeCount((prev: number) => isLiked ? prev + 1 : prev - 1);
        }
    };

    const handleComment = async (text: string) => {
        try {
            const res = await reelsApi.comment(item._id, text);
            if (res.success) {
                setComments(res.data.comments || []);
            }
        } catch (error) {
            console.error('Failed to comment on reel:', error);
        }
    };

    const handleFollow = async () => {
        if (!item.creatorId?._id) return;
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsFollowing(true);
            await userApi.follow(item.creatorId._id);
        } catch (error) {
            console.error('Failed to follow user:', error);
            setIsFollowing(false);
        }
    };

    const getProgress = () => {
        if (isLoaded && status.durationMillis) {
            return (status.positionMillis / status.durationMillis) * 100;
        }
        return 0;
    };

    const descriptionText = item.description || item.title || item.content || "";

    return (
        <View style={styles.reelContainer}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={togglePlayPause}
                style={StyleSheet.absoluteFill}
            >
                <Video
                    ref={videoRef}
                    source={{ uri: item.videoUrl || item.attachments?.[0]?.url }}
                    style={StyleSheet.absoluteFill}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    onPlaybackStatusUpdate={setStatus}
                />

                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                />

                {!isPlaying && isLoaded && (
                    <View style={styles.playIconContainer}>
                        <View style={styles.playIconCircle}>
                            <Ionicons name="play" size={wp('10%')} color="white" style={{ marginLeft: 5 }} />
                        </View>
                    </View>
                )}

                {/* Sidebar */}
                <View style={styles.rightSidebar}>
                    <TouchableOpacity
                        onPress={() => router.push(`/screens/profile/${item.creatorId?._id || item.creatorId}`)}
                        style={styles.profileContainer}
                    >
                        <Image
                            source={{ uri: item.creatorId?.avatar || `https://ui-avatars.com/api/?name=${item.user || 'User'}` }}
                            style={styles.avatar}
                        />
                        {!isFollowing && item.creatorId?._id !== currentUser?._id && (
                            <TouchableOpacity
                                style={styles.plusIcon}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleFollow();
                                }}
                            >
                                <Ionicons name="add" size={12} color="white" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                        <MotiView
                            animate={{
                                scale: isLiked ? [1, 1.4, 1] : 1,
                            }}
                            transition={{
                                type: 'spring',
                                damping: 12,
                                stiffness: 200,
                            }}
                        >
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={wp('8.5%')}
                                color={isLiked ? "#FF2D55" : "white"}
                            />
                        </MotiView>
                        <Text style={styles.actionText}>{likeCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowComments(true)}
                        style={styles.actionButton}
                    >
                        <Ionicons name="chatbubble-outline" size={wp('8%')} color="white" />
                        <Text style={styles.actionText}>{comments.length}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-social-outline" size={wp('8%')} color="white" />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <View style={styles.bottomInfo}>
                    <Text style={styles.username}>
                        @{item.user || item.creatorId?.profile?.fullName || 'User'}
                    </Text>

                    <View style={styles.descriptionWrapper}>
                        <ScrollView
                            style={[
                                styles.descriptionScroll,
                                { maxHeight: showFullDescription ? hp('30%') : hp('6%') }
                            ]}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={showFullDescription}
                        >
                            <Text
                                style={styles.description}
                                numberOfLines={showFullDescription ? undefined : 2}
                            >
                                {descriptionText}
                            </Text>
                        </ScrollView>

                        {descriptionText.length > 60 && (
                            <TouchableOpacity
                                onPress={() => setShowFullDescription(!showFullDescription)}
                                style={styles.seeMoreTouchable}
                            >
                                <Text style={styles.seeMoreBtn}>
                                    {showFullDescription ? 'See Less' : '...See More'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.audioContainer}>
                        <Ionicons name="musical-notes" size={14} color="white" />
                        <Text style={styles.audioText}>Original Audio • {item.user || item.creatorId?.profile?.fullName || 'User'}</Text>
                    </View>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
                </View>

                <CommentsModal
                    visible={showComments}
                    onClose={() => setShowComments(false)}
                    comments={comments.map((c: any) => ({
                        user: c.userId?.profile?.fullName || c.userId?.username || 'User',
                        text: c.text
                    }))}
                    onSend={handleComment}
                />
            </TouchableOpacity>
        </View>
    );
};

// --- Main Screen ---
export default function ReelsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [reels, setReels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeViewableItem, setActiveViewableItem] = useState<string | null>(null);

    const fetchReels = async (pageNum = 1, isRefresh = false) => {
        try {
            if (isRefresh) setIsRefreshing(true);
            else if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const res = await feeds.getReels(pageNum, 10);
            let newReels = res.data;

            if (pageNum === 1) {
                if (id && !isRefresh) {
                    const exists = newReels.find((r: any) => r._id === id);
                    if (!exists) {
                        const singleRes = await feeds.getFeedItem(id as string);
                        if (singleRes.data) newReels = [singleRes.data, ...newReels];
                    } else {
                        newReels = [exists, ...newReels.filter((r: any) => r._id !== id)];
                    }
                }
                setReels(newReels);
                if (newReels.length > 0) setActiveViewableItem(newReels[0]._id);
            } else {
                setReels(prev => [...prev, ...newReels]);
            }
            setHasMore(newReels.length > 0);
            setPage(pageNum);
        } catch (error) {
            console.error('Fetch error', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchReels(1); }, [id]);

    const onRefresh = () => {
        fetchReels(1, true);
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveViewableItem(viewableItems[0].key);
        }
    }).current;

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color="#006400" size="large" />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar hidden={true} />
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>

            <FlatList
                data={reels}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ReelPlayer item={item} isVisible={item._id === activeViewableItem} />
                )}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                onEndReached={() => hasMore && !loadingMore && fetchReels(page + 1)}
                onEndReachedThreshold={0.5}
                removeClippedSubviews={Platform.OS === 'android'}
                initialNumToRender={2}
                maxToRenderPerBatch={3}
                windowSize={5}
                snapToInterval={SCREEN_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                        colors={["#006400"]}
                    />
                }
                ListFooterComponent={() => loadingMore ? <ActivityIndicator color="#006400" style={{ marginVertical: 20 }} /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    reelContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: '#000',
    },
    centered: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButton: {
        position: 'absolute',
        top: hp('5%'),
        left: wp('4%'),
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    playIconContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconCircle: {
        width: wp('18%'),
        height: wp('18%'),
        borderRadius: wp('9%'),
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightSidebar: {
        position: 'absolute',
        right: wp('4%'),
        bottom: hp('10%'),
        alignItems: 'center',
    },
    profileContainer: {
        marginBottom: hp('3%'),
        alignItems: 'center'
    },
    avatar: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        borderWidth: 1.5,
        borderColor: 'white'
    },
    plusIcon: {
        position: 'absolute',
        bottom: -4,
        backgroundColor: '#FF2D55',
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: hp('2.5%')
    },
    actionText: {
        color: 'white',
        fontSize: wp('3%'),
        fontFamily: 'Outfit-Bold',
        marginTop: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3
    },
    bottomInfo: {
        position: 'absolute',
        bottom: hp('4%'),
        left: wp('4%'),
        right: wp('22%'),
    },
    username: {
        color: 'white',
        fontSize: wp('4.2%'),
        fontFamily: 'Outfit-Bold',
        marginBottom: 4
    },
    descriptionWrapper: {
        width: '100%',
    },
    descriptionScroll: {
        width: '100%',
    },
    description: {
        color: 'white',
        fontSize: wp('3.6%'),
        fontFamily: 'Outfit-Regular',
        lineHeight: 20
    },
    seeMoreTouchable: {
        alignSelf: 'flex-start',
    },
    seeMoreBtn: {
        color: '#ccc',
        fontFamily: 'Outfit-Bold',
        fontSize: wp('3.4%'),
        marginTop: 2
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    audioText: {
        color: 'white',
        fontSize: wp('3%'),
        fontFamily: 'Outfit-Medium',
        marginLeft: 6
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 1.5,
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.6)'
    }
});