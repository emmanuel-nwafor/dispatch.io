import { Colors } from '@/app/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThirdOnboardingScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const handleFinish = () => {
        router.replace('/screens/auth/login');
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Linear Gradient Background */}
            <LinearGradient
                colors={[`${theme.brand}20`, 'transparent']}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0.4 }}
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
                            source={require('@/assets/animations/matching-2.json')}
                            style={{
                                width: wp('55%'),
                                height: wp('55%'),
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
                        Smart Job Matching
                    </Text>

                    <Text
                        style={{
                            fontFamily: 'Outfit-Medium',
                            color: isDark ? '#a1a1aa' : '#6b7280'
                        }}
                        className="text-lg text-center px-4 leading-relaxed"
                    >
                        Stop searching. We find roles that perfectly match your skills, experience, and career goals.
                    </Text>
                </View>

                {/* Final Call to Action */}
                <View className="w-full mb-8 px-2">
                    <TouchableOpacity
                        style={{
                            backgroundColor: isDark ? theme.brand : '#000000',
                        }}
                        className="py-5 rounded-2xl items-center w-full"
                        onPress={handleFinish}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={{
                                fontFamily: 'Outfit-Bold',
                                color: isDark ? '#000000' : '#FFFFFF'
                            }}
                            className="text-xl"
                        >
                            Get Started
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}