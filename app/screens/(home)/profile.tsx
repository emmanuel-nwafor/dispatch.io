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
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const [uploading, setUploading] = useState(false);

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

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Toast.show({ type: 'info', text1: 'Permission Denied', text2: 'We need access to your photos' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadAvatar(result.assets[0].uri);
        }
    };

    const uploadAvatar = async (uri: string) => {
        setUploading(true);
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop() || 'avatar.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const mimeType = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append('file', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: filename,
                type: mimeType,
            } as any);

            formData.append('type', 'avatar');

            const res = await userApi.uploadImage(formData);

            if (res.success) {
                const updatedUser = { ...user, avatar: res.imageUrl } as User;
                setUser(updatedUser);
                Toast.show({ type: 'success', text1: 'Success', text2: 'Avatar updated!' });
            }
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message || 'Server error' });
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        await storage.clearAll();
        router.replace('/screens/auth/login');
    };

    const fullName = user?.profile?.fullName || 'Anonymous';
    const avatar = user?.avatar || `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=006400&color=fff`;

    if (loading) {
        return (
            <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }} edges={['top']}>
                <View className="flex-row justify-between items-center px-6 py-4">
                    <Text style={styles.headerTitle} className={isDark ? "text-white" : "text-zinc-900"}>Profile</Text>
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: user?._id } } as any)}
                        style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
                        className="flex-row items-center px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800"
                    >
                        <Ionicons name="eye-outline" size={16} color={isDark ? '#fff' : '#000'} />
                        <Text
                            className="ml-2 text-xs font-bold"
                            style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#fff' : '#000' }}
                        >
                            Preview
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
                    <ActivityIndicator size="large" color="#006400" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }} edges={['top']}>
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* HEADER */}
            <View className="flex-row justify-between items-center px-6 py-4">
                <Text style={styles.headerTitle} className={isDark ? "text-white" : "text-zinc-900"}>Profile</Text>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: user?._id } } as any)}
                    style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
                    className="flex-row items-center px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800"
                >
                    <Ionicons name="eye-outline" size={16} color={isDark ? '#fff' : '#000'} />
                    <Text
                        className="ml-2 text-xs font-bold"
                        style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#fff' : '#000' }}
                    >
                        Preview
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="mb-24"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp('5%') }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#006400" />}
            >
                {/* PROFILE IDENTITY SECTION */}
                <View className="items-center mt-6 mb-8">
                    <View className="relative">
                        <View
                            style={{ borderColor: isDark ? '#27272a' : '#fff' }}
                            className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-2xl bg-zinc-200 dark:bg-zinc-800"
                        >
                            <Image source={{ uri: avatar }} className="w-full h-full" />
                            {uploading && (
                                <View className="absolute inset-0 bg-black/40 items-center justify-center">
                                    <ActivityIndicator color="#fff" size="small" />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="absolute bottom-1 right-1 w-9 h-9 rounded-full items-center justify-center border-2 border-white"
                            style={{ backgroundColor: '#006400' }}
                        >
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-2xl mt-4" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>{fullName}</Text>
                    <View className="flex-row items-center mt-1">
                        <View className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <Text className="text-zinc-500 text-xs uppercase font-bold" style={{ fontFamily: 'Outfit-Bold' }}>
                                {user?.role === 'seeker' ? 'Candidate' : 'Recruiter'}
                            </Text>
                        </View>
                        {user?.profile?.location && (
                            <Text className="text-zinc-400 text-sm ml-2" style={{ fontFamily: 'Outfit-Medium' }}>
                                • {user.profile.location}
                            </Text>
                        )}
                    </View>
                </View>

                {/* STATS SECTION */}
                <View className="flex-row justify-between px-6 mb-10">
                    {[
                        { label: 'Applied', value: user?.appliedJobsCount || 0, icon: 'send' },
                        { label: 'Match Rate', value: (user?.profile?.autoApply?.minMatchScore || 0) + '%', icon: 'flash' },
                        { label: 'Saved', value: '12', icon: 'bookmark' },
                    ].map((item, i) => (
                        <View
                            key={i}
                            className="items-center py-4 rounded-[25px] shadow-sm border"
                            style={{
                                width: wp('28%'),
                                backgroundColor: isDark ? '#1a1a1a' : '#fff',
                                borderColor: isDark ? '#222' : '#f0f0f0'
                            }}
                        >
                            <View className="w-8 h-8 rounded-full items-center justify-center mb-2 bg-green-50 dark:bg-green-900/20">
                                <Ionicons name={item.icon as any} size={16} color="#006400" />
                            </View>
                            <Text className="text-lg" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>{item.value}</Text>
                            <Text className="text-zinc-400 text-[10px] uppercase tracking-wider font-medium">{item.label}</Text>
                        </View>
                    ))}
                </View>

                {/* MENU CONTENT */}
                <View className="px-6">
                    <SectionLabel title="Account Management" />
                    <View
                        className="rounded-[30px] border overflow-hidden mb-8"
                        style={{ backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: isDark ? '#222' : '#f0f0f0' }}
                    >
                        <MenuItem icon="person-outline" label="Personal Details" />
                        <MenuItem icon="document-text-outline" label="Experience & Skills" />
                        <MenuItem icon="settings-outline" label="Preferences" isLast />
                    </View>

                    <SectionLabel title="Support" />
                    <View
                        className="rounded-[30px] border overflow-hidden"
                        style={{ backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: isDark ? '#222' : '#f0f0f0' }}
                    >
                        <MenuItem icon="help-circle-outline" label="Help Center" />
                        <MenuItem icon="log-out-outline" label="Logout" isDestructive isLast onPress={handleLogout} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const SectionLabel = ({ title }: { title: string }) => (
    <Text className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-3 ml-3">
        {title}
    </Text>
);

const styles = StyleSheet.create({
    headerTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('6.5%'),
    },
    // avatarBorder: {
    //     elevation: 10,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 8 },
    //     shadowOpacity: 0.15,
    //     shadowRadius: 12,
    // }
});