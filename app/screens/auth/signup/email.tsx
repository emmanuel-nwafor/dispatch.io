import { Colors } from '@/app/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupUserInputEmail() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Background Gradient */}
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
                        {/* Brand Identity */}
                        <View className="flex-row items-center mb-2">
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={{ width: wp('10%'), height: wp('10%') }}
                                resizeMode="contain"
                            />
                            <Text
                                style={{ fontFamily: 'Outfit-Bold', color: theme.text }}
                                className="text-2xl ml-2"
                            >
                                dispatch.io
                            </Text>
                        </View>

                        <Text
                            style={{ fontFamily: 'Outfit-Bold', color: theme.text }}
                            className="text-3xl mt-4"
                        >
                            Create Account
                        </Text>
                        <Text
                            style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }}
                            className="text-lg mt-2"
                        >
                            Sign up to get started.
                        </Text>

                        {/* Input Fields */}
                        <View style={{ marginTop: hp('6%') }}>
                            <View
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="p-3 rounded-2xl border border-zinc-800/10"
                            >
                                <TextInput
                                    placeholder="Email Address"
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: 16 }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? theme.brand : '#000000' }}
                                className="py-4 rounded-2xl items-center mt-4 shadow-xl"
                                onPress={() => router.replace('/screens/auth/signup/password')}
                            >
                                <Text
                                    style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#000000' : '#FFFFFF' }}
                                    className="text-lg"
                                >
                                    Create Account
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Line Divider with "or" */}
                        <View className="flex-row items-center my-10">
                            <View className="flex-1 h-[1px] bg-zinc-800/30" />
                            <Text style={{ fontFamily: 'Outfit-Medium' }} className="mx-4 text-zinc-500">or</Text>
                            <View className="flex-1 h-[1px] bg-zinc-800/30" />
                        </View>

                        {/* Social Logins */}
                        <View className="flex-row justify-between space-x-4">
                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="flex-1 py-4 rounded-2xl border border-zinc-800/10 items-center justify-center flex-row"
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                                className="flex-1 py-4 rounded-2xl border border-zinc-800/10 items-center justify-center flex-row"
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={{ marginBottom: hp('4%'), marginTop: 20 }} className="items-center">
                        <TouchableOpacity onPress={() => router.push('/screens/auth/login' as any)}>
                            <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }}>
                                Already have an account? <Text style={{ color: theme.brand }}>Log In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}