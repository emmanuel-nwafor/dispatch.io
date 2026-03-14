import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { Colors } from '@/app/constants/Colors';
import { auth } from '@/app/data/api';
import { storage } from '@/app/utils/storage';

export default function InputPasswordScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!password) {
            Toast.show({
                type: 'error',
                text1: 'Password Required',
                text2: 'Please enter your password to continue'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await auth.login(email, password);

            if (response.success && response.token) {
                // Save token and user info
                await storage.saveToken(response.token);
                await storage.saveUser(response.user);

                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: `Welcome back, ${response.user.details.fullName || 'User'}`
                });

                // Navigate to home or dashboard
                // router.replace('/(tabs)/home');
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message || 'Invalid password, please try again.'
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
                >
                    <View style={{ marginTop: hp('5%') }}>
                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: wp('8%') }}>
                            Enter Password
                        </Text>
                        <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280', fontSize: wp('4.5%'), marginTop: 8 }}>
                            Welcome back {email}. Please enter your password.
                        </Text>

                        <View style={{ marginTop: hp('6%') }}>
                            <View
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="p-4 rounded-2xl border border-zinc-800/10"
                            >
                                <TextInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    secureTextEntry
                                    style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: 16 }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? theme.brand : '#000000', marginTop: 20 }}
                                className="py-4 rounded-2xl items-center"
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#006400" /> // Dark Green Activity Indicator
                                ) : (
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#000000' : '#FFFFFF', fontSize: 18 }}>
                                        Sign In
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="mt-6 items-center"
                                onPress={() => router.back()}
                            >
                                <Text style={{ fontFamily: 'Outfit-Medium', color: theme.brand }}>
                                    Use a different email
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}