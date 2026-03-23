import React, { useEffect, useState, useRef } from 'react';
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
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { feeds, posts as postsApi } from '@/app/data/api';
import { Colors } from '@/app/constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const commentInputRef = useRef<TextInput>(null);

    const DARK_GREEN = '#006400';

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await feeds.getFeedItem(id as string);
                const d = res.data;

                if (d.feedType === 'reel') {
                    router.replace({ pathname: '/screens/reels/[id]', params: { id: d._id } } as any);
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
            setLikeCount(p => (isLiked ? p + 1 : p - 1));
        }
    };

    const handleCommentPress = () => {
        commentInputRef.current?.focus();
    };

    const submitComment = async () => {
        if (!commentText.trim() || isSubmittingComment) return;
        setIsSubmittingComment(true);
        try {
            // Simulated API call - update based on your actual endpoint
            // await postsApi.comment(data._id, commentText);

            // Local update for UI responsiveness
            const newComment = {
                userId: currentUser,
                text: commentText,
                createdAt: new Date().toISOString()
            };
            setData((prev: any) => ({
                ...prev,
                comments: [newComment, ...(prev.comments || [])]
            }));

            setCommentText('');
            Toast.show({ type: 'success', text1: 'Comment posted!' });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to post comment' });
        } finally {
            setIsSubmittingComment(false);
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
        const diffInMs = now.getTime() - past.getTime();
        const mins = Math.floor(diffInMs / 60000);
        if (mins < 1) return 'now';
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    const borderColor = isDark ? '#2f3336' : '#eff3f4';
    const subText = '#71717a';

    const creatorName = data?.creatorId?.profile?.fullName
        || data?.creatorId?.recruiterProfile?.companyName
        || data?.recruiter?.recruiterProfile?.companyName
        || 'Unknown';
    const creatorAvatar = data?.creatorId?.avatar || data?.recruiter?.avatar
        || `https://ui-avatars.com/api/?name=${creatorName.replace(/\s+/g, '+')}`;
    const creatorId = data?.creatorId?._id || data?.creatorId?.id;
    const handle = `@${creatorName.replace(/\s+/g, '').toLowerCase()}`;

    const parentPost = data?.parentPostId;
    const isRepost = !!parentPost;
    const parentCreatorName = parentPost?.creatorId?.profile?.fullName
        || parentPost?.creatorId?.recruiterProfile?.companyName || 'User';
    const parentAvatar = parentPost?.creatorId?.avatar
        || `https://ui-avatars.com/api/?name=${parentCreatorName.replace(/\s+/g, '+')}`;

    const images: string[] = data?.images || [];
    const parentImages: string[] = parentPost?.images || [];
    const comments: any[] = data?.comments || [];

    const TEXT_LIMIT = 200;
    const shouldShowReadMore = (data?.content?.length || 0) > TEXT_LIMIT;
    const displayedContent = isExpanded ? data?.content : data?.content?.substring(0, TEXT_LIMIT);

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
                    <ActivityIndicator color={DARK_GREEN} size="large" />
                </View>
            ) : !data ? (
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={48} color={subText} />
                    <Text style={[styles.emptyText, { color: subText }]}>Post not found.</Text>
                </View>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('12%') }}>
                        {/* Reshare Label */}
                        {data.isReshare && (
                            <View style={styles.reshareLabel}>
                                <Ionicons name="repeat" size={14} color={subText} />
                                <Text style={[styles.reshareLabelText, { color: subText }]}>
                                    {creatorName} reshared
                                </Text>
                            </View>
                        )}

                        {/* Author Info */}
                        <View style={styles.authorRow}>
                            <TouchableOpacity onPress={() => router.push(`/screens/profile/${creatorId}` as any)}>
                                <Image source={{ uri: creatorAvatar }} style={styles.avatar} />
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => router.push(`/screens/profile/${creatorId}` as any)}>
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

                        {/* Main Content Block */}
                        <View style={styles.contentBlock}>
                            {!!data.content && (
                                <View>
                                    <Text style={[styles.postText, { color: theme.text }]}>
                                        {displayedContent}
                                        {!isExpanded && shouldShowReadMore && '...'}
                                    </Text>
                                    {shouldShowReadMore && (
                                        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ marginTop: 4 }}>
                                            <Text style={{ color: DARK_GREEN, fontFamily: 'Outfit-Bold' }}>
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {/* Main Post Images */}
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
                                                    height: images.length === 1 ? hp('30%') : hp('20%'),
                                                    borderColor,
                                                    borderWidth: idx > 0 ? 0.5 : 0,
                                                }
                                            ]}
                                            resizeMode="cover"
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Parent Post */}
                            {isRepost && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => router.push({ pathname: '/screens/feed/[id]', params: { id: parentPost._id } } as any)}
                                    style={[styles.quoteCard, { borderColor, backgroundColor: isDark ? '#16181c' : '#f8fafc' }]}
                                >
                                    <View style={styles.quoteHeader}>
                                        <Image source={{ uri: parentAvatar }} style={styles.quoteAvatar} />
                                        <Text style={[styles.quoteDisplayName, { color: theme.text }]} numberOfLines={1}>
                                            {parentCreatorName}
                                        </Text>
                                        <Text style={[styles.quoteTime, { color: subText }]}>
                                            · {formatRelative(parentPost.createdAt)}
                                        </Text>
                                    </View>
                                    {!!parentPost.content && (
                                        <Text style={[styles.quoteContent, { color: theme.text }]}>
                                            {parentPost.content}
                                        </Text>
                                    )}
                                    {parentImages.length > 0 && (
                                        <View style={[styles.parentImagesRow, { borderTopWidth: 0.5, borderTopColor: borderColor }]}>
                                            <Image
                                                source={{ uri: parentImages[0] }}
                                                style={{ width: '100%', height: hp('20%') }}
                                                resizeMode="cover"
                                            />
                                            {parentImages.length > 1 && (
                                                <View style={styles.parentImageCount}>
                                                    <Text style={styles.parentImageCountText}>+{parentImages.length - 1}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}

                            {/* Video Section */}
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
                                        style={{ width: '100%', height: hp('25%') }}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.playOverlay}>
                                        <View style={styles.playCircle}>
                                            <Ionicons name="play" size={28} color="white" style={{ marginLeft: 4 }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Timestamp Info */}
                        <View style={styles.timestampRow}>
                            <Text style={[styles.timestampText, { color: subText }]}>
                                {formatFullDate(data.createdAt)}
                            </Text>
                        </View>

                        {/* Stats Bar (X Style) */}
                        <View style={[styles.statsBar, { borderTopColor: borderColor, borderBottomColor: borderColor }]}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statNumber, { color: theme.text }]}>{data.reposts?.length || 0}</Text>
                                <Text style={[styles.statLabel, { color: subText }]}> Reposts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statNumber, { color: theme.text }]}>{likeCount}</Text>
                                <Text style={[styles.statLabel, { color: subText }]}> Likes</Text>
                            </View>
                        </View>

                        {/* Engagement Actions */}
                        <View style={[styles.actionBar, { borderBottomColor: borderColor }]}>
                            <TouchableOpacity style={styles.actionBtn} onPress={handleCommentPress}>
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
                        </View>

                        {/* Comments List */}
                        {comments.length > 0 ? (
                            <View>
                                {comments.map((comment: any, idx: number) => {
                                    const commentUser = comment.userId;
                                    const commentName = commentUser?.profile?.fullName || commentUser?.fullName || 'User';
                                    const commentAvatar = commentUser?.avatar || `https://ui-avatars.com/api/?name=${commentName.replace(/\s+/g, '+')}`;
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
                                                <View style={styles.commentActions}>
                                                    <TouchableOpacity style={styles.commentActionBtn}>
                                                        <Ionicons name="heart-outline" size={14} color={subText} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.commentActionBtn}>
                                                        <Ionicons name="chatbubble-outline" size={14} color={subText} />
                                                    </TouchableOpacity>
                                                </View>
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
                    </ScrollView>

                    {/* Bottom Reply Input */}
                    <View style={[styles.bottomInputContainer, { backgroundColor: theme.background, borderTopColor: borderColor }]}>
                        <Image source={{ uri: currentUser?.avatar }} style={styles.smallAvatar} />
                        <TextInput
                            ref={commentInputRef}
                            style={[styles.input, { color: theme.text, backgroundColor: isDark ? '#16181c' : '#f0f2f5' }]}
                            placeholder="Post your reply"
                            placeholderTextColor={subText}
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={submitComment}
                            disabled={!commentText.trim() || isSubmittingComment}
                            style={styles.sendBtn}
                        >
                            {isSubmittingComment ? (
                                <ActivityIndicator size="small" color={DARK_GREEN} />
                            ) : (
                                <Text style={[styles.sendText, { opacity: commentText.trim() ? 1 : 0.5 }]}>Reply</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 20,
    },
    backBtn: { padding: 2 },
    headerTitle: { fontFamily: 'Outfit-Bold', fontSize: 20 },
    reshareLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('14%'),
        paddingTop: 8,
        gap: 6,
    },
    reshareLabelText: { fontFamily: 'Outfit-Medium', fontSize: 13 },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: wp('4%'),
        paddingTop: 14,
        paddingBottom: 4,
        gap: 12,
    },
    avatar: { width: wp('12%'), height: wp('12%'), borderRadius: wp('6%') },
    displayName: { fontFamily: 'Outfit-Bold', fontSize: 16 },
    handle: { fontFamily: 'Outfit-Regular', fontSize: 14, marginTop: 1 },
    moreBtn: { padding: 4, marginTop: 2 },
    contentBlock: { paddingHorizontal: wp('4%'), paddingTop: 12, gap: 12 },
    postText: { fontFamily: 'Outfit-Light', fontSize: 18, lineHeight: 26 },
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
    },
    gridImage: {},
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
    quoteCard: {
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
        marginTop: 4,
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
    quoteContent: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 12,
        paddingBottom: 10,
    },
    parentImagesRow: { position: 'relative' },
    parentImageCount: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    parentImageCountText: { color: 'white', fontSize: 10, fontFamily: 'Outfit-Bold' },
    timestampRow: {
        paddingHorizontal: wp('4%'),
        paddingVertical: 12,
        marginTop: 12,
    },
    timestampText: { fontFamily: 'Outfit-Regular', fontSize: 14 },
    statsBar: {
        flexDirection: 'row',
        paddingHorizontal: wp('4%'),
        paddingVertical: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 20,
    },
    statItem: { flexDirection: 'row', alignItems: 'center' },
    statNumber: { fontFamily: 'Outfit-Bold', fontSize: 14 },
    statLabel: { fontFamily: 'Outfit-Regular', fontSize: 14 },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    actionBtn: { padding: 10 },
    commentRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: wp('4%'),
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    commentAvatar: { width: 36, height: 36, borderRadius: 18, marginTop: 2 },
    commentMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    commentName: { fontFamily: 'Outfit-Bold', fontSize: 14, flexShrink: 1 },
    commentTime: { fontFamily: 'Outfit-Regular', fontSize: 12 },
    commentText: { fontFamily: 'Outfit-Regular', fontSize: 14, lineHeight: 20 },
    commentActions: { flexDirection: 'row', marginTop: 8, gap: 20 },
    commentActionBtn: { padding: 2 },
    emptyComments: { paddingVertical: 32, alignItems: 'center' },
    emptyCommentsText: { fontFamily: 'Outfit-Regular', fontSize: 14 },
    bottomInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        gap: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    smallAvatar: { width: 32, height: 32, borderRadius: 16 },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontFamily: 'Outfit-Regular',
        fontSize: 15,
        maxHeight: 100,
    },
    sendBtn: { paddingHorizontal: 12 },
    sendText: { color: '#006400', fontFamily: 'Outfit-Bold', fontSize: 15 },
});