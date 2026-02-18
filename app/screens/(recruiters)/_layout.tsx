import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme, View } from 'react-native';

export default function RecruiterTabLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tabIconSelected,
                tabBarInactiveTintColor: theme.tabIconDefault,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopWidth: 0.5,
                    borderTopColor: colorScheme === 'dark' ? '#333' : '#eee',
                    height: Platform.OS === 'ios' ? 120 : 120,
                    position: "absolute",
                    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Outfit-Medium',
                    fontSize: 12,
                }
            }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="network"
                options={{
                    title: 'My Network',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "people" : "people-outline"} size={26} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="post"
                options={{
                    title: 'Post',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={28} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messaging',
                    tabBarIcon: ({ color, focused }) => (
                        <View>
                            <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={24} color={color} />
                            {/* Typical LinkedIn Notification Dot */}
                            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="jobs"
                options={{
                    title: 'Jobs',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}