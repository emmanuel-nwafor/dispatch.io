import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { user as userApi, posts as postsApi, reels as reelsApi, User } from '@/app/data/api';
import { useFocusEffect } from '@react-navigation/native';

export default function PostScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    const [postContent, setPostContent] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                const res = await userApi.getMe();
                if (res.success) setUser(res.user);
            };
            fetchUser();
        }, [])
    );

    const pickMedia = async (type: 'images' | 'video') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: type === 'images' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            allowsMultipleSelection: type === 'images',
            selectionLimit: 4 - selectedMedia.length,
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedMedia([...selectedMedia, ...result.assets]);
        }
    };

    const removeMedia = (index: number) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        const updatedMedia = [...selectedMedia];
        updatedMedia.splice(index, 1);
        setSelectedMedia(updatedMedia);
    };

    const [uploadProgress, setUploadProgress] = useState(0);

    const handlePost = async () => {
        if (!postContent.trim() && selectedMedia.length === 0) {
            Alert.alert("Empty Post", "Please add some text or media to share.");
            return;
        }

        setLoading(true);
        setUploadProgress(0);
        try {
            const hasVideo = selectedMedia.some(m => m.type === 'video');

            if (hasVideo) {
                // Handle as Reel via Mux Direct Upload
                const videoAsset = selectedMedia.find(m => m.type === 'video');
                if (!videoAsset) throw new Error("Video asset not found");

                // 1. Get Upload URL
                const { data: { uploadUrl, uploadId } } = await reelsApi.getUploadUrl();

                // 2. Direct Binary Upload to Mux via XHR (for progress)
                const response = await fetch(videoAsset.uri);
                const blob = await response.blob();

                await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', uploadUrl);
                    xhr.setRequestHeader('Content-Type', videoAsset.type || 'video/mp4');

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            setUploadProgress(progress);
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response);
                        } else {
                            reject(new Error(`Upload failed with status ${xhr.status}`));
                        }
                    };

                    xhr.onerror = () => reject(new Error("Mux upload failed"));
                    xhr.send(blob);
                });

                // 3. Create Reel Record in our Backend
                const res = await reelsApi.create({
                    title: postContent.slice(0, 50) || 'New Reel',
                    description: postContent,
                    type: 'seeker_pitch',
                    muxUploadId: uploadId,
                });

                if (res.success) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Alert.alert("Success", "Reel uploaded and processing!");
                    router.back();
                }
            } else {
                // Handle as Post (Images/Text) via Cloudinary
                const formData = new FormData();
                formData.append('content', postContent);

                selectedMedia.forEach((asset, index) => {
                    const filename = asset.uri.split('/').pop() || `image_${index}.jpg`;
                    const match = /\.(\w+)$/.exec(filename);
                    const fileType = match ? `image/${match[1]}` : `image/jpeg`;

                    formData.append('images', {
                        uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
                        name: filename,
                        type: fileType,
                    } as any);
                });

                const res = await postsApi.create(formData);
                if (res.success) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Alert.alert("Success", "Post shared successfully!");
                    router.back();
                }
            }
        } catch (error: any) {
            console.error("Posting Error:", error);
            Alert.alert("Error", error.message || "Failed to share post. Please try again.");
        } finally {
            setLoading(false);
            setUploadProgress(0);
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
                        <Ionicons name="close" size={28} color={theme.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlePost}
                        disabled={(!postContent.trim() && selectedMedia.length === 0) || loading}
                        style={{
                            backgroundColor: (postContent.trim() || selectedMedia.length > 0) && !loading ? theme.brand : '#71717a',
                            paddingHorizontal: 20,
                            paddingVertical: 8,
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        {loading && <ActivityIndicator size="small" color="#000" style={{ marginRight: 8 }} />}
                        <Text style={{ fontFamily: 'Outfit-Bold', color: '#000' }}>
                            {loading ? 'Sharing...' : 'Post'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
                        {/* User Identity Section */}
                        <View className="flex-row items-center mb-6">
                            <Image
                                source={{ uri: user?.avatar || 'https://i.pravatar.cc/100' }}
                                style={{ width: 45, height: 45, borderRadius: 25, marginRight: 12, backgroundColor: '#27272a' }}
                            />
                            <View>
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 16 }}>
                                    {user?.profile?.fullName || 'Anonymous'}
                                </Text>
                                <TouchableOpacity className="flex-row items-center mt-1 border px-2 py-0.5 rounded-full"
                                    style={{ borderColor: '#71717a' }}>
                                    <Ionicons name="earth-outline" size={12} color="#71717a" />
                                    <Text className="ml-1" style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 11 }}>Anyone</Text>
                                    <Ionicons name="chevron-down" size={12} color="#71717a" className="ml-1" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Input Area */}
                        <TextInput
                            multiline
                            placeholder="What's on your mind? Share a job update or tech tip..."
                            placeholderTextColor="#71717a"
                            value={postContent}
                            onChangeText={setPostContent}
                            style={{
                                color: theme.text,
                                fontFamily: 'Outfit-Medium',
                                fontSize: 18,
                                minHeight: 120,
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
                                            style={{ width: '100%', height: wp('40%'), borderRadius: 16 }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => removeMedia(index)}
                                            style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, padding: 4 }}
                                        >
                                            <Ionicons name="close-circle" size={20} color="#fff" />
                                        </TouchableOpacity>
                                        {asset.type === 'video' && (
                                            <>
                                                <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 6 }}>
                                                    <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Outfit-Bold' }}>VIDEO</Text>
                                                </View>
                                                {loading && uploadProgress > 0 && (
                                                    <View style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                                        borderRadius: 16,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <ActivityIndicator size="small" color={theme.brand} />
                                                        <Text style={{ color: '#fff', fontFamily: 'Outfit-Bold', marginTop: 8 }}>{uploadProgress}%</Text>
                                                        <View style={{
                                                            width: '80%',
                                                            height: 4,
                                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                                            borderRadius: 2,
                                                            marginTop: 12,
                                                            overflow: 'hidden'
                                                        }}>
                                                            <View style={{
                                                                width: `${uploadProgress}%`,
                                                                height: '100%',
                                                                backgroundColor: theme.brand
                                                            }} />
                                                        </View>
                                                    </View>
                                                )}
                                            </>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer Toolbar */}
                    <View className="border-t px-6 py-4 flex-row items-center"
                        style={{ borderTopColor: isDark ? '#27272a' : '#f4f4f5', backgroundColor: theme.background }}>
                        <TouchableOpacity onPress={() => pickMedia('images')} className="mr-6">
                            <Ionicons name="image-outline" size={26} color={theme.brand} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => pickMedia('video')} className="mr-6">
                            <Ionicons name="videocam-outline" size={26} color="#3b82f6" />
                        </TouchableOpacity>

                        <TouchableOpacity className="mr-6">
                            <Ionicons name="calendar-outline" size={24} color="#8b5cf6" />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Ionicons name="location-outline" size={24} color="#ef4444" />
                        </TouchableOpacity>

                        <View style={{ flex: 1 }} />

                        <Text style={{ fontFamily: 'Outfit-Medium', color: postContent.length > 250 ? '#ef4444' : '#71717a', fontSize: 12 }}>
                            {postContent.length}/280
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}