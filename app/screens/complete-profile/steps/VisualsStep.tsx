import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

interface VisualsStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    isDark: boolean;
}

export default function VisualsStep({ formData, setFormData, theme, isDark }: VisualsStepProps) {
    const pickMedia = async (type: 'profile' | 'cover') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'profile' ? [1, 1] : [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData({ ...formData, [type === 'profile' ? 'profileImage' : 'coverImage']: result.assets[0].uri });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({
                type: 'success',
                text1: 'Upload Successful',
                text2: `${type === 'profile' ? 'Profile picture' : 'Banner'} updated.`
            });
        }
    };

    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Visuals</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">A picture is worth a thousand lines of code.</Text>
            </View>

            <View style={styles.profileSection} className="mb-10">
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
                            <Feather name="image" size={30} color={theme.tabIconDefault} />
                            <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] mt-2">Add Banner</Text>
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
                        style={[styles.avatarContainer, { borderColor: theme.background, backgroundColor: isDark ? '#27272a' : '#fff' }]}
                        className="shadow-xl"
                    >
                        {formData.profileImage ? (
                            <Image source={{ uri: formData.profileImage }} className="w-full h-full" />
                        ) : (
                            <View className="items-center justify-center h-full">
                                <Feather name="user" size={40} color={theme.tabIconDefault} />
                            </View>
                        )}
                        <View style={styles.avatarEditBadge} className="bg-brand border-2 border-zinc-900 dark:border-black">
                            <Ionicons name="add" size={16} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="px-2">
                <Text style={{ color: theme.text }} className="text-xl font-[Outfit-Bold] mb-1">Profile Preview</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] mb-4">This is how you'll appear to others.</Text>

                <View className="p-6 rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <Text style={{ color: theme.text }} className="text-2xl font-[Outfit-Bold]">{formData.fullName || "Your Name"}</Text>
                    <Text style={{ color: theme.brand }} className="text-base font-[Outfit-Medium] mb-4">{formData.headline || "Hustler / Designer / Engineer"}</Text>

                    <View className="flex-row items-center mb-2">
                        <Feather name="map-pin" size={14} color={theme.tabIconDefault} className="mr-2" />
                        <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium]">
                            {formData.location.city ? `${formData.location.city}, ${formData.location.country}` : "Earth"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        height: 240,
        position: 'relative',
    },
    coverContainer: {
        height: 160,
        borderRadius: 32,
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
        left: 24,
    },
    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 40,
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
