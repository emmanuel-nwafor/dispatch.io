import { Colors } from '@/app/constants/Colors';
import JobFilterModal from '@/components/modals/JobFilterModal';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
const JOBS_DATA = [
    {
        id: '1',
        title: 'Senior Product Designer',
        company: 'Linear',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Linear_Logo.png',
        location: 'San Francisco, CA',
        type: 'Remote',
        salary: '$180k - $220k',
        tags: ['Design', 'Figma', 'System'],
        posted: '2h ago',
        color: '#5E6AD2',
    },
    {
        id: '2',
        title: 'Frontend Engineer',
        company: 'Vercel',
        logo: 'search',
        isIcon: true,
        location: 'Remote',
        type: 'Full-time',
        salary: '$160k - $200k',
        tags: ['React', 'Next.js', 'TypeScript'],
        posted: '4h ago',
        color: '#000000',
    },
    {
        id: '3',
        title: 'Staff Software Engineer',
        company: 'OpenAI',
        logo: 'github',
        isIcon: true,
        location: 'San Francisco, CA',
        type: 'Hybrid',
        salary: '$250k - $380k',
        tags: ['AI', 'Python', 'Infrastructure'],
        posted: '1d ago',
        color: '#10A37F',
    },
    {
        id: '4',
        title: 'iOS Developer',
        company: 'Airbnb',
        logo: 'logo-airbnb',
        isIcon: true,
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$190k - $240k',
        tags: ['Swift', 'SwiftUI', 'Mobile'],
        posted: '2d ago',
        color: '#FF5A5F',
    },
    {
        id: '5',
        title: 'Marketing Lead',
        company: 'Spotify',
        logo: 'musical-notes',
        isIcon: true,
        location: 'London, UK',
        type: 'Hybrid',
        salary: '$140k - $180k',
        tags: ['Marketing', 'Brand', 'Growth'],
        posted: '3d ago',
        color: '#1DB954',
    },
];

const FILTERS = ['All', 'Remote', 'Design', 'Engineering', 'Product', 'Marketing'];

export default function FeedScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(null);

    const handleApplyFilters = (filters: any) => {
        console.log('Applied Filters:', filters);
        setAppliedFilters(filters);
        // Here you would typically filter your JOBS_DATA based on these values
    };

    const renderJobItem = ({ item }: { item: typeof JOBS_DATA[0] }) => (
        <TouchableOpacity
            onPress={() => router.push(`/screens/feed/${item.id}`)}
            activeOpacity={0.7}
            style={{
                backgroundColor: isDark ? '#18181b' : '#fff',
                borderColor: isDark ? '#27272a' : '#f4f4f5',
                borderWidth: 1,
            }}
            className="mb-4 p-5 rounded-3xl"
        >
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row">
                    <View
                        style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    >
                        {item.isIcon ? (
                            <Ionicons name={item.logo as any} size={24} color={isDark ? '#fff' : '#000'} />
                        ) : (
                            <Image source={{ uri: item.logo }} className="w-8 h-8 resize-contain" />
                        )}
                    </View>
                    <View>
                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-lg">
                            {item.title}
                        </Text>
                        <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#71717a' }} className="text-sm">
                            {item.company} • {item.location}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={22} color={isDark ? '#52525b' : '#a1a1aa'} />
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap mb-4 gap-2">
                {item.tags.map((tag, index) => (
                    <View
                        key={index}
                        style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
                        className="px-3 py-1.5 rounded-lg"
                    >
                        <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#d4d4d8' : '#52525b', fontSize: 11 }}>
                            {tag}
                        </Text>
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between items-center pt-2 border-t" style={{ borderColor: isDark ? '#27272a' : '#f4f4f5' }}>
                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-sm">
                    {item.salary}
                </Text>
                <View className="flex-row items-center">
                    <Feather name="clock" size={12} color={isDark ? '#71717a' : '#a1a1aa'} />
                    <Text style={{ fontFamily: 'Outfit-Regular', color: isDark ? '#71717a' : '#a1a1aa', marginLeft: 4, fontSize: 12 }}>
                        {item.posted}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView className="flex-1 mb-20" edges={['top', 'left', 'right']} >
                {/* Header */}
                <View className="px-6 pt-2 pb-4">
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-3xl mb-1">
                        Find your
                    </Text>
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand }} className="text-3xl">
                        next role.
                    </Text>
                </View>

                {/* Search Bar */}
                <View className="px-6 mb-4 flex-row items-center">
                    <View
                        style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                        className="flex-1 h-12 rounded-2xl flex-row items-center px-4 border border-zinc-800/5"
                    >
                        <Ionicons name="search" size={20} color={isDark ? '#71717a' : '#a1a1aa'} />
                        <TextInput
                            placeholder="Design, Engineering, etc."
                            placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                            style={{
                                flex: 1,
                                marginLeft: 10,
                                fontFamily: 'Outfit-Medium',
                                color: theme.text,
                                height: '100%'
                            }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* TRIGGER MODAL BUTTON */}
                    <TouchableOpacity
                        onPress={() => setIsFilterModalVisible(true)}
                        style={{ backgroundColor: theme.brand }}
                        className="w-12 h-12 rounded-2xl items-center justify-center ml-3"
                    >
                        <Ionicons name="options-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <View className="h-14">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 5 }}
                    >
                        {FILTERS.map((filter, index) => {
                            const isActive = activeFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setActiveFilter(filter)}
                                    style={{
                                        backgroundColor: isActive ? theme.brand : (isDark ? '#18181b' : '#f4f4f5'),
                                        marginRight: 8
                                    }}
                                    className="px-5 py-2.5 rounded-full border border-zinc-800/5 items-center justify-center"
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Outfit-Bold',
                                            color: isActive ? '#000' : (isDark ? '#d4d4d8' : '#71717a')
                                        }}
                                        className="text-sm"
                                    >
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Job List */}
                <FlatList
                    data={JOBS_DATA}
                    renderItem={renderJobItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center mt-20">
                            <Text style={{ fontFamily: 'Outfit-Medium', color: theme.text }}>No roles found.</Text>
                        </View>
                    )}
                />
            </SafeAreaView>

            {/* Filter Modal Component */}
            <JobFilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={handleApplyFilters}
            />
        </View>
    );
}