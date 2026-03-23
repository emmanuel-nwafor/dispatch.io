import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    ActivityIndicator,
    Alert
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '@/app/constants/Colors';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { jobs as jobsApi, Job } from '@/app/data/api';
import { useUserStore } from '@/hooks/useUserStore';
import { formatRelative } from '@/app/utils/dateFormatter';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function JobDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const { user: currentUser } = useUserStore();
    const insets = useSafeAreaInsets();

    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            try {
                const res = await jobsApi.getById(id as string);
                if (res.success) {
                    setJob(res.job);
                }
            } catch (error) {
                console.error("Failed to fetch job details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleDelete = () => {
        Alert.alert(
            "Delete Job",
            "Are you sure you want to delete this job posting? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            const res = await jobsApi.delete(id as string);
                            if (res.success) {
                                router.back();
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete job.");
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View
                style={{ backgroundColor: theme.background }}
                className="flex-1 justify-center items-center"
            >
                {/* Custom requested color: dark green */}
                <ActivityIndicator size="large" color="#006400" />
            </View>
        );
    }

    if (!job) {
        return (
            <View
                style={{ backgroundColor: theme.background }}
                className="flex-1 justify-center items-center px-10"
            >
                <Feather name="frown" size={wp(15)} color={theme.text} style={{ opacity: 0.3 }} />
                <Text
                    style={{ fontFamily: 'Outfit-Medium', fontSize: wp(4.5), color: theme.text }}
                    className="mt-4 text-center"
                >
                    Job not found
                </Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-5">
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isJobOwner = currentUser?.role === 'recruiter' && job.recruiter?._id === currentUser?._id;
    const companyName = job.recruiter?.recruiterProfile?.companyName || job.companyName;
    const logoUrl = job.recruiter?.avatar || 'https://via.placeholder.com/150';
    const salaryText = job.salaryRange ? `${job.salaryRange.currency} ${job.salaryRange.min} - ${job.salaryRange.max}` : 'Not Specified';

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Header Area */}
            <View
                style={{ paddingTop: insets.top + hp(1), height: hp(12) }}
                className="flex-row justify-between items-center px-5 absolute top-0 left-0 right-0 z-50"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className={`w-11 h-11 rounded-full items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                >
                    <Feather name="chevron-left" size={wp(6)} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    className={`w-11 h-11 rounded-full items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                >
                    <Ionicons name="bookmark-outline" size={wp(5.5)} color={theme.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp(15) }}
            >
                {/* Profile/Hero Section */}
                <View style={{ marginTop: hp(13) }} className="items-center px-6">
                    <View
                        style={{ width: wp(24), height: wp(24) }}
                        className={`rounded-3xl border overflow-hidden mb-5 items-center justify-center ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200 shadow-sm'}`}
                    >
                        <Image source={{ uri: logoUrl }} className="w-full h-full" resizeMode="contain" />
                    </View>

                    <Text
                        style={{ fontSize: wp(6.5), fontFamily: 'Outfit-Bold', color: theme.text }}
                        className="text-center"
                    >
                        {job.title}
                    </Text>

                    <View className="flex-row items-center mt-2 mb-6">
                        <Text style={{ fontFamily: 'Outfit-Medium', color: theme.brand }} className="text-base">
                            {companyName}
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-zinc-400 mx-3" />
                        <Text style={{ fontFamily: 'Outfit-Regular' }} className="text-zinc-500 text-base">
                            {job.location}
                        </Text>
                    </View>

                    {/* Meta Stats Row */}
                    <View className="flex-row flex-wrap justify-center gap-2">
                        <MetaBadge icon="dollar-sign" label={salaryText} isDark={isDark} theme={theme} />
                        <MetaBadge icon="briefcase" label={job.jobType} isDark={isDark} theme={theme} />
                        <MetaBadge icon="clock" label={formatRelative(job.createdAt)} isDark={isDark} theme={theme} />
                    </View>
                </View>

                {/* Main Content Body */}
                <View className="px-6 mt-10">
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl mb-3">
                        Description
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Outfit-Regular',
                            fontSize: wp(3.9),
                            lineHeight: wp(6),
                            color: isDark ? '#a1a1aa' : '#52525b'
                        }}
                    >
                        {job.description}
                    </Text>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                        <View className="mt-8">
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl mb-4">
                                Required Skills
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {job.skillsRequired.map((skill: string, index: number) => (
                                    <View
                                        key={index}
                                        className={`px-4 py-2 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                                    >
                                        <Text style={{ fontFamily: 'Outfit-Medium', color: theme.text }}>
                                            {skill}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Fixed Footer Actions */}
            <View
                style={{
                    paddingBottom: insets.bottom + hp(2),
                    borderTopWidth: 1,
                    borderTopColor: isDark ? '#27272a' : '#f4f4f5',
                    backgroundColor: theme.background
                }}
                className="absolute bottom-0 left-0 right-0 px-5 pt-4"
            >
                {isJobOwner ? (
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleDelete}
                            disabled={isDeleting}
                            style={{ height: hp(7) }}
                            className={`flex-1 flex-row items-center justify-center rounded-2xl bg-red-500 ${isDeleting ? 'opacity-50' : ''}`}
                        >
                            {isDeleting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Feather name="trash-2" size={20} color="#fff" />
                                    <Text style={{ fontFamily: 'Outfit-Bold' }} className="text-white ml-2">Delete</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ height: hp(7), backgroundColor: theme.brand }}
                            className="flex-[2] items-center justify-center rounded-2xl"
                        >
                            <Text style={{ fontFamily: 'Outfit-Bold' }} className="text-black text-lg">Edit Job</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={{ height: hp(7), backgroundColor: theme.brand }}
                        className="w-full items-center justify-center rounded-2xl shadow-lg shadow-black/20"
                    >
                        <Text style={{ fontFamily: 'Outfit-Bold' }} className="text-black text-lg">Apply Now</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// Reusable Meta Badge Component
const MetaBadge = ({ icon, label, isDark, theme }: any) => (
    <View
        className={`flex-row items-center px-3 py-2 rounded-xl ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}
    >
        <Feather name={icon} size={wp(3.5)} color={isDark ? '#a1a1aa' : '#71717a'} />
        <Text
            style={{ fontFamily: 'Outfit-Bold', fontSize: wp(3.2), marginLeft: wp(1.5), color: isDark ? '#e4e4e7' : '#3f3f46' }}
        >
            {label}
        </Text>
    </View>
);