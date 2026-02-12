import { Colors } from '@/app/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    Platform,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            }}
        >
            <View style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.1)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
            }}>
                <Ionicons name={icon as any} size={20} color={isDestructive ? '#ef4444' : (color || theme.text)} />
            </View>
            <Text style={{
                flex: 1,
                fontFamily: 'Outfit-Medium',
                fontSize: 15,
                color: isDestructive ? '#ef4444' : theme.text,
            }}>
                {label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={isDark ? '#3f3f46' : '#d4d4d8'} />
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    const stats = [
        { label: 'Applied', value: '24', icon: 'send-outline', color: theme.brand },
        { label: 'Matches', value: '12', icon: 'sparkles-outline', color: '#3b82f6' },
        { label: 'Views', value: '45', icon: 'eye-outline', color: '#8b5cf6' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Header */}
                    <View style={{ paddingHorizontal: 24, paddingTop: 10, marginBottom: 30 }}>
                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 28 }}>
                            Profile
                        </Text>
                    </View>

                    {/* Hero Section */}
                    <View style={{ alignItems: 'center', paddingHorizontal: 24, marginBottom: 32 }}>
                        <TouchableOpacity activeOpacity={0.9} style={{ position: 'relative', marginBottom: 16 }}>
                            <View style={{
                                width: 110,
                                height: 110,
                                borderRadius: 55,
                                borderWidth: 3,
                                borderColor: theme.brand,
                                padding: 3,
                                backgroundColor: theme.background,
                            }}>
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/300' }}
                                    style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                />
                            </View>
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: theme.text,
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 3,
                                borderColor: theme.background,
                            }}>
                                <Ionicons name="camera" size={16} color={theme.background} />
                            </View>
                        </TouchableOpacity>

                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 24, marginBottom: 4 }}>
                            Emmanuel Nwafor
                        </Text>
                        <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 14 }}>
                            Senior UI/UX Engineer • London, UK
                        </Text>
                    </View>

                    {/* Stats Section */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 24,
                        marginBottom: 32,
                    }}>
                        {stats.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    width: (wp('100%') - 48 - 24) / 3,
                                    backgroundColor: isDark ? '#111111' : '#f9f9f9',
                                    borderRadius: 24,
                                    padding: 16,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: isDark ? '#27272a' : '#f4f4f5',
                                }}
                            >
                                <Ionicons name={item.icon as any} size={20} color={item.color} style={{ marginBottom: 8 }} />
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 18, marginBottom: 2 }}>
                                    {item.value}
                                </Text>
                                <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Menu Groups */}
                    <View style={{ paddingHorizontal: 24 }}>
                        {/* Account Section */}
                        <Text style={{
                            fontFamily: 'Outfit-Bold',
                            color: '#71717a',
                            fontSize: 12,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            marginBottom: 12,
                            marginLeft: 4,
                        }}>
                            Account Settings
                        </Text>
                        <View style={{
                            backgroundColor: isDark ? '#111111' : '#fff',
                            borderRadius: 28,
                            borderWidth: 1,
                            borderColor: isDark ? '#27272a' : '#f4f4f5',
                            overflow: 'hidden',
                            marginBottom: 28,
                        }}>
                            <MenuItem icon="person-outline" label="Personal Information" />
                            <MenuItem icon="document-text-outline" label="Resume & Portfolio" />
                            <MenuItem icon="shield-checkmark-outline" label="Security & Privacy" isLast />
                        </View>

                        {/* App Section */}
                        <Text style={{
                            fontFamily: 'Outfit-Bold',
                            color: '#71717a',
                            fontSize: 12,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            marginBottom: 12,
                            marginLeft: 4,
                        }}>
                            Preferences
                        </Text>
                        <View style={{
                            backgroundColor: isDark ? '#111111' : '#fff',
                            borderRadius: 28,
                            borderWidth: 1,
                            borderColor: isDark ? '#27272a' : '#f4f4f5',
                            overflow: 'hidden',
                            marginBottom: 28,
                        }}>
                            <MenuItem icon="notifications-outline" label="Notifications" />
                            <MenuItem icon="briefcase-outline" label="Job Alerts" />
                            <MenuItem icon="color-palette-outline" label="Appearance" isLast />
                        </View>

                        {/* Support & Logout */}
                        <Text style={{
                            fontFamily: 'Outfit-Bold',
                            color: '#71717a',
                            fontSize: 12,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            marginBottom: 12,
                            marginLeft: 4,
                        }}>
                            More
                        </Text>
                        <View style={{
                            backgroundColor: isDark ? '#111111' : '#fff',
                            borderRadius: 28,
                            borderWidth: 1,
                            borderColor: isDark ? '#27272a' : '#f4f4f5',
                            overflow: 'hidden',
                        }}>
                            <MenuItem icon="help-circle-outline" label="Help Center" />
                            <MenuItem icon="information-circle-outline" label="About Dispatch.io" />
                            <MenuItem
                                icon="log-out-outline"
                                label="Log Out"
                                isDestructive
                                isLast
                                onPress={() => router.replace('/screens/auth/login' as any)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
