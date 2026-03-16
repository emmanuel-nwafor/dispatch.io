import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Text, TouchableOpacity, View, useColorScheme, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { useUserStore } from '@/hooks/useUserStore';
import { Colors } from '@/app/constants/Colors';
import { storage } from '@/app/utils/storage'; // Ensure this path is correct

export default function RoleSelectScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const selectedRole = useUserStore((state) => state.role);
    const setStoreRole = useUserStore((state) => state.setRole);

    const handleRoleSelection = async (role: 'seeker' | 'employer') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Log to console for debugging
        console.log(`--- ROLE SELECTED: ${role} ---`);

        // Save to Store
        setStoreRole(role);

        // Persist to Storage
        try {
            await storage.saveItem('user_role', role);
        } catch (error) {
            console.error('Failed to save role to storage:', error);
        }
    };

    const handleContinue = () => {
        if (selectedRole) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/screens/complete-profile');
        }
    };

    return (
        <View style={[{ flex: 1, backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            <LinearGradient
                colors={[`${theme.brand}15`, 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.5 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: wp('6%'), paddingTop: hp('5%') }}>
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 800 }}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('4%') }}
                    >
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={{ width: wp('8%'), height: wp('8%') }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{ marginLeft: wp('2%'), fontFamily: 'Outfit-Bold', fontSize: wp('5.5%'), color: theme.text }}
                        >
                            dispatch.io
                        </Text>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: 200, type: 'timing', duration: 800 }}
                    >
                        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('8%'), color: theme.text }}>
                            Choose your role
                        </Text>
                        <Text
                            style={{ marginTop: hp('0.5%'), fontFamily: 'Outfit-Medium', fontSize: wp('4.5%'), color: isDark ? '#a1a1aa' : '#6b7280' }}
                        >
                            Select how you want to use the platform.
                        </Text>
                    </MotiView>

                    <View style={{ flexDirection: 'column', marginTop: hp('6%'), gap: hp('2.5%') }}>
                        {/* Job Seeker Role */}
                        <TouchableOpacity activeOpacity={0.9} onPress={() => handleRoleSelection('seeker')}>
                            <MotiView
                                animate={{
                                    scale: selectedRole === 'seeker' ? 1.02 : 1,
                                    borderColor: selectedRole === 'seeker' ? theme.brand : isDark ? '#27272a' : '#e4e4e7',
                                    backgroundColor: selectedRole === 'seeker' ? `${theme.brand}10` : isDark ? '#18181b' : '#f4f4f5',
                                }}
                                transition={{ type: 'timing', duration: 200 }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderRadius: wp('6%'),
                                    padding: wp('5%')
                                }}
                            >
                                <View
                                    style={{
                                        padding: wp('3%'),
                                        borderRadius: wp('3.5%'),
                                        backgroundColor: selectedRole === 'seeker' ? theme.brand : (isDark ? '#27272a' : '#e4e4e7')
                                    }}
                                >
                                    <User size={wp('6%')} color={selectedRole === 'seeker' ? (isDark ? '#000' : '#fff') : (isDark ? '#a1a1aa' : '#6b7280')} />
                                </View>
                                <View style={{ flex: 1, marginLeft: wp('4%') }}>
                                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.8%'), color: theme.text }}>Job Seeker</Text>
                                    <Text
                                        style={{ marginTop: hp('0.5%'), fontFamily: 'Outfit-Medium', fontSize: wp('3.6%'), color: isDark ? '#a1a1aa' : '#6b7280' }}
                                    >
                                        Looking for my next opportunity.
                                    </Text>
                                </View>
                            </MotiView>
                        </TouchableOpacity>

                        {/* Recruiter Role */}
                        <TouchableOpacity activeOpacity={0.9} onPress={() => handleRoleSelection('employer')}>
                            <MotiView
                                animate={{
                                    scale: selectedRole === 'employer' ? 1.02 : 1,
                                    borderColor: selectedRole === 'employer' ? theme.brand : isDark ? '#27272a' : '#e4e4e7',
                                    backgroundColor: selectedRole === 'employer' ? `${theme.brand}10` : isDark ? '#18181b' : '#f4f4f5',
                                }}
                                transition={{ type: 'timing', duration: 200 }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderRadius: wp('6%'),
                                    padding: wp('5%')
                                }}
                            >
                                <View
                                    style={{
                                        padding: wp('3%'),
                                        borderRadius: wp('3.5%'),
                                        backgroundColor: selectedRole === 'employer' ? theme.brand : (isDark ? '#27272a' : '#e4e4e7')
                                    }}
                                >
                                    <Briefcase size={wp('6%')} color={selectedRole === 'employer' ? (isDark ? '#000' : '#fff') : (isDark ? '#a1a1aa' : '#6b7280')} />
                                </View>
                                <View style={{ flex: 1, marginLeft: wp('4%') }}>
                                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.8%'), color: theme.text }}>Recruiter</Text>
                                    <Text
                                        style={{ marginTop: hp('0.5%'), fontFamily: 'Outfit-Medium', fontSize: wp('3.6%'), color: isDark ? '#a1a1aa' : '#6b7280' }}
                                    >
                                        I want to hire top talent.
                                    </Text>
                                </View>
                            </MotiView>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }} />

                    <MotiView animate={{ opacity: selectedRole ? 1 : 0.5, translateY: selectedRole ? 0 : 10 }}>
                        <TouchableOpacity
                            disabled={!selectedRole}
                            onPress={handleContinue}
                            style={{
                                borderRadius: wp('5%'),
                                alignItems: 'center',
                                paddingVertical: hp('2.2%'),
                                marginBottom: hp('2.5%'),
                                backgroundColor: selectedRole ? (isDark ? theme.brand : '#000') : (isDark ? '#27272a' : '#e4e4e7'),
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 10,
                                elevation: 5,
                            }}
                        >
                            <Text style={{
                                fontFamily: 'Outfit-Bold',
                                fontSize: wp('5%'),
                                color: selectedRole ? (isDark ? '#000' : '#fff') : (isDark ? '#52525b' : '#a1a1aa')
                            }}>
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </MotiView>

                    <TouchableOpacity
                        style={{ alignItems: 'center', marginBottom: hp('4%') }}
                        onPress={() => router.push('/screens/auth/login')}
                    >
                        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: wp('4%'), color: isDark ? '#a1a1aa' : '#6b7280' }}>
                            Already have an account? <Text style={{ color: theme.brand }}>Log In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}