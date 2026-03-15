import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { reels as reelsApi, posts as postsApi } from '@/app/data/api';

export default function CreatePostScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contentType, setContentType] = useState<'post' | 'reel'>('post');
    const [type, setType] = useState<'seeker_pitch' | 'company_tour' | 'job_preview'>('seeker_pitch');
    const [media, setMedia] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const pickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: contentType === 'post' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            allowsMultipleSelection: contentType === 'post',
            aspect: contentType === 'post' ? [4, 5] : undefined,
            quality: 0.8,
        });

        if (!result.canceled) {
            setMedia(result.assets.map(a => a.uri));
        }
    };

    const handleSubmit = async () => {
        if (!description || media.length === 0) {
            Alert.alert('Missing Fields', 'Please add some content and media.');
            return;
        }

        if (contentType === 'reel' && !title) {
            Alert.alert('Missing Title', 'Reels require a title.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();

            if (contentType === 'post') {
                formData.append('content', description);
                media.forEach((uri, index) => {
                    const filename = uri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename || '');
                    const fileType = match ? `image/${match[1]}` : `image`;

                    formData.append('images', {
                        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                        name: filename || `image_${index}`,
                        type: fileType,
                    } as any);
                });
                const res = await postsApi.create(formData);
                if (res.success) {
                    Alert.alert('Success', 'Post shared!');
                    router.back();
                }
            } else {
                formData.append('title', title);
                formData.append('description', description);
                formData.append('type', type);

                const uri = media[0];
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const fileType = match ? `video/${match[1]}` : `video`;

                formData.append('postImage', {
                    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                    name: filename || 'video',
                    type: fileType,
                } as any);

                const res = await reelsApi.create(formData);
                if (res.success) {
                    Alert.alert('Success', 'Reel uploaded!');
                    router.back();
                }
            }
        } catch (error: any) {
            console.error('Submission Error:', error);
            Alert.alert('Error', error.message || 'Failed to share content');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} color={theme.text} />
                    </TouchableOpacity>

                    {/* Content Toggle */}
                    <View className="flex-row bg-zinc-800/5 rounded-full p-1 border border-zinc-500/10">
                        <TouchableOpacity
                            onPress={() => { setContentType('post'); setMedia([]); }}
                            className={`px-4 py-1.5 rounded-full ${contentType === 'post' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Text style={{ fontFamily: 'Outfit-Bold', color: contentType === 'post' ? theme.brand : '#71717a', fontSize: 13 }}>Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setContentType('reel'); setMedia([]); }}
                            className={`px-4 py-1.5 rounded-full ${contentType === 'reel' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Text style={{ fontFamily: 'Outfit-Bold', color: contentType === 'reel' ? theme.brand : '#71717a', fontSize: 13 }}>Reel</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={uploading}
                        style={{ opacity: (description && media.length > 0) ? 1 : 0.5 }}
                    >
                        {uploading ? (
                            <ActivityIndicator size="small" color={theme.brand} />
                        ) : (
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand }} className="text-lg">Share</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6">
                    <TouchableOpacity
                        onPress={pickMedia}
                        style={{ height: hp('35%'), backgroundColor: isDark ? '#18181b' : '#f8fafc' }}
                        className="w-full rounded-[32px] items-center justify-center mb-6 overflow-hidden border-2 border-dashed border-zinc-500/10"
                    >
                        {media.length > 0 ? (
                            contentType === 'post' ? (
                                <View className="w-full h-full flex-row">
                                    <Image source={{ uri: media[0] }} className="flex-1" resizeMode="cover" />
                                    {media.length > 1 && (
                                        <View className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full">
                                            <Text className="text-white text-xs font-bold">+{media.length - 1}</Text>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View className="items-center">
                                    <Ionicons name="videocam" size={48} color={theme.brand} />
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="mt-2">Video Selected</Text>
                                </View>
                            )
                        ) : (
                            <View className="items-center">
                                <Ionicons name={contentType === 'post' ? "image-outline" : "videocam-outline"} size={48} color={isDark ? '#3f3f46' : '#d4d4d8'} />
                                <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#52525b' : '#a1a1aa' }} className="mt-2 text-center px-10">
                                    {contentType === 'post' ? 'Tap to share photos' : 'Tap to share a video pitch'}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {contentType === 'reel' && (
                        <TextInput
                            placeholder="Reel Title"
                            placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                            value={title}
                            onChangeText={setTitle}
                            style={{ fontFamily: 'Outfit-Bold', fontSize: 24, color: theme.text }}
                            className="mb-4"
                        />
                    )}

                    <TextInput
                        placeholder={contentType === 'post' ? "What's happening?" : "Tell us about this video..."}
                        placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        style={{ fontFamily: 'Outfit-Medium', fontSize: 17, color: theme.text, minHeight: 120 }}
                        textAlignVertical="top"
                        className="mb-6"
                    />

                    {contentType === 'reel' && (
                        <>
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-sm mb-3 uppercase tracking-widest">Reel Type</Text>
                            <View className="flex-row flex-wrap gap-2 mb-10">
                                {['seeker_pitch', 'company_tour', 'job_preview'].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => setType(item as any)}
                                        style={{
                                            backgroundColor: type === item ? theme.brand : (isDark ? '#111' : '#fff'),
                                            borderColor: type === item ? theme.brand : (isDark ? '#27272a' : '#f4f4f5')
                                        }}
                                        className="px-4 py-2 rounded-full border"
                                    >
                                        <Text style={{
                                            fontFamily: 'Outfit-Bold',
                                            color: type === item ? '#fff' : (isDark ? '#71717a' : '#a1a1aa'),
                                            fontSize: 12
                                        }}>
                                            {item.replace('_', ' ').toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
