import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, useColorScheme, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import * as Haptics from 'expo-haptics';
import ShareRepostModal from '../modals/ShareRepostModal';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { posts } from '@/app/data/api';
import Toast from 'react-native-toast-message';

// --- Skeleton Component ---
const Skeleton = ({ width, height, borderRadius = 8, style }: any) => {
    const isDark = useColorScheme() === 'dark';
    const shimmerValue = useRef(new Animated.Value(0)).current;

    const backgroundColor = isDark ? '#1E2123' : '#E1E1E1';
    const highlightColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)';

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const animatedTranslateX = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-wp('100%'), wp('100%')],
    });

    return (
        <View style={[{ width, height, borderRadius, backgroundColor, overflow: 'hidden' }, style]}>
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: animatedTranslateX }] }]}>
                <LinearGradient
                    colors={['transparent', highlightColor, 'transparent']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </View>
    );
};

interface FeedItemProps {
    item?: {
        id: number | string;
        type: 'job' | 'post' | 'reel' | 'candidate';
        userId?: string; // ID for navigation
        user: string;
        handle: string;
        avatar: string;
        time: string;
        content: string;
        isLiked?: boolean;
        isReshared?: boolean;
        jobRole?: string;
        salary?: string;
        location?: string;
        stats: {
            comments: string;
            reposts: string;
            likes: string;
        };
        attachments?: Array<{
            type: 'image' | 'video';
            url: string;
            thumbnail?: string;
        }>;
    };
    loading?: boolean;
    onPress?: () => void;
    onApply?: () => void;
    onVideoPress?: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ item, loading, onPress, onApply, onVideoPress }) => {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    // State for local interaction
    const [isLiked, setIsLiked] = useState(item?.isLiked || false);
    const [likeCount, setLikeCount] = useState(() => {
        if (!item) return 0;
        const likes = item.stats?.likes || '0';
        return (parseInt(likes.replace(/[^0-9.]/g, '')) || 0);
    });
    const [shareVisible, setShareVisible] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    if (loading || !item) {
        return (
            <View style={[styles.tweetContainer, { borderBottomColor: isDark ? '#2f3336' : '#eff3f4' }]}>
                <View className="flex-row px-4 py-4">
                    <View className="mr-3">
                        <Skeleton width={wp('12%')} height={wp('12%')} borderRadius={wp('6%')} />
                    </View>
                    <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                            <Skeleton width={wp('30%')} height={15} borderRadius={4} style={{ marginRight: 8 }} />
                            <Skeleton width={wp('20%')} height={15} borderRadius={4} />
                        </View>
                        <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                        <Skeleton width="85%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />
                        <Skeleton width="100%" height={hp('25%')} borderRadius={16} style={{ marginBottom: 16 }} />
                        <View className="flex-row justify-between pr-8">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} width={wp('8%')} height={12} borderRadius={4} />
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const handleLike = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const newLikedStatus = !isLiked;
            setIsLiked(newLikedStatus);
            setLikeCount(prev => newLikedStatus ? prev + 1 : prev - 1);

            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
            ]).start();

            await posts.like(item.id.toString());
        } catch (error) {
            console.error('Failed to like post:', error);
            setIsLiked(prev => !prev);
            setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
        }
    };

    const handleShareSelect = async (option: string) => {
        if (option === 'repost') {
            try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                await posts.reshare(item.id.toString());
                Toast.show({ type: 'success', text1: 'Post reshared!' });
            } catch (error) {
                console.error('Failed to reshare post:', error);
                Toast.show({ type: 'error', text1: 'Failed to reshare' });
            }
        }
    };

    const toggleShareModal = () => {
        Haptics.selectionAsync();
        setShareVisible(!shareVisible);
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;
        setIsSubmittingComment(true);
        try {
            const res = await posts.comment(item.id.toString(), commentText);
            if (res.success) {
                setCommentText('');
                setIsCommenting(false);
                Toast.show({ type: 'success', text1: 'Comment added' });
            }
        } catch (error) {
            console.error('Failed to comment:', error);
            Toast.show({ type: 'error', text1: 'Failed to add comment' });
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handlePress = () => {
        router.push(`/screens/feed/${item.id}`);
    };

    const handleVideoPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({ pathname: "/screens/reels/[id]", params: { id: item.id } } as any);
    };

    const renderAttachments = () => {
        if (!item.attachments || item.attachments.length === 0) return null;
        const attachments = item.attachments;

        if (attachments.length === 1) {
            const attachment = attachments[0];
            return (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={attachment.type === 'video' ? handleVideoPress : handlePress}
                    className="mb-3 rounded-2xl overflow-hidden border"
                    style={{ borderColor: isDark ? '#2f3336' : '#eff3f4' }}
                >
                    <Image
                        source={{ uri: attachment.type === 'video' ? attachment.thumbnail : attachment.url }}
                        style={{ width: '100%', height: 200 }}
                        resizeMode="cover"
                    />
                    {attachment.type === 'video' && (
                        <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-black/20">
                            <View className="w-12 h-12 rounded-full bg-black/60 items-center justify-center border border-white/20">
                                <Ionicons name="play" size={24} color="white" style={{ marginLeft: 4 }} />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            );
        }

        return (
            <View className="flex-row flex-wrap mb-3 rounded-2xl overflow-hidden border" style={{ borderColor: isDark ? '#2f3336' : '#eff3f4' }}>
                {attachments.map((att, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.9}
                        onPress={att.type === 'video' ? handleVideoPress : handlePress}
                        style={{
                            width: attachments.length === 2 ? '50%' : (attachments.length >= 3 && index < 2 ? '50%' : '100%'),
                            height: attachments.length === 2 ? 200 : (attachments.length >= 3 && index < 2 ? 150 : 150),
                            borderWidth: 0.5,
                            borderColor: isDark ? '#2f3336' : '#eff3f4'
                        }}
                    >
                        <Image source={{ uri: att.type === 'video' ? att.thumbnail : att.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        {att.type === 'video' && (
                            <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-black/20">
                                <View className="w-10 h-10 rounded-full bg-black/60 items-center justify-center border border-white/20">
                                    <Ionicons name="play" size={20} color="white" style={{ marginLeft: 3 }} />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            style={[styles.tweetContainer, { borderBottomColor: isDark ? '#2f3336' : '#eff3f4' }]}
        >
            <View className="flex-row px-4 py-4">
                <TouchableOpacity onPress={() => router.push(`/screens/profile/${item.userId || item.user}` as any)}>
                    <View className="mr-3">
                        <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full" />
                    </View>
                </TouchableOpacity>

                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <Text numberOfLines={1} className="text-[15px] mr-1" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>
                            {item.user}
                        </Text>
                        <Text className="text-zinc-500 text-[14px]" style={{ fontFamily: 'Outfit-Regular' }}>
                            {item.handle} • {item.time}
                        </Text>
                        <TouchableOpacity className="ml-auto">
                            <Ionicons name="ellipsis-horizontal" size={16} color="#71717a" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-[15px] mb-3" style={{ fontFamily: 'Outfit-Light', color: theme.text, lineHeight: 22 }}>
                        {item.content}
                    </Text>

                    {renderAttachments()}

                    {item.type === 'job' && (
                        <TouchableOpacity onPress={onApply} className="rounded-2xl border mb-3 overflow-hidden" style={{ borderColor: isDark ? '#2f3336' : '#cfd9de' }}>
                            <View className="p-3" style={{ backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }}>
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>{item.jobRole}</Text>
                                <Text className="text-zinc-500 text-xs" style={{ fontFamily: 'Outfit-Medium' }}>{item.salary} • {item.location || 'Remote'}</Text>
                                <View className="mt-2 bg-zinc-500/10 self-start px-3 py-1 rounded-full">
                                    <Text style={{ fontSize: 10, color: theme.brand, fontFamily: 'Outfit-Bold' }}>APPLY NOW</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Interaction Bar */}
                    <View className="flex-row justify-between pr-8 mt-1">
                        <TouchableOpacity onPress={() => setIsCommenting(!isCommenting)} className="flex-row items-center">
                            <Ionicons name="chatbubble-outline" size={18} color={isCommenting ? theme.brand : "#71717a"} />
                            <Text className="ml-2 text-xs text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>{item.stats?.comments || '0'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center" onPress={toggleShareModal}>
                            <Ionicons name="repeat-outline" size={20} color="#71717a" />
                            <Text className="ml-2 text-xs text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>{item.stats?.reposts || '0'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleLike} activeOpacity={0.7} className="flex-row items-center">
                            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={isLiked ? "#E0245E" : "#71717a"} />
                            </Animated.View>
                            <Text className="ml-2 text-xs" style={{ fontFamily: 'Outfit-Medium', color: isLiked ? "#E0245E" : "#71717a" }}>{likeCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleShareModal}>
                            <Ionicons name="share-outline" size={18} color="#71717a" />
                        </TouchableOpacity>
                    </View>

                    {/* Comment Input */}
                    {isCommenting && (
                        <View className="mt-4 flex-row items-center">
                            <TextInput
                                value={commentText}
                                onChangeText={setCommentText}
                                placeholder="Add a comment..."
                                placeholderTextColor="#71717a"
                                className="flex-1 p-2 rounded-xl bg-zinc-500/10"
                                style={{ color: theme.text, fontFamily: 'Outfit-Regular' }}
                                multiline
                            />
                            <TouchableOpacity 
                                onPress={handleCommentSubmit} 
                                disabled={isSubmittingComment || !commentText.trim()}
                                className="ml-2 p-2"
                            >
                                {isSubmittingComment ? (
                                    <ActivityIndicator size="small" color={theme.brand} />
                                ) : (
                                    <Ionicons name="send" size={20} color={commentText.trim() ? theme.brand : "#71717a"} />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <ShareRepostModal visible={shareVisible} onClose={() => setShareVisible(false)} onSelect={handleShareSelect} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tweetContainer: {
        width: '100%',
        borderBottomWidth: 1,
    },
});

export default FeedItem;