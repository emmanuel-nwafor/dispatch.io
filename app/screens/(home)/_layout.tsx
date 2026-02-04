import { Colors } from '@/app/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';


export default function TabLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tabIconSelected,
                tabBarInactiveTintColor: theme.tabIconDefault,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopWidth: 0.5,
                    borderTopColor: colorScheme === 'dark' ? '#333' : '#eee', // Subtle border
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
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'Feed',
                    tabBarIcon: ({ color }) => <FontAwesome name="list-alt" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <FontAwesome name="history" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
