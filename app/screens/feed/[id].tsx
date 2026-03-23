import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    Animated,
    useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { feeds, posts as postsApi } from '@/app/data/api';
import { Colors } from '@/app/constants/Colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';
import { useUserStore } from '@/hooks/useUserStore';
import Toast from 'react-native-toast-message';
import ShareRepostModal from '@/components/modals/ShareRepostModal';

export default function SingleFeedScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const { user: currentUser } = useUserStore();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [shareVisible, setShareVisible] = useState(false);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await feeds.getFeedItem(id as string);
                const d = res.data;

                if (d.feedType === 'reel') {
                    router.replace({ pathname: '/screens/reels/[id]', params: { id: d._id } });
                    return;
                }

                setData(d);
                const myId = currentUser?._id || currentUser?.id;
                setIsLiked(d.likes?.includes(myId) ?? false);
                setLikeCount(d.likes?.length ?? 0);
            } catch (error) {
                console.error('Error fetching feed item', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleLike = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const next = !isLiked;
            setIsLiked(next);
            setLikeCount(p => next ? p + 1 : p - 1);
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.35, duration: 100, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
            ]).start();
            await postsApi.like(data._id);
        } catch {
            setIsLiked(p => !p);
            setLikeCount(p => isLiked ? p + 1 : p - 1);
        }
    };

    const handleShareSelect = async (option: string) => {
        setShareVisible(false);
        if (option === 'repost') {
            try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                await postsApi.reshare(data._id);
                Toast.show({ type: 'success', text1: 'Post reshared!' });
            } catch {
                Toast.show({ type: 'error', text1: 'Failed to reshare' });
            }
        }
    };

    const formatFullDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true,
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const formatRelative = (dateStr: string) => {
        if (!dateStr) return '';
        const now = new Date();
        const past = new Date(dateStr);
        const mins = Math.floor((now.getTime() - past.getTime()) / 60000);
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    const borderColor = isDark ? '#2f3336' : '#eff3f4';
    const subText = '#71717a';

    // ── Derived data ────────────────────────────────────────────────────────
    const creatorName = data?.creatorId?.profile?.fullName
        || data?.creatorId?.recruiterProfile?.companyName
        || data?.recruiter?.recruiterProfile?.companyName
        || 'Unknown';
    const creatorAvatar = data?.creatorId?.avatar || data?.recruiter?.avatar
        || `https://ui-avatars.com/api/?name=${creatorName.replace(/\s+/g, '+')}`;
    const creatorId = data?.creatorId?._id || data?.creatorId?.id;
    const handle = `@${creatorName.replace(/\s+/g, '').toLowerCase()}`;

    const parentPost = data?.parentPostId;
    const parentCreatorName = parentPost?.creatorId?.profile?.fullName
        || parentPost?.creatorId?.recruiterProfile?.companyName || 'User';
    const parentAvatar = parentPost?.creatorId?.avatar
        || `https://ui-avatars.com/api/?name=${parentCreatorName.replace(/\s+/g, '+')}`;

    const images: string[] = data?.images || [];
    const comments: any[] = data?.comments || [];
    const reshares: any[] = data?.reshares || [];

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Post</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color={theme.brand} size="large" />
                </View>
            ) : !data ? (
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={48} color={subText} />
                    <Text style={[styles.emptyText, { color: subText }]}>Post not found.</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Reshare indicator */}
                    {data.isReshare && (
                        <View style={[styles.reshareLabel, { borderBottomColor: borderColor }]}>
                            <Ionicons name="repeat" size={14} color={subText} />
                            <Text style={[styles.reshareLabelText, { color: subText }]}>
                                {creatorName} reshared
                            </Text>
                        </View>
                    )}

                    {/* Author row */}
                    <View style={styles.authorRow}>
                        <TouchableOpacity
                            onPress={() => router.push(`/screens/profile/${creatorId}` as any)}
                        >
                            <Image source={{ uri: creatorAvatar }} style={styles.avatar} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                onPress={() => router.push(`/screens/profile/${creatorId}` as any)}
                            >
                                <Text style={[styles.displayName, { color: theme.text }]} numberOfLines={1}>
                                    {creatorName}
                                </Text>
                            </TouchableOpacity>
                            <Text style={[styles.handle, { color: subText }]}>{handle}</Text>
                        </View>
                        <TouchableOpacity style={styles.moreBtn}>
                            <Ionicons name="ellipsis-horizontal" size={18} color={subText} />
                        </TouchableOpacity>
                    </View>

                    {/* Post content */}
                    <View style={styles.contentBlock}>
                        {!!data.content && (
                            <Text style={[styles.postText, { color: theme.text }]}>
                                {data.content}
                            </Text>
                        )}

                        {/* Attached images */}
                        {images.length > 0 && (
                            <View style={[styles.imagesGrid, { borderColor }]}>
                                {images.map((uri: string, idx: number) => (
                                    <Image
                                        key={idx}
                                        source={{ uri }}
                                        style={[
                                            styles.gridImage,
                                            {
                                                width: images.length === 1 ? '100%' : '50%',
                                                height: images.length === 1 ? 260 : 160,
                                                borderColor,
                                                borderWidth: idx > 0 ? 0.5 : 0,
                                            }
                                        ]}
                                        resizeMode="cover"
                                    />
                                ))}
                            </View>
                        )}

                        {/* Attached video thumbnail */}
                        {!!data.videoUrl && (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={[styles.videoThumb, { borderColor }]}
                                onPress={() => router.push({ pathname: '/screens/reels/[id]', params: { id: data._id } } as any)}
                            >
                                <Image
                                    source={{
                                        uri: data.muxPlaybackId
                                            ? `https://image.mux.com/${data.muxPlaybackId}/thumbnail.jpg`
                                            : (data.thumbnailUrl || 'https://via.placeholder.com/400x225.png?text=Video')
                                    }}
                                    style={{ width: '100%', height: 220 }}
                                    resizeMode="cover"
                                />
                                <View style={styles.playOverlay}>
                                    <View style={styles.playCircle}>
                                        <Ionicons name="play" size={28} color="white" style={{ marginLeft: 4 }} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* Reshared post card */}
                        {parentPost && (
                            <View style={[styles.quoteCard, { borderColor, backgroundColor: isDark ? '#16181c' : '#f8fafc' }]}>
                                <View style={styles.quoteHeader}>
                                    <Image
                                        source={{ uri: parentAvatar }}
                                        style={styles.quoteAvatar}
                                    />
                                    <Text style={[styles.quoteDisplayName, { color: theme.text }]} numberOfLines={1}>
                                        {parentCreatorName}
                                    </Text>
                                    <View style={[styles.originalBadge, { backgroundColor: isDark ? '#2f3336' : '#e2e8f0' }]}>
                                        <Text style={[styles.originalBadgeText, { color: subText }]}>Original</Text>
                                    </View>
                                    <Text style={[styles.quoteTime, { color: subText }]}>
                                        · {formatRelative(parentPost.createdAt)}
                                    </Text>
                                </View>
                                {!!parentPost.content && (
                                    <Text style={[styles.quoteContent, { color: theme.text }]}>
                                        {parentPost.content}
                                    </Text>
                                )}
                                {(parentPost.images || []).length > 0 && (
                                    <View style={[styles.quoteImagesRow, { borderTopColor: borderColor }]}>
                                        {(parentPost.images as string[]).slice(0, 3).map((uri: string, i: number) => (
                                            <Image
                                                key={i}
                                                source={{ uri }}
                                                style={[
                                                    styles.quoteImage,
                                                    { borderLeftWidth: i > 0 ? 1 : 0, borderColor: borderColor }
                                                ]}
                                                resizeMode="cover"
                                            />
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Full timestamp */}
                    <View style={[styles.timestampRow, { borderTopColor: borderColor, borderBottomColor: borderColor }]}>
                        <Text style={[styles.timestampText, { color: subText }]}>
                            {formatFullDate(data.createdAt)}
                        </Text>
                    </View>

                    {/* Engagement counts */}
                    {(comments.length > 0 || reshares.length > 0 || likeCount > 0) && (
                        <View style={[styles.countsRow, { borderBottomColor: borderColor }]}>
                            {reshares.length > 0 && (
                                <View style={styles.countItem}>
                                    <Text style={[styles.countNum, { color: theme.text }]}>{reshares.length}</Text>
                                    <Text style={[styles.countLabel, { color: subText }]}>Reposts</Text>
                                </View>
                            )}
                            {likeCount > 0 && (
                                <View style={styles.countItem}>
                                    <Text style={[styles.countNum, { color: theme.text }]}>{likeCount}</Text>
                                    <Text style={[styles.countLabel, { color: subText }]}>Likes</Text>
                                </View>
                            )}
                            {comments.length > 0 && (
                                <View style={styles.countItem}>
                                    <Text style={[styles.countNum, { color: theme.text }]}>{comments.length}</Text>
                                    <Text style={[styles.countLabel, { color: subText }]}>Replies</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Action bar */}
                    <View style={[styles.actionBar, { borderBottomColor: borderColor }]}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="chatbubble-outline" size={22} color={subText} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => setShareVisible(true)}>
                            <Ionicons name="repeat-outline" size={24} color={subText} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
                            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                <Ionicons
                                    name={isLiked ? 'heart' : 'heart-outline'}
                                    size={22}
                                    color={isLiked ? '#E0245E' : subText}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => setShareVisible(true)}>
                            <Ionicons name="share-outline" size={22} color={subText} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="stats-chart-outline" size={20} color={subText} />
                        </TouchableOpacity>
                    </View>

                    {/* Comments section */}
                    {comments.length > 0 ? (
                        <View>
                            {comments.map((comment: any, idx: number) => {
                                const commentUser = comment.userId;
                                const commentName = commentUser?.profile?.fullName
                                    || commentUser?.recruiterProfile?.companyName
                                    || 'User';
                                const commentAvatar = commentUser?.avatar
                                    || `https://ui-avatars.com/api/?name=${commentName.replace(/\s+/g, '+')}`;
                                return (
                                    <View key={idx} style={[styles.commentRow, { borderBottomColor: borderColor }]}>
                                        <Image source={{ uri: commentAvatar }} style={styles.commentAvatar} />
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.commentMeta}>
                                                <Text style={[styles.commentName, { color: theme.text }]} numberOfLines={1}>
                                                    {commentName}
                                                </Text>
                                                <Text style={[styles.commentTime, { color: subText }]}>
                                                    · {formatRelative(comment.createdAt)}
                                                </Text>
                                            </View>
                                            <Text style={[styles.commentText, { color: theme.text }]}>
                                                {comment.text}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={styles.emptyComments}>
                            <Text style={[styles.emptyCommentsText, { color: subText }]}>
                                No replies yet. Be the first to reply.
                            </Text>
                        </View>
                    )}

                    <View style={{ height: 80 }} />
                </ScrollView>
            )}

            <ShareRepostModal
                visible={shareVisible}
                onClose={() => setShareVisible(false)}
                onSelect={handleShareSelect}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    emptyText: { fontFamily: 'Outfit-Regular', fontSize: 15 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 20,
    },
    backBtn: { padding: 2 },
    headerTitle: { fontFamily: 'Outfit-Bold', fontSize: 20 },

    // Reshare label strip
    reshareLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    reshareLabelText: { fontFamily: 'Outfit-Medium', fontSize: 13 },

    // Author
    authorRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 4,
        gap: 12,
    },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    displayName: { fontFamily: 'Outfit-Bold', fontSize: 16 },
    handle: { fontFamily: 'Outfit-Regular', fontSize: 14, marginTop: 1 },
    moreBtn: { padding: 4, marginTop: 2 },

    // Content
    contentBlock: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
    postText: { fontFamily: 'Outfit-Light', fontSize: 18, lineHeight: 26 },

    // Images grid
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
    },
    gridImage: {},

    // Video thumbnail
    videoThumb: {
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    // Quote / reshare card
    quoteCard: {
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
    },
    quoteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 6,
        gap: 6,
    },
    quoteAvatar: { width: 22, height: 22, borderRadius: 11 },
    quoteDisplayName: { fontFamily: 'Outfit-Bold', fontSize: 13, flexShrink: 1 },
    quoteTime: { fontFamily: 'Outfit-Regular', fontSize: 12 },
    originalBadge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
    originalBadgeText: { fontFamily: 'Outfit-Medium', fontSize: 10 },
    quoteContent: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 12,
        paddingBottom: 10,
    },
    quoteImagesRow: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    quoteImage: { flex: 1, height: 120 },

    // Timestamp
    timestampRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    timestampText: { fontFamily: 'Outfit-Regular', fontSize: 14 },

    // Counts
    countsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    countItem: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    countNum: { fontFamily: 'Outfit-Bold', fontSize: 15 },
    countLabel: { fontFamily: 'Outfit-Regular', fontSize: 14 },

    // Action bar
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    actionBtn: { padding: 10 },

    // Comments
    commentRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    commentAvatar: { width: 36, height: 36, borderRadius: 18, marginTop: 2 },
    commentMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    commentName: { fontFamily: 'Outfit-Bold', fontSize: 14, flexShrink: 1 },
    commentTime: { fontFamily: 'Outfit-Regular', fontSize: 12 },
    commentText: { fontFamily: 'Outfit-Regular', fontSize: 14, lineHeight: 20 },

    emptyComments: { paddingVertical: 32, alignItems: 'center' },
    emptyCommentsText: { fontFamily: 'Outfit-Regular', fontSize: 14 },
});
