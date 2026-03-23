import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { user as userApi, posts as postsApi, User } from '@/app/data/api';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Constants for restrictions
const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_TOTAL_MEDIA = 4;

export default function PostScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    const [postContent, setPostContent] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                try {
                    const res = await userApi.getMe();
                    if (res.success) setUser(res.user);
                } catch (err) {
                    console.error("User fetch error:", err);
                }
            };
            fetchUser();
        }, [])
    );

    const pickMedia = async (type: 'images' | 'video') => {
        if (selectedMedia.length >= MAX_TOTAL_MEDIA) {
            Toast.show({
                type: 'info',
                text1: 'Limit Reached',
                text2: `You can only upload up to ${MAX_TOTAL_MEDIA} items.`
            });
            return;
        }

        // Logic: Usually posts allow multiple images OR one video. 
        // We'll restrict to 1 video if video is chosen.
        if (type === 'video' && selectedMedia.some(m => m.type === 'video')) {
            Toast.show({ type: 'info', text1: 'Limit Reached', text2: 'Only one video per post.' });
            return;
        }

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: type === 'images' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
                allowsMultipleSelection: type === 'images',
                selectionLimit: MAX_TOTAL_MEDIA - selectedMedia.length,
                quality: 0.7,
            });

            if (!result.canceled) {
                const filteredAssets = result.assets.filter(asset => {
                    const sizeInMB = (asset.fileSize || 0) / (1024 * 1024);
                    const isVideo = asset.type === 'video';
                    const limit = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;

                    if (sizeInMB > limit) {
                        Toast.show({
                            type: 'error',
                            text1: 'File too large',
                            text2: `${asset.fileName || 'Item'} exceeds ${limit}MB limit.`
                        });
                        return false;
                    }
                    return true;
                });

                setSelectedMedia(prev => [...prev, ...filteredAssets]);
            }
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not access library' });
        }
    };

    const removeMedia = (index: number) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        const updatedMedia = [...selectedMedia];
        updatedMedia.splice(index, 1);
        setSelectedMedia(updatedMedia);
    };

    const handlePost = async () => {
        if (!postContent.trim() && selectedMedia.length === 0) {
            Alert.alert("Empty Post", "Please add some text or media to share.");
            return;
        }

        if (postContent.length > 280) {
            Alert.alert("Post Too Long", "Please keep your content under 280 characters.");
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('content', postContent);

            selectedMedia.forEach((asset, index) => {
                const filename = asset.uri.split('/').pop() || (asset.type === 'video' ? `video_${index}.mp4` : `image_${index}.jpg`);
                const match = /\.(\w+)$/.exec(filename);
                const fileType = asset.type === 'video'
                    ? (match ? `video/${match[1]}` : 'video/mp4')
                    : (match ? `image/${match[1]}` : 'image/jpeg');

                formData.append(asset.type === 'video' ? 'video' : 'images', {
                    uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
                    name: filename,
                    type: fileType,
                } as any);
            });

            const res = await postsApi.create(formData);

            if (res.success) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setPostContent('');
                setSelectedMedia([]);
                Toast.show({ type: 'success', text1: 'Shared!', text2: 'Your post is now live.' });
                router.back();
            } else {
                throw new Error(res.message || "Failed to upload post");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
            Toast.show({
                type: 'error',
                text1: 'Posting Failed',
                text2: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header Navigation */}
                <View className="flex-row items-center justify-between px-6 py-3 border-b"
                    style={{ borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={wp('7%')} color={theme.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlePost}
                        disabled={(!postContent.trim() && selectedMedia.length === 0) || loading}
                        style={{
                            backgroundColor: (postContent.trim() || selectedMedia.length > 0) && !loading ? '#006400' : '#71717a',
                            paddingHorizontal: wp('5%'),
                            paddingVertical: hp('1%'),
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        {loading && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
                        <Text style={{ fontFamily: 'Outfit-Bold', color: '#fff', fontSize: wp('3.5%') }}>
                            {loading ? 'Sharing...' : 'Post'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: wp('5%') }}>
                        {/* User Identity */}
                        <View className="flex-row items-center mb-6">
                            <Image
                                source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=006400&color=fff' }}
                                style={{ width: wp('12%'), height: wp('12%'), borderRadius: wp('6%'), marginRight: 12, backgroundColor: '#27272a' }}
                            />
                            <View>
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: wp('4%') }}>
                                    {user?.profile?.fullName || 'Anonymous User'}
                                </Text>
                                <View className="flex-row items-center mt-1 border px-2 py-0.5 rounded-full"
                                    style={{ borderColor: '#71717a', alignSelf: 'flex-start' }}>
                                    <Ionicons name="earth-outline" size={12} color="#71717a" />
                                    <Text className="ml-1" style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 10 }}>Public</Text>
                                </View>
                            </View>
                        </View>

                        {/* Input Area */}
                        <TextInput
                            multiline
                            placeholder="What's on your mind? Share an update..."
                            placeholderTextColor="#71717a"
                            value={postContent}
                            onChangeText={setPostContent}
                            maxLength={280}
                            style={{
                                color: theme.text,
                                fontFamily: 'Outfit-Medium',
                                fontSize: wp('4.5%'),
                                minHeight: hp('15%'),
                                textAlignVertical: 'top',
                            }}
                        />

                        {/* Media Grid Preview */}
                        {selectedMedia.length > 0 && (
                            <View className="flex-row flex-wrap justify-between mt-4">
                                {selectedMedia.map((asset, index) => (
                                    <View key={index} style={{ width: selectedMedia.length === 1 ? '100%' : '48%', marginBottom: 12 }}>
                                        <Image
                                            source={{ uri: asset.uri }}
                                            style={{ width: '100%', height: wp('45%'), borderRadius: 16, backgroundColor: '#27272a' }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => removeMedia(index)}
                                            style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, padding: 4 }}
                                        >
                                            <Ionicons name="close-circle" size={20} color="#fff" />
                                        </TouchableOpacity>

                                        {asset.type === 'video' && (
                                            <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                                                <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Outfit-Bold' }}>VIDEO</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer Toolbar */}
                    <View className="border-t px-6 py-4 flex-row items-center"
                        style={{ borderTopColor: isDark ? '#27272a' : '#f4f4f5', backgroundColor: theme.background, paddingBottom: Platform.OS === 'ios' ? hp('2%') : hp('4%') }}>

                        <TouchableOpacity onPress={() => pickMedia('images')} className="mr-6" disabled={loading}>
                            <Ionicons name="image-outline" size={26} color="#006400" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => pickMedia('video')} className="mr-6" disabled={loading}>
                            <Ionicons name="videocam-outline" size={26} color="#3b82f6" />
                        </TouchableOpacity>

                        <TouchableOpacity className="mr-6" disabled={loading}>
                            <Ionicons name="location-outline" size={24} color="#ef4444" />
                        </TouchableOpacity>

                        <View style={{ flex: 1 }} />

                        <View className="items-end">
                            <Text style={{
                                fontFamily: 'Outfit-Bold',
                                color: postContent.length >= 280 ? '#ef4444' : '#71717a',
                                fontSize: 12
                            }}>
                                {postContent.length}/280
                            </Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}