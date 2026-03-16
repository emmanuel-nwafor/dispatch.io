import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { user as userApi } from '@/app/data/api';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface VisualsStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    isDark: boolean;
}

export default function VisualsStep({ formData, setFormData, theme, isDark }: VisualsStepProps) {
    const [uploading, setUploading] = React.useState<{ profile?: boolean, cover?: boolean }>({});
    const darkGreen = "#006400"; // Specific ActivityIndicator color from your preferences

    const uploadFile = async (uri: string, type: 'profile' | 'cover') => {
        setUploading(prev => ({ ...prev, [type]: true }));
        try {
            const formDataUpload = new FormData();
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const fileType = match ? `image/${match[1]}` : `image`;

            formDataUpload.append('file', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: filename,
                type: fileType,
            } as any);

            const res = await userApi.uploadImage(formDataUpload);
            if (res.success) {
                setFormData({
                    ...formData,
                    [type === 'profile' ? 'profileImage' : 'coverImage']: res.imageUrl
                });
                Toast.show({
                    type: 'success',
                    text1: 'Upload Successful',
                    text2: `${type === 'profile' ? 'Profile picture' : 'Banner'} updated.`
                });
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
                text2: error.message || 'Something went wrong.'
            });
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const pickMedia = async (type: 'profile' | 'cover') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'profile' ? [1, 1] : [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadFile(result.assets[0].uri, type);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    return (
        <View>
            <View style={{ marginBottom: hp('4%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%') }} className="font-[Outfit-Bold] mb-2">Visuals</Text>
                <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.5%') }} className="font-[Outfit-Medium]">
                    A picture is worth a thousand lines of code.
                </Text>
            </View>

            <View style={styles.profileSection}>
                {/* Banner/Cover Image */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => pickMedia('cover')}
                    style={[styles.coverContainer, { backgroundColor: isDark ? '#1a1a1b' : '#f3f4f6' }]}
                    className="overflow-hidden"
                >
                    {formData.coverImage ? (
                        <Image source={{ uri: formData.coverImage }} className="w-full h-full" />
                    ) : (
                        <View className="items-center justify-center h-full">
                            {uploading.cover ? (
                                <ActivityIndicator color={darkGreen} />
                            ) : (
                                <>
                                    <Feather name="image" size={30} color={theme.tabIconDefault} />
                                    <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] mt-2">Add Banner</Text>
                                </>
                            )}
                        </View>
                    )}
                    <View style={styles.editOverlay} className="bg-black/20">
                        <Ionicons name="camera" size={20} color="white" />
                    </View>
                </TouchableOpacity>

                {/* Profile Image Overlap */}
                <View style={styles.avatarWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => pickMedia('profile')}
                        disabled={uploading.profile}
                        style={[styles.avatarContainer, { borderColor: theme.background, backgroundColor: isDark ? '#27272a' : '#fff' }]}
                        className="shadow-xl"
                    >
                        {formData.profileImage ? (
                            <Image source={{ uri: formData.profileImage }} className="w-full h-full" />
                        ) : (
                            <View className="items-center justify-center h-full">
                                {uploading.profile ? (
                                    <ActivityIndicator color={darkGreen} />
                                ) : (
                                    <Feather name="user" size={40} color={theme.tabIconDefault} />
                                )}
                            </View>
                        )}
                        <View style={[styles.avatarEditBadge, { backgroundColor: theme.brand }]} className="border-2 border-zinc-900 dark:border-black">
                            {uploading.profile ? (
                                <ActivityIndicator size="small" color="black" />
                            ) : (
                                <Ionicons name="add" size={16} color="black" />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ paddingHorizontal: wp('2%'), marginTop: hp('2%') }}>
                <Text style={{ color: theme.text, fontSize: wp('5.5%') }} className="font-[Outfit-Bold] mb-1">Profile Preview</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] mb-4">This is how you'll appear to others.</Text>

                <View className="p-6 rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <Text style={{ color: theme.text, fontSize: wp('6%') }} className="font-[Outfit-Bold]">{formData.fullName || "Your Name"}</Text>
                    <Text style={{ color: theme.brand, fontSize: wp('4%') }} className="font-[Outfit-Medium] mb-4">{formData.headline || "Hustler / Designer / Engineer"}</Text>

                    <View className="flex-row items-center mb-2">
                        <Feather name="map-pin" size={14} color={theme.tabIconDefault} className="mr-2" />
                        <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium]">
                            {formData.location?.city ? `${formData.location.city}, ${formData.location.country}` : "Earth"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        height: hp('30%'),
        position: 'relative',
        marginBottom: hp('2%')
    },
    coverContainer: {
        height: hp('20%'),
        borderRadius: wp('8%'),
        width: '100%',
    },
    editOverlay: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 10,
        borderRadius: 15,
    },
    avatarWrapper: {
        position: 'absolute',
        bottom: 0,
        left: wp('6%'),
    },
    avatarContainer: {
        width: wp('28%'),
        height: wp('28%'),
        borderRadius: wp('10%'),
        borderWidth: 6,
        overflow: 'hidden',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
    }
});