import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Text, TouchableOpacity, View, useColorScheme, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useUserStore } from '@/hooks/useUserStore';
import { Colors } from '@/app/constants/Colors';

export default function RoleSelectScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const selectedRole = useUserStore((state) => state.role);
    const setRole = useUserStore((state) => state.setRole);

    const handleContinue = () => {
        if (selectedRole) {
            router.push('/screens/auth/signup/email');
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            <LinearGradient
                colors={[`${theme.brand}15`, 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.5 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView className="flex-1">
                <View className="flex-1" style={{ paddingHorizontal: wp('6%'), paddingTop: hp('5%') }}>
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 800 }}
                        className="flex-row items-center"
                        style={{ marginBottom: hp('4%') }}
                    >
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={{ width: wp('8%'), height: wp('8%') }}
                            resizeMode="contain"
                        />
                        <Text
                            className="ml-2"
                            style={{ fontFamily: 'Outfit-Bold', fontSize: wp('5.5%'), color: theme.text }}
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
                            className="mt-1"
                            style={{ fontFamily: 'Outfit-Medium', fontSize: wp('4.5%'), color: isDark ? '#a1a1aa' : '#6b7280' }}
                        >
                            Select how you want to use the platform.
                        </Text>
                    </MotiView>

                    <View className="flex-col" style={{ marginTop: hp('6%'), gap: hp('2%') }}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setRole('seeker')}>
                            <MotiView
                                animate={{
                                    scale: selectedRole === 'seeker' ? 1.02 : 1,
                                    borderColor: selectedRole === 'seeker' ? theme.brand : isDark ? '#27272a' : '#e4e4e7',
                                    backgroundColor: selectedRole === 'seeker' ? `${theme.brand}10` : isDark ? '#18181b' : '#f4f4f5',
                                }}
                                className="flex-row items-center border rounded-[24px]"
                                style={{ padding: wp('5%') }}
                            >
                                <View
                                    className="rounded-[14px]"
                                    style={{
                                        padding: wp('3%'),
                                        backgroundColor: selectedRole === 'seeker' ? theme.brand : (isDark ? '#27272a' : '#e4e4e7')
                                    }}
                                >
                                    <User size={24} color={selectedRole === 'seeker' ? (isDark ? '#000' : '#fff') : (isDark ? '#a1a1aa' : '#6b7280')} />
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.8%'), color: theme.text }}>Job Seeker</Text>
                                    <Text
                                        className="mt-1"
                                        style={{ fontFamily: 'Outfit-Medium', fontSize: wp('3.6%'), color: isDark ? '#a1a1aa' : '#6b7280' }}
                                    >
                                        Looking for my next opportunity.
                                    </Text>
                                </View>
                            </MotiView>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.9} onPress={() => setRole('employer')}>
                            <MotiView
                                animate={{
                                    scale: selectedRole === 'employer' ? 1.02 : 1,
                                    borderColor: selectedRole === 'employer' ? theme.brand : isDark ? '#27272a' : '#e4e4e7',
                                    backgroundColor: selectedRole === 'employer' ? `${theme.brand}10` : isDark ? '#18181b' : '#f4f4f5',
                                }}
                                className="flex-row items-center border rounded-[24px]"
                                style={{ padding: wp('5%') }}
                            >
                                <View
                                    className="rounded-[14px]"
                                    style={{
                                        padding: wp('3%'),
                                        backgroundColor: selectedRole === 'employer' ? theme.brand : (isDark ? '#27272a' : '#e4e4e7')
                                    }}
                                >
                                    <Briefcase size={24} color={selectedRole === 'employer' ? (isDark ? '#000' : '#fff') : (isDark ? '#a1a1aa' : '#6b7280')} />
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.8%'), color: theme.text }}>Recruiter</Text>
                                    <Text
                                        className="mt-1"
                                        style={{ fontFamily: 'Outfit-Medium', fontSize: wp('3.6%'), color: isDark ? '#a1a1aa' : '#6b7280' }}
                                    >
                                        I want to hire top talent.
                                    </Text>
                                </View>
                            </MotiView>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1" />

                    <MotiView animate={{ opacity: selectedRole ? 1 : 0.5, translateY: selectedRole ? 0 : 10 }}>
                        <TouchableOpacity
                            className="rounded-[20px] items-center shadow-md"
                            style={{
                                paddingVertical: hp('2.2%'),
                                marginBottom: hp('2.5%'),
                                backgroundColor: selectedRole ? (isDark ? theme.brand : '#000') : (isDark ? '#27272a' : '#e4e4e7')
                            }}
                            onPress={handleContinue}
                            disabled={!selectedRole}
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
                        className="items-center"
                        style={{ marginBottom: hp('4%') }}
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