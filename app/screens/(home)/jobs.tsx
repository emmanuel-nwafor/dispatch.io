import { Colors } from '@/app/constants/Colors';
import JobFilterModal from '@/components/modals/JobFilterModal';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useMemo } from 'react';
import {
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { jobs as jobsApi, Job } from '@/app/data/api';

const CATEGORIES = ['All', 'Remote', 'Full-time', 'Internship', 'Freelance'];

export default function FeedScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    // State
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await jobsApi.getAll();
            if (res.success) {
                setAllJobs(res.jobs);
            }
        } catch (err) {
            console.error("Fetch Jobs Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Combined Search and Filter Logic
    const filteredJobs = useMemo(() => {
        return allJobs.filter(job => {
            // 1. Search Query Filter (Title or Company)
            const matchesSearch =
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Category Chip Filter
            const matchesCategory = activeCategory === 'All' || job.jobType === activeCategory;

            // 3. Modal Filters
            let matchesModal = true;
            if (appliedFilters) {
                const { category, jobTypes, salary } = appliedFilters;

                if (category !== 'All' && job.jobType !== category) matchesModal = false;
                if (jobTypes.length > 0 && !jobTypes.includes(job.jobType)) matchesModal = false;

                // Simple Salary Check (Assuming API range matches tier logic)
                if (salary === '150+' && job.salaryRange.max < 150000) matchesModal = false;
            }

            return matchesSearch && matchesCategory && matchesModal;
        });
    }, [allJobs, searchQuery, activeCategory, appliedFilters]);

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setIsFilterModalVisible(false);
    };

    const formatSalary = (range: Job['salaryRange']) => {
        const min = range.min >= 1000 ? `${range.min / 1000}k` : range.min;
        const max = range.max >= 1000 ? `${range.max / 1000}k` : range.max;
        return `${range.currency} ${min} - ${max}`;
    };

    const renderJobItem = ({ item }: { item: Job }) => {
        const companyInitial = item.companyName?.charAt(0) || 'J';
        const logoUri = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&size=128`;

        return (
            <TouchableOpacity
                onPress={() => router.push({ pathname: `/screens/feed/${item._id}`, params: { id: item._id } } as any)}
                activeOpacity={0.7}
                style={{
                    backgroundColor: isDark ? '#18181b' : '#fff',
                    borderColor: isDark ? '#27272a' : '#f4f4f5',
                    borderWidth: 1,
                    marginBottom: hp('2%'),
                    padding: wp('5%'),
                    borderRadius: wp('6%'),
                }}
            >
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row flex-1">
                        <View
                            style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4 overflow-hidden"
                        >
                            <Image source={{ uri: logoUri }} className="w-full h-full" resizeMode="cover" />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-lg" numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#71717a' }} className="text-sm">
                                {item.companyName} • {item.location}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="bookmark-outline" size={22} color={isDark ? '#52525b' : '#a1a1aa'} />
                    </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap mb-4 gap-2">
                    <View style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }} className="px-3 py-1.5 rounded-lg">
                        <Text style={{ fontFamily: 'Outfit-Medium', color: theme.brand, fontSize: 11 }}>
                            {item.experienceLevel}
                        </Text>
                    </View>
                    {item.skillsRequired.slice(0, 2).map((tag, index) => (
                        <View key={index} style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }} className="px-3 py-1.5 rounded-lg">
                            <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#d4d4d8' : '#52525b', fontSize: 11 }}>
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row justify-between items-center pt-3 border-t" style={{ borderColor: isDark ? '#27272a' : '#f4f4f5' }}>
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-sm">
                        {formatSalary(item.salaryRange)}
                    </Text>
                    <View className="flex-row items-center">
                        <Feather name="users" size={12} color={isDark ? '#71717a' : '#a1a1aa'} />
                        <Text style={{ fontFamily: 'Outfit-Regular', color: isDark ? '#71717a' : '#a1a1aa', marginLeft: 4, fontSize: 12 }}>
                            {item.applicantsCount} applicants
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>

                {/* Header */}
                <View style={{ paddingHorizontal: wp('6%'), paddingTop: hp('1%'), marginBottom: hp('2%') }}>
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: wp('8%') }}>Find your</Text>
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand, fontSize: wp('8%') }}>next role.</Text>
                </View>

                {/* Search Bar */}
                <View style={{ paddingHorizontal: wp('6%'), marginBottom: hp('2%') }} className="flex-row items-center">
                    <View style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }} className="flex-1 h-12 rounded-2xl flex-row items-center px-4 border border-zinc-800/5">
                        <Ionicons name="search" size={20} color={isDark ? '#71717a' : '#a1a1aa'} />
                        <TextInput
                            placeholder="Search jobs or companies..."
                            placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                            style={{ flex: 1, marginLeft: 10, fontFamily: 'Outfit-Medium', color: theme.text }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => setIsFilterModalVisible(true)}
                        style={{ backgroundColor: theme.brand }}
                        className="w-12 h-12 rounded-2xl items-center justify-center ml-3 shadow-sm"
                    >
                        <Ionicons name="options-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <View style={{ height: hp('6%'), marginBottom: hp('1%') }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: wp('6%'), alignItems: 'center' }}>
                        {CATEGORIES.map((filter, index) => {
                            const isActive = activeCategory === filter;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setActiveCategory(filter)}
                                    style={{
                                        backgroundColor: isActive ? theme.brand : (isDark ? '#18181b' : '#f4f4f5'),
                                        marginRight: wp('2%'),
                                        height: hp('4.5%'),
                                        paddingHorizontal: wp('5%'),
                                    }}
                                    className="rounded-full items-center justify-center"
                                >
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: isActive ? '#fff' : (isDark ? '#d4d4d8' : '#71717a'), fontSize: wp('3.5%') }}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#006400" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredJobs}
                        renderItem={renderJobItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={{ paddingHorizontal: wp('6%'), paddingTop: 10, paddingBottom: hp('12%') }}
                        showsVerticalScrollIndicator={false}
                        onRefresh={fetchJobs}
                        refreshing={loading}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center mt-20">
                                <Ionicons name="briefcase-outline" size={wp('15%')} color={isDark ? '#27272a' : '#e4e4e7'} />
                                <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#52525b' : '#a1a1aa' }} className="mt-4">
                                    No roles match your search.
                                </Text>
                            </View>
                        )}
                    />
                )}
            </SafeAreaView>

            <JobFilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={handleApplyFilters}
            />
        </View>
    );
}