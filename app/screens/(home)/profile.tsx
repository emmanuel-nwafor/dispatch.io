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
import { SafeAreaView } from 'react-native-safe-area-context';
import { user as userApi, User } from '@/app/data/api';
import { storage } from '@/app/utils/storage';
import Toast from 'react-native-toast-message';

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
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({ type: 'info', text1: 'Permission Denied', text2: 'Need gallery access' });
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Image pick error:", error);
        }
    };

    const uploadImage = async (uri: string) => {
        setUploading(true);
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('avatar', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: filename,
                type,
            } as any);

            const res = await userApi.uploadImage(formData);
            if (res.success) {
                if (user) {
                    setUser({
                        ...user,
                        profile: { ...user.profile, resumeUrl: res.imageUrl }
                    });
                }
                Toast.show({ type: 'success', text1: 'Success', text2: 'Profile picture updated!' });
            }
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        await storage.clearAll();
        router.replace('/screens/auth/login');
    };

    const fullName = user?.profile?.fullName || 'Anonymous';
    const headline = user?.role === 'seeker' ? 'Job Seeker' : 'Recruiter';
    const location = user?.profile?.location ? ` • ${user.profile.location}` : '';
    const avatar = user?.profile?.resumeUrl || 'https://ui-avatars.com/api/?name=' + fullName.replace(' ', '+') + '&background=random';

    const stats = [
        { label: 'Applied', value: String(user?.appliedJobsCount || 0), icon: 'send-outline', color: theme.brand },
        { label: 'Score', value: (user?.profile?.autoApply?.minMatchScore || 0) + '%', icon: 'ribbon-outline', color: '#3b82f6' },
        { label: 'Exp', value: (user?.profile?.experienceYear || 0) + 'y', icon: 'time-outline', color: '#8b5cf6' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header - Always Visible */}
                <View style={{ paddingHorizontal: wp('6%'), paddingTop: hp('2%'), }} className="mb-8 flex-row justify-between items-center">
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: wp('7.5%') }}>Profile</Text>
                    {user && (
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: user._id } } as any)}
                            style={{ backgroundColor: theme.brand }}
                            className="px-5 py-2.5 rounded-2xl shadow-sm"
                        >
                            <Text style={{ fontFamily: 'Outfit-Bold' }} className="text-white text-[13px]">Public View</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#006400" />
                        <Text style={{ fontFamily: 'Outfit-Medium', color: theme.text, marginTop: 10 }}>Loading account...</Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: hp('15%') }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#006400" // iOS Dark Green
                                colors={["#006400"]} // Android Dark Green
                            />
                        }
                    >
                        {/* Profile Card */}
                        <View style={{ paddingHorizontal: wp('6%'), }} className="items-center mb-8">
                            <View className="relative mb-5">
                                <View
                                    style={{ width: wp('32%'), height: wp('32%'), borderColor: theme.brand, backgroundColor: theme.background }}
                                    className="rounded-full border-[3px] p-1.5 shadow-xl justify-center items-center overflow-hidden"
                                >
                                    <Image source={{ uri: avatar }} className="w-full h-full rounded-full bg-zinc-200" />

                                    {/* Uploading Overlay */}
                                    {uploading && (
                                        <View style={styles.uploadOverlay}>
                                            <ActivityIndicator color="#fff" size="small" />
                                        </View>
                                    )}
                                </View>

                                <TouchableOpacity
                                    onPress={pickImage}
                                    disabled={uploading}
                                    style={{ backgroundColor: theme.text, borderColor: theme.background }}
                                    className="absolute bottom-1 right-1 w-10 h-10 rounded-full items-center justify-center border-[4px] shadow-lg"
                                >
                                    <Ionicons name="camera" size={18} color={theme.background} />
                                </TouchableOpacity>
                            </View>

                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-2xl mb-1">{fullName}</Text>
                            <Text style={{ fontFamily: 'Outfit-Medium' }} className="text-zinc-500 text-[15px]">{headline}{location}</Text>
                        </View>

                        {/* Stats */}
                        <View style={{ paddingHorizontal: wp('6%') }} className="flex-row justify-between mb-9">
                            {stats.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: wp('27%'),
                                        backgroundColor: isDark ? '#111111' : '#fff',
                                        borderColor: isDark ? '#27272a' : '#f4f4f5',
                                    }}
                                    className="rounded-[32px] py-5 items-center border shadow-sm"
                                >
                                    <Ionicons name={item.icon as any} size={22} color={item.color} className="mb-2" />
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-lg">{item.value}</Text>
                                    <Text style={{ fontFamily: 'Outfit-Medium' }} className="text-zinc-400 text-[10px] uppercase tracking-widest mt-0.5">{item.label}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Settings List */}
                        <View style={{ paddingHorizontal: wp('6%') }}>
                            <SectionLabel title="Account" />
                            <View
                                style={{ backgroundColor: isDark ? '#111111' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }}
                                className="rounded-[32px] border overflow-hidden mb-8 shadow-sm"
                            >
                                <MenuItem icon="person-outline" label="Personal Details" />
                                <MenuItem icon="document-text-outline" label="Experience & Skills" />
                                <MenuItem icon="settings-outline" label="Preferences" isLast />
                            </View>

                            <SectionLabel title="Support" />
                            <View
                                style={{ backgroundColor: isDark ? '#111111' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }}
                                className="rounded-[32px] border overflow-hidden shadow-sm"
                            >
                                <MenuItem icon="help-buoy-outline" label="Help & Feedback" />
                                <MenuItem icon="log-out-outline" label="Sign Out" isDestructive isLast onPress={handleLogout} />
                            </View>
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}

const SectionLabel = ({ title }: { title: string }) => (
    <Text
        style={{ fontFamily: 'Outfit-Bold' }}
        className="text-zinc-400 text-[11px] uppercase tracking-[2px] mb-4 ml-2"
    >
        {title}
    </Text>
);

const styles = StyleSheet.create({
    uploadOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 100, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
    }
});