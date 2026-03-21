import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    ActivityIndicator,
    Platform,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { user as userApi, User } from '@/app/data/api';
import { storage } from '@/app/utils/storage';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';

interface MenuItemProps {
    icon: string;
    label: string;
    onPress?: () => void;
    color?: string;
    isLast?: boolean;
    isDestructive?: boolean;
}

const MenuItem = ({ icon, label, onPress, color, isLast, isDestructive }: MenuItemProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                height: hp('7.5%')
            }}
            className="flex-row items-center px-5"
        >
            <View
                style={{ backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.1)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)') }}
                className="w-10 h-10 rounded-2xl items-center justify-center mr-4"
            >
                <Ionicons name={icon as any} size={20} color={isDestructive ? '#ef4444' : (color || theme.text)} />
            </View>
            <Text
                style={{ fontFamily: 'Outfit-Medium', color: isDestructive ? '#ef4444' : theme.text }}
                className="flex-1 text-[15px]"
            >
                {label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={isDark ? '#3f3f46' : '#d4d4d8'} />
        </TouchableOpacity>
    );
};

export default function SeekersProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [uploading, setUploading] = useState<{ avatar: boolean; cover: boolean }>({ avatar: false, cover: false });

    const fetchProfile = async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true);
        try {
            const res = await userApi.getMe();
            if (res.success) {
                setUser(res.user);
            }
        } catch (err) {
            console.error("Profile Fetch Error:", err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load profile' });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfile(true);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, []);

    const pickImage = async (type: 'avatar' | 'cover') => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Toast.show({ type: 'info', text1: 'Permission Denied', text2: 'We need access to your photos' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'avatar' ? [1, 1] : [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri, type);
        }
    };

    const uploadImage = async (uri: string, type: 'avatar' | 'cover') => {
        setUploading(prev => ({ ...prev, [type]: true }));
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop() || 'upload.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const mimeType = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append('file', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: filename,
                type: mimeType,
            } as any);

            formData.append('type', type === 'avatar' ? 'avatar' : 'coverImage');

            const res = await userApi.uploadImage(formData);

            if (res.success) {
                const updatedUser = { ...user } as User;
                if (type === 'avatar') updatedUser.avatar = res.imageUrl;
                else updatedUser.coverImage = res.imageUrl;

                setUser(updatedUser);
                Toast.show({ type: 'success', text1: 'Success', text2: 'Image updated successfully!' });
            }
        } catch (error: any) {
            console.error("Upload Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
                text2: error.message || 'Server error (500)'
            });
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleLogout = async () => {
        await storage.clearAll();
        router.replace('/screens/auth/login');
    };

    const fullName = user?.profile?.fullName || 'Anonymous';
    const avatar = user?.avatar || `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=006400&color=fff`;
    const coverImage = user?.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000';

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color="#006400" />
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <StatusBar style="light" />

            {/* FLOATING HEADER */}
            <View style={styles.headerContainer} className="flex-row justify-between items-end px-6 pb-4">
                <Text style={styles.headerTitle} className="text-white">Profile</Text>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: user?._id } } as any)}
                    className="overflow-hidden rounded-full"
                >
                    <BlurView intensity={30} tint="light" className="flex-row items-center px-4 py-2 border border-white/20">
                        <Ionicons name="eye-outline" size={16} color="white" />
                        <Text className="text-white ml-2 text-xs font-bold" style={{ fontFamily: 'Outfit-Bold' }}>Preview</Text>
                    </BlurView>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp('15%') }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
            >
                {/* HERO SECTION */}
                <View style={styles.heroContainer} className="bg-black relative">
                    <Image source={{ uri: coverImage }} className="absolute inset-0 w-full h-full opacity-90" resizeMode="cover" />
                    <View className="absolute inset-0 bg-black/30" />

                    <TouchableOpacity onPress={() => pickImage('cover')} className="absolute" style={{ top: hp('16%'), right: 20 }}>
                        <BlurView intensity={50} tint="dark" className="w-10 h-10 rounded-full items-center justify-center overflow-hidden">
                            {uploading.cover ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="camera" size={20} color="white" />
                            )}
                        </BlurView>
                    </TouchableOpacity>

                    {/* IDENTITY */}
                    <View className="flex-1 justify-center items-center mt-16">
                        <View className="relative">
                            <View
                                style={[styles.avatarBorder, { borderColor: theme.background }]}
                                className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-2xl bg-zinc-800"
                            >
                                <Image source={{ uri: avatar }} className="w-full h-full" />
                                {uploading.avatar && (
                                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                                        <ActivityIndicator color="#fff" size="small" />
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => pickImage('avatar')}
                                className="absolute bottom-1 right-1 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                                style={{ backgroundColor: theme.brand }}
                            >
                                <Ionicons name="pencil" size={14} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-white text-3xl mt-4" style={{ fontFamily: 'Outfit-Bold' }}>{fullName}</Text>
                        <Text className="text-white/70 text-sm mt-1" style={{ fontFamily: 'Outfit-Medium' }}>
                            {user?.role === 'seeker' ? 'Candidate' : 'Recruiter'}
                            {user?.profile?.location && `  •  ${user.profile.location}`}
                        </Text>
                    </View>
                </View>

                {/* STATS BRIDGE */}
                <View className="flex-row justify-between px-6 -mt-10">
                    {[
                        { label: 'Applied', value: user?.appliedJobsCount || 0, icon: 'send', color: '#006400' },
                        { label: 'Match', value: (user?.profile?.autoApply?.minMatchScore || 0) + '%', icon: 'flash', color: '#006400' },
                    ].map((item, i) => (
                        <View
                            key={i}
                            className="items-center py-5 rounded-3xl shadow-lg border"
                            style={{
                                width: wp('27%'),
                                backgroundColor: isDark ? '#1a1a1a' : '#fff',
                                borderColor: isDark ? '#222' : '#f0f0f0'
                            }}
                        >
                            <Ionicons name={item.icon as any} size={20} color={item.color} />
                            <Text className="text-lg mt-2" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>{item.value}</Text>
                            <Text className="text-zinc-400 text-[10px] uppercase tracking-wider font-medium">{item.label}</Text>
                        </View>
                    ))}
                </View>

                {/* MENU CONTENT */}
                <View className="px-6 mt-10">
                    <SectionLabel title="Account Management" />
                    <View
                        className="rounded-[35px] border overflow-hidden mb-8"
                        style={{ backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: isDark ? '#222' : '#f0f0f0' }}
                    >
                        <MenuItem icon="person-outline" label="Personal Details" />
                        <MenuItem icon="document-text-outline" label="Experience & Skills" />
                        <MenuItem icon="settings-outline" label="Preferences" isLast />
                    </View>

                    <SectionLabel title="Support" />
                    <View
                        className="rounded-[35px] border overflow-hidden"
                        style={{ backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: isDark ? '#222' : '#f0f0f0' }}
                    >
                        <MenuItem icon="help-circle-outline" label="Help Center" />
                        <MenuItem icon="log-out-outline" label="Logout" isDestructive isLast onPress={handleLogout} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const SectionLabel = ({ title }: { title: string }) => (
    <Text className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-3 ml-3">
        {title}
    </Text>
);

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: hp('14%'),
        zIndex: 100,
    },
    headerTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('7%'),
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    heroContainer: {
        height: hp('46%'),
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        overflow: 'hidden',
    },
    avatarBorder: {
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    }
});