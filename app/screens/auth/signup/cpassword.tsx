import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SignupUserInputConfirmPassword() {
    const router = useRouter();
    const { password } = useLocalSearchParams<{ password: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureConfirmText, setSecureConfirmText] = useState(true);

    const handleCompleteSignup = () => {
        if (!confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Required',
                text2: 'Please confirm your password'
            });
            return;
        }

        if (confirmPassword !== password) {
            Toast.show({
                type: 'error',
                text1: 'Mismatch',
                text2: 'Passwords do not match!'
            });
            return;
        }

        Toast.show({
            type: 'success',
            text1: 'Account Verified',
            text2: 'Welcome to dispatch.io'
        });

        // Little delay to let the toast be seen before navigating
        setTimeout(() => {
            router.replace('/screens/auth/otp/verify-otp');
        }, 1500);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            <LinearGradient
                colors={[`${theme.brand}15`, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.4, y: 0.4 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp('8%') }}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: hp('4%'), flex: 1 }}>
                        <View className="flex-row items-center mb-1">
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={{ width: wp('8%'), height: wp('8%') }}
                                resizeMode="contain"
                            />
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl ml-2">dispatch.io</Text>
                        </View>

                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-2xl mt-3">Confirm Password</Text>
                        <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }} className="text-base mt-1">
                            Final step: re-type your password.
                        </Text>

                        <View style={{ marginTop: hp('4%') }}>
                            {/* Visual reference of the password exists (Hidden for security) */}
                            <View
                                style={{ backgroundColor: isDark ? '#18181b50' : '#f4f4f550', opacity: 0.6 }}
                                className="px-4 py-3 rounded-xl border border-zinc-800/10 flex-row items-center mb-3"
                            >
                                <Ionicons name="lock-closed-outline" size={18} color={isDark ? '#52525b' : '#a1a1aa'} />
                                <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#52525b' : '#a1a1aa', marginLeft: 10 }}>••••••••••••</Text>
                            </View>

                            {/* Actual Confirmation Input */}
                            <View
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="px-4 py-3 rounded-xl border border-zinc-800/10 flex-row items-center"
                            >
                                <TextInput
                                    placeholder="Re-type password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    secureTextEntry={secureConfirmText}
                                    style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: 15, flex: 1 }}
                                />
                                <TouchableOpacity onPress={() => setSecureConfirmText(!secureConfirmText)}>
                                    <Ionicons
                                        name={secureConfirmText ? "eye-off-outline" : "eye-outline"}
                                        size={18}
                                        color={isDark ? '#52525b' : '#a1a1aa'}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? theme.brand : '#000000' }}
                                className="py-3.5 rounded-xl items-center mt-8"
                                onPress={handleCompleteSignup}
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#000000' : '#FFFFFF' }} className="text-base">
                                    Complete Signup
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginBottom: hp('3%'), marginTop: 15 }} className="items-center">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }} className="text-sm">
                                Entered it wrong? <Text style={{ color: theme.brand }}>Go Back</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}