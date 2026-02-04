import { Colors } from '@/app/constants/Colors';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView className="flex-1 p-6">
                <View className="mb-8 items-center">
                    <View
                        style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                        className="w-24 h-24 rounded-full justify-center items-center mb-4 border border-zinc-800/10"
                    >
                        <Text style={{ fontSize: 40 }}>👤</Text>
                    </View>
                    <Text
                        style={{ fontFamily: 'Outfit-Bold', color: theme.text }}
                        className="text-2xl"
                    >
                        User Name
                    </Text>
                    <Text
                        style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }}
                        className="text-base"
                    >
                        user@example.com
                    </Text>
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                    className="p-4 rounded-xl flex-row justify-between items-center mb-4 border border-zinc-800/10"
                    onPress={() => router.replace('/screens/auth/login')}
                >
                    <Text style={{ fontFamily: 'Outfit-Medium', color: '#ef4444' }}>
                        Log Out
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}
