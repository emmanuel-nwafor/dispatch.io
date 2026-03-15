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
import { reels as reelsApi } from '@/app/data/api';

export default function CreatePostScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'seeker_pitch' | 'company_tour' | 'job_preview'>('seeker_pitch');
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !image) {
            Alert.alert('Missing Fields', 'Please fill in all fields and select an image.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('type', type);

            const filename = image.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const fileType = match ? `image/${match[1]}` : `image`;

            formData.append('postImage', {
                uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
                name: filename,
                type: fileType,
            } as any);

            const res = await reelsApi.create(formData);
            if (res.success) {
                Alert.alert('Success', 'Post created successfully!');
                router.back();
            }
        } catch (error: any) {
            console.error('Create Post Error:', error);
            Alert.alert('Error', error.message || 'Failed to create post');
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
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl">Create Post</Text>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={uploading}
                        style={{ backgroundColor: theme.brand }}
                        className="px-6 py-2 rounded-full"
                    >
                        {uploading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ fontFamily: 'Outfit-Bold' }} className="text-white">Post</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6">
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{ height: hp('40%'), backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                        className="w-full rounded-[32px] items-center justify-center mb-6 overflow-hidden border-2 border-dashed border-zinc-800/10"
                    >
                        {image ? (
                            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                            <View className="items-center">
                                <Ionicons name="image-outline" size={48} color={isDark ? '#3f3f46' : '#d4d4d8'} />
                                <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#52525b' : '#a1a1aa' }} className="mt-2">Tap to select an image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        placeholder="Add a catchy title..."
                        placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                        value={title}
                        onChangeText={setTitle}
                        style={{ fontFamily: 'Outfit-Bold', fontSize: 24, color: theme.text }}
                        className="mb-4"
                    />

                    <TextInput
                        placeholder="What's on your mind?..."
                        placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        style={{ fontFamily: 'Outfit-Medium', fontSize: 16, color: theme.text, minHeight: 100 }}
                        textAlignVertical="top"
                        className="mb-6"
                    />

                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-sm mb-3 uppercase tracking-widest">Post Type</Text>
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
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
