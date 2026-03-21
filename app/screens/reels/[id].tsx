import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus, Audio } from 'expo-av';
import { feeds } from '@/app/data/api';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

const ReelPlayer = ({ item, isVisible }: { item: any, isVisible: boolean }) => {
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

    useEffect(() => {
        const prepareAudio = async () => {
             await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        };
        prepareAudio();
    }, []);

    useEffect(() => {
        if (isVisible) {
            videoRef.current?.playAsync();
        } else {
            videoRef.current?.pauseAsync();
            videoRef.current?.setPositionAsync(0);
        }
    }, [isVisible]);

    const togglePlayPause = () => {
        if (status?.isLoaded) {
            status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync();
        }
    };

    return (
        <View style={{ width, height, backgroundColor: '#000' }}>
            <TouchableOpacity activeOpacity={1} onPress={togglePlayPause} style={{ flex: 1 }}>
                <Video
                    ref={videoRef}
                    source={{ uri: item.videoUrl || item.attachments?.[0]?.url }}
                    style={{ flex: 1 }}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />

                {/* Gradient Overlay for Text Readability */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%' }}
                />

                {/* Right Side Actions */}
                <View style={{ position: 'absolute', right: 16, bottom: 100, alignItems: 'center', gap: 24 }}>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Ionicons name="heart" size={36} color="white" />
                        <Text style={{ color: 'white', marginTop: 4, fontFamily: 'Outfit-Bold' }}>{item.likes?.length || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Ionicons name="chatbubble" size={32} color="white" />
                        <Text style={{ color: 'white', marginTop: 4, fontFamily: 'Outfit-Bold' }}>{item.comments?.length || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Ionicons name="share-social" size={32} color="white" />
                        <Text style={{ color: 'white', marginTop: 4, fontFamily: 'Outfit-Bold' }}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Info Info */}
                <View style={{ position: 'absolute', bottom: 40, left: 16, right: 80 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Outfit-Bold', marginBottom: 8 }}>
                        @{item.user || item.creatorId?.profile?.fullName || 'User'}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Outfit-Regular' }} numberOfLines={3}>
                        {item.description || item.title || item.content}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default function ReelsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [reels, setReels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeViewableItem, setActiveViewableItem] = useState(id);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                // Fetch the feed and extract all reels to allow swiping
                const res = await feeds.getFeed(1, 50);
                let availableReels = res.data.filter((item: any) => item.feedType === 'reel');
                
                // Fetch the specific reel clicked if it's not in the aggregated feed
                if (!availableReels.find((r: any) => r._id === id)) {
                    const singleRes = await feeds.getFeedItem(id as string, 'reel');
                    if (singleRes.data) {
                        availableReels = [singleRes.data, ...availableReels];
                    }
                } else {
                    // Sort so the clicked reel is at index 0
                    const clickedIdx = availableReels.findIndex((r: any) => r._id === id);
                    if (clickedIdx > 0) {
                        const clicked = availableReels.splice(clickedIdx, 1)[0];
                        availableReels.unshift(clicked);
                    }
                }
                
                setReels(availableReels);
            } catch (error) {
                console.error('Error fetching reels', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReels();
    }, [id]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveViewableItem(viewableItems[0].key);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#84CC16" size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <TouchableOpacity 
                style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
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
                viewabilityConfig={viewabilityConfig}
                windowSize={5}
                maxToRenderPerBatch={3}
            />
        </View>
    );
}
