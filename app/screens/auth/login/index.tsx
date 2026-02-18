import { Colors } from '@/app/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Login() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [email, setEmail] = useState('');

    const handleLogin = () => {
        // Check for empty input
        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Email Required',
                text2: 'Please enter your email to continue'
            });
            return;
        }

        // Regex Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Format',
                text2: 'Please enter a valid email address (e.g. name@job.com)'
            });
            return;
        }

        // Success
        Toast.show({
            type: 'success',
            text1: 'Welcome Back',
            text2: 'Sending your secure login code...'
        });

        setTimeout(() => {
            router.push('/screens/auth/otp/verify-otp');
        }, 1200);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <LinearGradient
                colors={[`${theme.brand}15`, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.4, y: 0.4 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp('6%') }}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: hp('5%'), flex: 1 }}>
                        <View className="flex-row items-center mb-2">
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={{ width: wp('10%'), height: wp('10%') }}
                                resizeMode="contain"
                            />
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-2xl ml-2">
                                dispatch.io
                            </Text>
                        </View>

                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-3xl mt-4">
                            Welcome Back
                        </Text>
                        <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }} className="text-lg mt-2">
                            Sign in to continue your career journey.
                        </Text>

                        <View style={{ marginTop: hp('6%') }}>
                            <View
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="p-3 rounded-2xl border border-zinc-800/10"
                            >
                                <TextInput
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: 16 }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? theme.brand : '#000000' }}
                                className="py-4 rounded-2xl items-center mt-4"
                                onPress={handleLogin}
                            >
                                <Text
                                    style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#000000' : '#FFFFFF' }}
                                    className="text-lg"
                                >
                                    Continue with Email
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center my-10">
                            <View className="flex-1 h-[1px] bg-zinc-800/30" />
                            <Text style={{ fontFamily: 'Outfit-Medium' }} className="mx-4 text-zinc-500">or</Text>
                            <View className="flex-1 h-[1px] bg-zinc-800/30" />
                        </View>

                        <View className="flex-row justify-between space-x-4">
                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="flex-1 py-4 rounded-2xl border border-zinc-800/10 items-center justify-center"
                                onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Google login is currently being set up.' })}
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="flex-1 py-4 rounded-2xl border border-zinc-800/10 items-center justify-center"
                                onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Apple login is currently being set up.' })}
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginBottom: hp('4%'), marginTop: 20 }} className="items-center">
                        <TouchableOpacity onPress={() => router.push('/screens/auth/signup/email')}>
                            <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }}>
                                Don't have an account? <Text style={{ color: theme.brand }}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}