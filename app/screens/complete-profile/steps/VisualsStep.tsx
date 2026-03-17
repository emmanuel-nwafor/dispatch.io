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
    const darkGreen = "#006400";

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
            aspect: type === 'profile' ? [1, 1] : [16, 6], // More like a professional banner aspect
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadFile(result.assets[0].uri, type);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: hp('3%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%'), fontFamily: 'Outfit-Bold' }}>Visual Identity</Text>
                <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.2%'), fontFamily: 'Outfit-Medium' }}>
                    Make a great first impression with your profile visuals.
                </Text>
            </View>

            <View style={styles.profileSection}>
                {/* Banner/Cover Image */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => pickMedia('cover')}
                    style={[styles.coverContainer, { backgroundColor: isDark ? '#2c2c2e' : '#e5e7eb' }]}
                >
                    {formData.coverImage ? (
                        <Image source={{ uri: formData.coverImage }} style={styles.fullImage} />
                    ) : (
                        <View style={styles.placeholderCenter}>
                            {uploading.cover ? (
                                <ActivityIndicator color={darkGreen} />
                            ) : (
                                <>
                                    <Feather name="plus" size={24} color={theme.tabIconDefault} />
                                    <Text style={{ color: theme.tabIconDefault, fontFamily: 'Outfit-Bold', fontSize: wp('3.5%'), marginTop: 4 }}>ADD BANNER</Text>
                                </>
                            )}
                        </View>
                    )}
                    <View style={styles.bannerOverlay}>
                        <Ionicons name="camera" size={18} color="white" />
                    </View>
                </TouchableOpacity>

                {/* Profile Image Overlap */}
                <View style={styles.avatarWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => pickMedia('profile')}
                        disabled={uploading.profile}
                        style={[styles.avatarContainer, { borderColor: theme.background, backgroundColor: isDark ? '#1c1c1e' : '#f8f9fa' }]}
                    >
                        {formData.profileImage ? (
                            <Image source={{ uri: formData.profileImage }} style={styles.fullImage} />
                        ) : (
                            <View style={styles.placeholderCenter}>
                                {uploading.profile ? (
                                    <ActivityIndicator color={darkGreen} />
                                ) : (
                                    <Feather name="user" size={wp('10%')} color={theme.tabIconDefault} />
                                )}
                            </View>
                        )}
                        <View style={[styles.avatarEditBadge, { backgroundColor: theme.brand }]}>
                            {uploading.profile ? (
                                <ActivityIndicator size="small" color="black" />
                            ) : (
                                <Ionicons name="camera" size={14} color="black" />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ marginTop: hp('4%') }}>
                <Text style={{ color: theme.text, fontSize: wp('5%'), fontFamily: 'Outfit-Bold', marginBottom: hp('1.5%') }}>Card Preview</Text>

                <View style={[styles.previewCard, { backgroundColor: isDark ? '#161618' : '#fff', borderColor: isDark ? '#2c2c2e' : '#f1f1f1' }]}>
                    <View style={styles.previewHeader}>
                        <Text style={{ color: theme.text, fontSize: wp('5.5%'), fontFamily: 'Outfit-Bold' }} numberOfLines={1}>
                            {formData.fullName || "Your Full Name"}
                        </Text>
                        <View style={[styles.roleBadge, { backgroundColor: theme.brand + '20' }]}>
                            <Text style={{ color: theme.brand, fontSize: wp('3%'), fontFamily: 'Outfit-Bold' }}>PRO</Text>
                        </View>
                    </View>

                    <Text style={{ color: isDark ? '#a1a1aa' : '#666', fontSize: wp('4%'), fontFamily: 'Outfit-Medium', marginBottom: 12 }}>
                        {formData.headline || "Your professional headline goes here"}
                    </Text>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color={theme.tabIconDefault} />
                        <Text style={{ color: theme.tabIconDefault, fontFamily: 'Outfit-Medium', marginLeft: 4 }}>
                            {formData.location?.state ? `${formData.location.state}, ${formData.location.country}` : "Location not set"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        height: hp('26%'),
        position: 'relative',
        width: '100%',
    },
    coverContainer: {
        height: hp('18%'),
        borderRadius: wp('4%'),
        width: '100%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 10,
    },
    avatarWrapper: {
        position: 'absolute',
        bottom: 0,
        left: wp('5%'),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    avatarContainer: {
        width: wp('26%'),
        height: wp('26%'),
        borderRadius: wp('6%'), // Twitter/LinkedIn style squircle
        borderWidth: 4,
        overflow: 'hidden',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: wp('8%'),
        height: wp('8%'),
        borderTopLeftRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewCard: {
        padding: 24,
        borderRadius: wp('6%'),
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});