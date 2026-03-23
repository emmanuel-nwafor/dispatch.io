import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Image,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { jobs as jobsApi, Job } from '@/app/data/api';
import { formatRelative } from '@/app/utils/dateFormatter';

// interface PostedJob removed since we use Job from api.ts

export default function RecruitersJobs() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [myJobs, setMyJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadJobs = async () => {
        try {
            const res = await jobsApi.getAll({ recruiter: 'me' });
            if (res.success) {
                setMyJobs(res.jobs);
            }
        } catch (error) {
            console.error("Failed to load recruiter jobs:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadJobs();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadJobs();
    };

    const handleDeleteJob = (id: string, title: string) => {
        Alert.alert(
            "Delete Job",
            `Are you sure you want to delete "${title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await jobsApi.delete(id);
                            if (res.success) {
                                setMyJobs(prev => prev.filter(j => j._id !== id));
                            }
                        } catch (e) {
                            console.error("Failed to delete job", e);
                        }
                    }
                }
            ]
        );
    };

    const activePostingsCount = myJobs.filter(j => j.status === 'open').length;
    const totalApplicantsCount = myJobs.reduce((acc, curr) => acc + (curr.applicantsCount || 0), 0);

    const renderJobItem = (job: Job) => (
        <View key={job._id} style={[styles.jobCard, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.jobInfo}
                onPress={() => router.push(`/screens/jobs/${job._id}` as any)}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
                        <Text style={styles.companyInfo}>{job.companyName} • {job.location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity onPress={() => router.push({ pathname: '/screens/(recruiters)/post', params: { id: job._id } } as any)} style={{ padding: 4 }}>
                            <Ionicons name="pencil" size={20} color={theme.brand} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteJob(job._id, job.title)} style={{ padding: 4 }}>
                            <Ionicons name="trash" size={20} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.statusRow, { marginTop: 8 }]}>
                    <View style={[styles.statusBadge, { backgroundColor: job.status === 'open' ? 'rgba(132, 204, 22, 0.1)' : 'rgba(113, 113, 122, 0.1)' }]}>
                        <Text style={[styles.statusText, { color: job.status === 'open' ? theme.brand : '#71717a' }]}>
                            {job.status === 'open' ? 'Active' : 'Closed'}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>Posted {formatRelative(job.createdAt)}</Text>
                </View>

                <View style={[styles.metricsRow, { marginTop: 12 }]}>
                    <TouchableOpacity 
                        style={styles.metric} 
                        onPress={() => router.push(`/screens/(recruiters)/applicants/${job._id}` as any)}
                        activeOpacity={0.6}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={[styles.metricValue, { color: theme.brand, textDecorationLine: 'underline' }]}>{job.applicantsCount || 0}</Text>
                        <Text style={[styles.metricLabel, { color: theme.brand }]}>Applicants</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );

    if (isLoading && !refreshing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color={theme.brand} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.brand} />}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Jobs</Text>
                        <TouchableOpacity
                            style={[styles.postButton, { backgroundColor: theme.brand }]}
                            onPress={() => router.push('/screens/(recruiters)/post' as any)}
                        >
                            <Text style={styles.postButtonText}>Post a job</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Dashboard Stats */}
                    <View style={styles.dashboardGrid}>
                        <View style={[styles.dashboardCard, { backgroundColor: isDark ? '#111111' : '#f9f9f9', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <Text style={[styles.dashValue, { color: theme.text }]}>{activePostingsCount}</Text>
                            <Text style={styles.dashLabel}>Active Postings</Text>
                        </View>
                        <View style={[styles.dashboardCard, { backgroundColor: isDark ? '#111111' : '#f9f9f9', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <Text style={[styles.dashValue, { color: theme.brand }]}>{totalApplicantsCount}</Text>
                            <Text style={styles.dashLabel}>Total Applicants</Text>
                        </View>
                    </View>

                    {/* Jobs List */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Job Postings</Text>
                        {myJobs.length > 0 ? (
                            myJobs.map(renderJobItem)
                        ) : (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Text style={{ color: theme.text, fontFamily: 'Outfit-Regular', opacity: 0.7 }}>
                                    You haven't posted any jobs yet.
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 28,
    },
    postButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
        color: '#000',
    },
    dashboardGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 24,
    },
    dashboardCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    dashValue: {
        fontFamily: 'Outfit-Bold',
        fontSize: 24,
        marginBottom: 4,
    },
    dashLabel: {
        fontFamily: 'Outfit-Medium',
        fontSize: 14,
        color: '#71717a',
    },
    section: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 20,
        marginBottom: 16,
    },
    jobCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    jobInfo: {
        flex: 1,
    },
    jobTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
        marginBottom: 4,
    },
    companyInfo: {
        fontFamily: 'Outfit-Medium',
        fontSize: 14,
        color: '#71717a',
        marginBottom: 8,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 12,
    },
    dateText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        color: '#a1a1aa',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 24,
    },
    metric: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    metricValue: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
    },
    metricLabel: {
        fontFamily: 'Outfit-Medium',
        fontSize: 13,
        color: '#71717a',
    }
});
