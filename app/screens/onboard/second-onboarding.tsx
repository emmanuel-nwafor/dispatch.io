import { Colors } from '@/app/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecondOnboardingScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Linear Gradient Background - Shifted start point for visual variety */}
            <LinearGradient
                colors={[`${theme.brand}20`, 'transparent']}
                start={{ x: 0, y: 0 }} // Starts from top-left instead of top-right
                end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView className="flex-1 justify-between p-6">
                <View className="flex-1 justify-center items-center">

                    {/* Animation Container */}
                    <View
                        style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                        className="w-64 h-64 rounded-full justify-center items-center mb-10 border border-zinc-800/10"
                    >
                        <LottieView
                            source={require('@/assets/animations/auto-apply.json')}
                            style={{
                                width: wp('50%'),
                                height: wp('50%'),
                            }}
                            autoPlay
                            loop
                        />
                    </View>

                    <Text
                        style={{
                            fontFamily: 'Outfit-Bold',
                            color: theme.text
                        }}
                        className="text-3xl text-center mb-4"
                    >
                        Automated Applications
                    </Text>

                    <Text
                        style={{
                            fontFamily: 'Outfit-Medium',
                            color: isDark ? '#a1a1aa' : '#6b7280'
                        }}
                        className="text-lg text-center px-4 leading-relaxed"
                    >
                        Apply to thousands of relevant jobs with a single click. We handle the tedious form-filling for you.
                    </Text>
                </View>

                {/* Navigation Controls */}
                <View className="flex-row justify-between items-center mb-8 px-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={{ fontFamily: 'Outfit-Medium' }}
                            className="text-gray-400 text-lg ml-4"
                        >
                            Back
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: isDark ? theme.brand : '#000000',
                        }}
                        className="py-4 px-10 rounded-2xl"
                        onPress={() => router.push('/screens/onboard/third-onboarding')}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={{
                                fontFamily: 'Outfit-Bold',
                                color: isDark ? '#000000' : '#FFFFFF'
                            }}
                            className="text-lg"
                        >
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}