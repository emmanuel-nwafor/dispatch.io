import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface PostedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    status: 'active' | 'closed';
    applicants: {
        total: number;
        new: number;
    };
    postedDate: string;
}

export default function RecruitersJobs() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const jobs: PostedJob[] = [
        {
            id: '1',
            title: 'UI Engineer',
            company: 'Dispatch.io',
            location: 'London, UK (Remote)',
            status: 'active',
            applicants: { total: 124, new: 12 },
            postedDate: '2d ago'
        },
        {
            id: '2',
            title: 'Senior Product Designer',
            company: 'Dispatch.io',
            location: 'London, UK',
            status: 'active',
            applicants: { total: 86, new: 5 },
            postedDate: '5d ago'
        },
        {
            id: '3',
            title: 'Frontend Lead',
            company: 'Dispatch.io',
            location: 'Remote',
            status: 'closed',
            applicants: { total: 210, new: 0 },
            postedDate: '2w ago'
        }
    ];

    const renderJobItem = (job: PostedJob) => (
        <TouchableOpacity
            key={job.id}
            activeOpacity={0.7}
            style={[styles.jobCard, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}
            onPress={() => { }}
        >
            <View style={styles.jobInfo}>
                <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
                <Text style={styles.companyInfo}>{job.company} • {job.location}</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: job.status === 'active' ? 'rgba(132, 204, 22, 0.1)' : 'rgba(113, 113, 122, 0.1)' }]}>
                        <Text style={[styles.statusText, { color: job.status === 'active' ? theme.brand : '#71717a' }]}>
                            {job.status === 'active' ? 'Active' : 'Closed'}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>Posted {job.postedDate}</Text>
                </View>

                <View style={styles.metricsRow}>
                    <View style={styles.metric}>
                        <Text style={[styles.metricValue, { color: theme.text }]}>{job.applicants.total}</Text>
                        <Text style={styles.metricLabel}>Applicants</Text>
                    </View>
                    {job.applicants.new > 0 && (
                        <View style={styles.metric}>
                            <Text style={[styles.metricValue, { color: theme.brand }]}>{job.applicants.new}</Text>
                            <Text style={styles.metricLabel}>New</Text>
                        </View>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <ScrollView showsVerticalScrollIndicator={false}>
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
                            <Text style={[styles.dashValue, { color: theme.text }]}>2</Text>
                            <Text style={styles.dashLabel}>Active Postings</Text>
                        </View>
                        <View style={[styles.dashboardCard, { backgroundColor: isDark ? '#111111' : '#f9f9f9', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <Text style={[styles.dashValue, { color: theme.brand }]}>17</Text>
                            <Text style={styles.dashLabel}>New Applicants</Text>
                        </View>
                    </View>

                    {/* Jobs List */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Job Postings</Text>
                        {jobs.map(renderJobItem)}
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
