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
        userId?: string;
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
        parentPost?: {
            user: string;
            avatar: string;
            content: string;
            attachments?: Array<{ type: 'image' | 'video'; url: string; thumbnail?: string }> | string[];
        };
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

    const [isLiked, setIsLiked] = useState(item?.isLiked || false);
    const [likeCount, setLikeCount] = useState(() => {
        if (!item) return 0;
        const likes = item.stats?.likes || '0';
        return (parseInt(likes.replace(/[^0-9.]/g, '')) || 0);
    });
    const [shareVisible, setShareVisible] = useState(false);
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
                        style={{ width: '100%', height: hp('25%') }}
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
                            height: attachments.length === 2 ? hp('20%') : (attachments.length >= 3 && index < 2 ? hp('18%') : hp('18%')),
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
                        <Image source={{ uri: item.avatar }} style={{ width: wp('12%'), height: wp('12%'), borderRadius: wp('6%') }} />
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

                    {item.parentPost && (
                        <View className="flex-row items-center mb-2" style={{ gap: 4 }}>
                            <Ionicons name="repeat" size={13} color="#71717a" />
                            <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 12 }}>
                                {item.user} reshared
                            </Text>
                        </View>
                    )}

                    <Text
                        numberOfLines={5}
                        ellipsizeMode="tail"
                        className="text-[15px] mb-3"
                        style={{ fontFamily: 'Outfit-Light', color: theme.text, lineHeight: 22 }}
                    >
                        {item.content}
                    </Text>

                    {item.parentPost && (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={{
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: isDark ? '#2f3336' : '#e2e8f0',
                                marginBottom: 12,
                                overflow: 'hidden',
                                backgroundColor: isDark ? '#16181c' : '#f8fafc'
                            }}
                        >
                            <View className="flex-row items-center px-3 pt-3 pb-2">
                                <Image
                                    source={{ uri: item.parentPost.avatar || `https://ui-avatars.com/api/?name=${item.parentPost.user}` }}
                                    style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
                                />
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 13 }} numberOfLines={1}>
                                    {item.parentPost.user}
                                </Text>
                                <View style={{ marginLeft: 6, backgroundColor: isDark ? '#2f3336' : '#e2e8f0', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                                    <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 10, color: '#71717a' }}>Original</Text>
                                </View>
                            </View>
                            {!!item.parentPost.content && (
                                <Text
                                    numberOfLines={5}
                                    ellipsizeMode="tail"
                                    style={{ fontFamily: 'Outfit-Regular', color: theme.text, fontSize: 13, lineHeight: 19, paddingHorizontal: 12, paddingBottom: item.parentPost.attachments?.length ? 8 : 12 }}
                                >
                                    {item.parentPost.content}
                                </Text>
                            )}
                            {(() => {
                                const atts = item.parentPost.attachments;
                                if (!atts || atts.length === 0) return null;
                                const imgUrls: string[] = atts
                                    .map((a: any) => typeof a === 'string' ? a : (a.type === 'image' ? a.url : a.thumbnail || a.url))
                                    .filter(Boolean);
                                if (imgUrls.length === 0) return null;
                                return (
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: isDark ? '#2f3336' : '#e2e8f0' }}>
                                        {imgUrls.slice(0, 3).map((uri: string, idx: number) => (
                                            <Image
                                                key={idx}
                                                source={{ uri }}
                                                style={{
                                                    flex: 1,
                                                    height: hp('15%'),
                                                    borderLeftWidth: idx > 0 ? 1 : 0,
                                                    borderColor: isDark ? '#2f3336' : '#e2e8f0'
                                                }}
                                                resizeMode="cover"
                                            />
                                        ))}
                                    </View>
                                );
                            })()}
                        </TouchableOpacity>
                    )}

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

                    <View className="flex-row justify-between pr-8 mt-1">
                        <TouchableOpacity onPress={handlePress} className="flex-row items-center">
                            <Ionicons name="chatbubble-outline" size={18} color="#71717a" />
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