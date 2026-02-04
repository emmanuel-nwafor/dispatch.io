import { Colors } from '@/app/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView className="flex-1 justify-center items-center p-6">
                <Text
                    style={{ fontFamily: 'Outfit-Bold', color: theme.text }}
                    className="text-2xl"
                >
                    History
                </Text>
                <Text
                    style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }}
                    className="text-base mt-2 text-center"
                >
                    View your past applications and activity.
                </Text>
            </SafeAreaView>
        </View>
    );
}
