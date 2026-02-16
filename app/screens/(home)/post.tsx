import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
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

export default function PostScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    const [postContent, setPostContent] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);

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

    const handlePost = () => {
        if (!postContent.trim() && selectedMedia.length === 0) {
            Alert.alert("Empty Post", "Please add some text or media to share.");
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        console.log("Posting:", { postContent, selectedMedia });
        router.back();
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
                        disabled={!postContent.trim() && selectedMedia.length === 0}
                        style={{
                            backgroundColor: (postContent.trim() || selectedMedia.length > 0) ? theme.brand : '#71717a',
                            paddingHorizontal: 20,
                            paddingVertical: 8,
                            borderRadius: 20
                        }}
                    >
                        <Text style={{ fontFamily: 'Outfit-Bold', color: '#000' }}>Post</Text>
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
                                source={{ uri: 'https://i.pravatar.cc/100' }}
                                style={{ width: 45, height: 45, borderRadius: 25, marginRight: 12 }}
                            />
                            <View>
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 16 }}>
                                    Emmanuel Nwafor
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
                                            <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 6 }}>
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