import { Colors } from '@/app/constants/Colors';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Enhanced Mock Data (In a real app, fetch by ID)
type JobDetails = {
    id: string;
    title: string;
    company: string;
    logo: string;
    isIcon?: boolean;
    location: string;
    type: string;
    salary: string;
    posted: string;
    description: string;
    requirements: string[];
};

const JOB_DETAILS: Record<string, JobDetails> = {
    '1': {
        id: '1',
        title: 'Senior Product Designer',
        company: 'Linear',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Linear_Logo.png',
        location: 'San Francisco, CA',
        type: 'Remote',
        salary: '$180k - $220k',
        posted: '2h ago',
        description: "We are looking for a Senior Product Designer to join our core team. You will be responsible for defining the user experience for our issue tracking tools, working closely with engineering and product to ship high-quality software.",
        requirements: [
            "5+ years of experience in product design",
            "Strong portfolio showcasing UI/UX skills",
            "Experience with design systems",
            "Proficiency in Figma and prototyping",
            "Ability to write code (React/CSS) is a plus"
        ]
    },
    '2': {
        id: '2',
        title: 'Frontend Engineer',
        company: 'Vercel',
        logo: 'code-slash-outline', // Ionicons
        isIcon: true,
        location: 'Remote',
        type: 'Full-time',
        salary: '$160k - $200k',
        posted: '4h ago',
        description: "Join the team building the next generation of web development tools. You will work on the Vercel dashboard, improving performance and user experience for developers worldwide.",
        requirements: [
            "Expertise in React, Next.js, and TypeScript",
            "Deep understanding of web performance",
            "Experience with serverless functions",
            "Strong communication skills",
            "Passion for developer tools"
        ]
    },
    '3': {
        id: '3',
        title: 'Staff Software Engineer',
        company: 'OpenAI',
        logo: 'hardware-chip-outline', // Ionicons
        isIcon: true,
        location: 'San Francisco, CA',
        type: 'Hybrid',
        salary: '$250k - $380k',
        posted: '1d ago',
        description: "Help us build the infrastructure that powers our AI models. You will design and implement scalable systems to support our growing user base and research efforts.",
        requirements: [
            "8+ years of software engineering experience",
            "Experience with distributed systems",
            "Proficiency in Python or Go",
            "Knowledge of ML infrastructure is a plus",
            "Ability to mentor junior engineers"
        ]
    },
    '4': {
        id: '4',
        title: 'iOS Developer',
        company: 'Airbnb',
        logo: 'logo-airbnb', // Ionicons
        isIcon: true,
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$190k - $240k',
        posted: '2d ago',
        description: "We are reimagining the mobile travel experience. As an iOS engineer, you will work on core features of the Airbnb app, ensuring a smooth and delightful experience for millions of users.",
        requirements: [
            "Strong proficiency in Swift and SwiftUI",
            "Experience with iOS frameworks (UIKit, Core Data)",
            "Understanding of mobile architecture patterns",
            "Experience with Unit Testing",
            "Passion for travel and user experience"
        ]
    },
    '5': {
        id: '5',
        title: 'Marketing Lead',
        company: 'Spotify',
        logo: 'musical-notes-outline', // Ionicons
        isIcon: true,
        location: 'London, UK',
        type: 'Hybrid',
        salary: '$140k - $180k',
        posted: '3d ago',
        description: "Lead our marketing efforts for new features. You will craft compelling narratives, manage campaigns, and work cross-functionally to drive adoption and engagement.",
        requirements: [
            "6+ years of marketing experience",
            "Experience in tech/SaaS",
            "Strong storytelling and copywriting skills",
            "Data-driven mindset",
            "Leadership experience"
        ]
    }
};

export default function JobDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const job = JOB_DETAILS[id as string] || JOB_DETAILS['1']; // Fallback to 1 if not found for demo

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Header */}
            <View
                style={{
                    paddingTop: insets.top,
                    paddingHorizontal: 20,
                    height: 60 + insets.top,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.background,
                    zIndex: 10
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Feather name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Hero Section */}
                <View className="items-center px-6 mt-4">
                    <View
                        style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                        className="w-24 h-24 rounded-3xl items-center justify-center mb-6 shadow-sm"
                    >
                        {job.isIcon ? (
                            <Ionicons name={job.logo as any} size={48} color={isDark ? '#fff' : '#000'} />
                        ) : (
                            <Image source={{ uri: job.logo }} className="w-16 h-16 resize-contain" />
                        )}
                    </View>
                    <Text
                        style={{ fontFamily: 'Outfit-Bold', color: theme.text }}
                        className="text-2xl text-center mb-2"
                    >
                        {job.title}
                    </Text>
                    <View className="flex-row items-center mb-6">
                        <Text style={{ fontFamily: 'Outfit-Medium', color: theme.brand }} className="text-base">
                            {job.company}
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-zinc-500 mx-2" />
                        <Text style={{ fontFamily: 'Outfit-Regular', color: '#71717a' }} className="text-base">
                            {job.location}
                        </Text>
                    </View>

                    {/* Meta Tags */}
                    <View className="flex-row gap-3 mb-8">
                        <View
                            style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                            className="px-4 py-2 rounded-xl flex-row items-center"
                        >
                            <Feather name="dollar-sign" size={14} color={theme.text} />
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, marginLeft: 4 }}>
                                {job.salary}
                            </Text>
                        </View>
                        <View
                            style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                            className="px-4 py-2 rounded-xl flex-row items-center"
                        >
                            <Feather name="briefcase" size={14} color={theme.text} />
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, marginLeft: 4 }}>
                                {job.type}
                            </Text>
                        </View>
                        <View
                            style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                            className="px-4 py-2 rounded-xl flex-row items-center"
                        >
                            <Feather name="clock" size={14} color={theme.text} />
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, marginLeft: 4 }}>
                                {job.posted}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="px-6">
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl mb-3">
                        About the Role
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Outfit-Regular',
                            color: isDark ? '#d4d4d8' : '#52525b',
                            lineHeight: 24
                        }}
                        className="text-base mb-8"
                    >
                        {job.description}
                    </Text>

                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl mb-3">
                        Requirements
                    </Text>
                    <View className="gap-3">
                        {job.requirements.map((req: string, index: number) => (
                            <View key={index} className="flex-row items-start">
                                <View style={{ backgroundColor: theme.brand }} className="w-1.5 h-1.5 rounded-full mt-2 mr-3" />
                                <Text
                                    style={{
                                        fontFamily: 'Outfit-Regular',
                                        color: isDark ? '#d4d4d8' : '#52525b',
                                        lineHeight: 22,
                                        flex: 1
                                    }}
                                    className="text-base"
                                >
                                    {req}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: insets.bottom + 20,
                    backgroundColor: theme.background,
                    borderTopWidth: 1,
                    borderTopColor: isDark ? '#27272a' : '#f4f4f5'
                }}
            >
                <TouchableOpacity
                    onPress={() => router.push('/screens/apply')}
                    style={{ backgroundColor: theme.brand }}
                    className="w-full h-14 rounded-2xl items-center justify-center shadow-lg shadow-lime-500/20"
                >
                    <Text style={{ fontFamily: 'Outfit-Bold', color: '#000', fontSize: 18 }}>
                        Apply Now
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
