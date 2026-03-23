import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    useColorScheme,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { jobs as jobsApi } from '@/app/data/api';

export default function ApplicantsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { jobId } = params;
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [applicants, setApplicants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (jobId) {
            fetchApplicants();
        }
    }, [jobId]);

    const fetchApplicants = async () => {
        try {
            const res = await jobsApi.getApplicants(jobId as string);
            if (res.success && res.data) {
                setApplicants(res.data);
            }
        } catch (error) {
            console.error("Failed to load applicants", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Applicants</Text>
                    <View style={{ width: 32 }} />
                </View>

                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={theme.brand} />
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                        {applicants.length > 0 ? (
                            applicants.map((a: any, idx: number) => (
                                <TouchableOpacity
                                    key={idx}
                                    activeOpacity={0.7}
                                    style={[styles.applicantCard, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}
                                    onPress={() => router.push(`/screens/profile/${a.user?._id || a._id}` as any)}
                                >
                                    <Image 
                                        source={{ uri: a.user?.avatar || a.avatar || `https://i.pravatar.cc/150?u=${idx}` }} 
                                        style={styles.avatar} 
                                    />
                                    <View style={styles.applicantInfo}>
                                        <Text style={[styles.name, { color: theme.text }]}>
                                            {a.user?.profile?.fullName || a.profile?.fullName || a.name || "Applicant Name"}
                                        </Text>
                                        <Text style={styles.role}>
                                            {a.user?.profile?.bio || a.profile?.bio || a.role || "Professional"}
                                        </Text>
                                        <Text style={styles.date}>
                                            Applied {new Date(a.appliedAt || a.createdAt || Date.now()).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#71717a" />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={{ marginTop: 40, alignItems: 'center' }}>
                                <Ionicons name="people-outline" size={48} color="#71717a" style={{ marginBottom: 12 }} />
                                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 16, color: '#71717a' }}>No applicants yet.</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
    },
    applicantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    applicantInfo: {
        flex: 1,
    },
    name: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        marginBottom: 2,
    },
    role: {
        fontFamily: 'Outfit-Medium',
        fontSize: 14,
        color: '#71717a',
        marginBottom: 4,
    },
    date: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        color: '#a1a1aa',
    }
});
