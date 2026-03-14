import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    useColorScheme,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { Colors } from '@/app/constants/Colors';
import { auth } from '@/app/data/api';
import { storage } from '@/app/utils/storage';

export default function Login() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please enter both email and password'
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await auth.login(email.toLowerCase().trim(), password);

            if (response.success) {
                await storage.saveToken(response.token);
                await storage.saveUser(response.user);

                // Trigger the Modal instead of immediate navigation
                setModalVisible(true);

                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: 'Welcome back to dispatch.io!'
                });

                router.replace('/screens/(home)');
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message || 'Invalid credentials'
            });
        } finally {
            setIsLoading(false);
        }
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
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: hp('5%'), flex: 1 }}>
                        {/* Header Section */}
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

                        {/* Form Section */}
                        <View style={{ marginTop: hp('4%') }}>
                            <View
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="p-2.5 px-4 rounded-xl border border-zinc-800/10 mb-3"
                            >
                                <TextInput
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: 15 }}
                                />
                            </View>

                            <View
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="p-2.5 px-4 rounded-xl border border-zinc-800/10 flex-row items-center"
                            >
                                <TextInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    secureTextEntry={!isPasswordVisible}
                                    style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: 15, flex: 1 }}
                                />
                                <TouchableOpacity
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="ml-2"
                                >
                                    <Ionicons
                                        name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={isDark ? '#a1a1aa' : '#6b7280'}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? theme.brand : '#000000' }}
                                className="py-3.5 rounded-xl items-center mt-6"
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#006400" />
                                ) : (
                                    <Text
                                        style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#000000' : '#FFFFFF' }}
                                        className="text-lg"
                                    >
                                        Login
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center my-8">
                            <View className="flex-1 h-[1px] bg-zinc-800/30" />
                            <Text style={{ fontFamily: 'Outfit-Medium' }} className="mx-4 text-zinc-500">or</Text>
                            <View className="flex-1 h-[1px] bg-zinc-800/30" />
                        </View>

                        {/* Social Login */}
                        <View className="flex-row justify-between space-x-4">
                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="flex-1 py-3.5 rounded-xl border border-zinc-800/10 items-center justify-center"
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="flex-1 py-3.5 rounded-xl border border-zinc-800/10 items-center justify-center"
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
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