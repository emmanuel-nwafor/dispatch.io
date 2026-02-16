import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import ShareRepostModal from '../modals/ShareRepostModal';

interface FeedItemProps {
    item: {
        id: number | string;
        type: 'job' | 'post';
        user: string;
        handle: string;
        avatar: string;
        time: string;
        content: string;
        jobRole?: string;
        salary?: string;
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
    onPress?: () => void;
    onApply?: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ item, onPress, onApply }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    // State for local interaction
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(parseInt(item.stats.likes.replace(/[^0-9.]/g, '')) || 0);
    const [shareVisible, setShareVisible] = useState(false);

    // Animation value for the heart scale
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);
        setLikeCount(prev => newLikedStatus ? prev + 1 : prev - 1);

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.3,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleShareSelect = (option: string) => {
        console.log('Action selected:', option, 'for item:', item.id);
        // Logic for specific options (copy, quote, etc.) would go here
    };

    const toggleShareModal = () => {
        Haptics.selectionAsync();
        setShareVisible(!shareVisible);
    };

    const renderAttachments = () => {
        if (!item.attachments || item.attachments.length === 0) return null;

        const attachments = item.attachments;

        if (attachments.length === 1) {
            const attachment = attachments[0];
            return (
                <View className="mb-3 rounded-2xl overflow-hidden border" style={{ borderColor: isDark ? '#2f3336' : '#eff3f4' }}>
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
                </View>
            );
        }

        return (
            <View className="flex-row flex-wrap mb-3 rounded-2xl overflow-hidden border" style={{ borderColor: isDark ? '#2f3336' : '#eff3f4' }}>
                {attachments.map((att, index) => (
                    <View
                        key={index}
                        style={{
                            width: attachments.length === 2 ? '50%' : (attachments.length >= 3 && index < 2 ? '50%' : '100%'),
                            height: attachments.length === 2 ? 200 : (attachments.length >= 3 && index < 2 ? 150 : 150),
                            borderWidth: 0.5,
                            borderColor: isDark ? '#2f3336' : '#eff3f4'
                        }}
                    >
                        <Image source={{ uri: att.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    </View>
                ))}
            </View>
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={[styles.tweetContainer, { borderBottomColor: isDark ? '#2f3336' : '#eff3f4' }]}
        >
            <View className="flex-row px-4 py-4">
                {/* Left Column: Avatar */}
                <View className="mr-3">
                    <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full" />
                </View>

                {/* Right Column: Content */}
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
                        <TouchableOpacity
                            onPress={onApply}
                            className="rounded-2xl border mb-3 overflow-hidden"
                            style={{ borderColor: isDark ? '#2f3336' : '#cfd9de' }}
                        >
                            <View className="p-3" style={{ backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }}>
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>{item.jobRole}</Text>
                                <Text className="text-zinc-500 text-xs" style={{ fontFamily: 'Outfit-Medium' }}>{item.salary} • Remote</Text>
                                <View className="mt-2 bg-zinc-500/10 self-start px-3 py-1 rounded-full">
                                    <Text style={{ fontSize: 10, color: theme.brand, fontFamily: 'Outfit-Bold' }}>APPLY NOW</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Interaction Bar */}
                    <View className="flex-row justify-between pr-8 mt-1">
                        <TouchableOpacity className="flex-row items-center">
                            <Ionicons name="chatbubble-outline" size={18} color="#71717a" />
                            <Text className="ml-2 text-xs text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>{item.stats.comments}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={toggleShareModal}
                        >
                            <Ionicons name="repeat-outline" size={20} color="#71717a" />
                            <Text className="ml-2 text-xs text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>{item.stats.reposts}</Text>
                        </TouchableOpacity>

                        {/* Animated Heart Like Button */}
                        <TouchableOpacity
                            onPress={handleLike}
                            activeOpacity={0.7}
                            className="flex-row items-center"
                        >
                            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={18}
                                    color={isLiked ? "#E0245E" : "#71717a"}
                                />
                            </Animated.View>
                            <Text
                                className="ml-2 text-xs"
                                style={{
                                    fontFamily: 'Outfit-Medium',
                                    color: isLiked ? "#E0245E" : "#71717a"
                                }}
                            >
                                {likeCount}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleShareModal}>
                            <Ionicons name="share-outline" size={18} color="#71717a" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Bottom Sheet Modal for Reshare/Share Actions */}
            <ShareRepostModal
                visible={shareVisible}
                onClose={() => setShareVisible(false)}
                onSelect={handleShareSelect}
            />
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