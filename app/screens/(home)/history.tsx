import { Colors } from '@/app/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    Platform,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Technical' | 'Offer' | 'Rejected' | 'Closed';

interface Application {
    id: string;
    role: string;
    company: string;
    location: string;
    status: ApplicationStatus;
    date: string;
    logo: string;
    isIcon?: boolean;
}

const ACTIVE_DATA: Application[] = [
    {
        id: '1',
        role: 'Senior UI Engineer',
        company: 'Figma',
        location: 'Remote',
        status: 'Interview',
        date: '2 hours ago',
        logo: 'logo-figma',
        isIcon: true,
    },
    {
        id: '2',
        role: 'Fullstack Developer',
        company: 'Vercel',
        location: 'Remote',
        status: 'Technical',
        date: '1 day ago',
        logo: 'triangle-outline',
        isIcon: true,
    },
    {
        id: '3',
        role: 'Product Designer',
        company: 'Linear',
        location: 'SF / Remote',
        status: 'Applied',
        date: '3 days ago',
        logo: 'infinite',
        isIcon: true,
    },
];

const PAST_DATA: Application[] = [
    {
        id: '4',
        role: 'Frontend Dev',
        company: 'Stripe',
        location: 'Remote',
        status: 'Rejected',
        date: 'Dec 12, 2025',
        logo: 'card-outline',
        isIcon: true,
    },
    {
        id: '5',
        role: 'React Native Lead',
        company: 'Meta',
        location: 'Menlo Park, CA',
        status: 'Closed',
        date: 'Nov 30, 2025',
        logo: 'logo-facebook',
        isIcon: true,
    },
    {
        id: '6',
        role: 'Software Engineer',
        company: 'Airbnb',
        location: 'Remote',
        status: 'Closed',
        date: 'Oct 15, 2025',
        logo: 'home-outline',
        isIcon: true,
    },
];

const StatusBadge = ({ status, isDark }: { status: ApplicationStatus; isDark: boolean }) => {
    let color = '#71717a';
    let bgColor = isDark ? 'rgba(113, 113, 122, 0.1)' : 'rgba(113, 113, 122, 0.05)';

    switch (status) {
        case 'Interview':
        case 'Technical':
            color = '#3b82f6';
            bgColor = 'rgba(59, 130, 246, 0.1)';
            break;
        case 'Applied':
        case 'Screening':
            color = '#84cc16';
            bgColor = 'rgba(132, 204, 22, 0.1)';
            break;
        case 'Offer':
            color = '#10b981';
            bgColor = 'rgba(16, 185, 129, 0.1)';
            break;
        case 'Rejected':
            color = '#ef4444';
            bgColor = 'rgba(239, 68, 68, 0.1)';
            break;
    }

    return (
        <View style={{
            backgroundColor: bgColor,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
        }}>
            <Text style={{
                color: color,
                fontSize: 10,
                fontFamily: 'Outfit-Bold',
                textTransform: 'uppercase',
                letterSpacing: 0.5
            }}>
                {status}
            </Text>
        </View>
    );
};

export default function HistoryScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');

    const renderItem = ({ item }: { item: Application }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            style={{
                backgroundColor: isDark ? '#111111' : '#fff',
                borderRadius: 24,
                padding: 20,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: isDark ? '#27272a' : '#f4f4f5',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <View style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: isDark ? '#18181b' : '#f9f9f9',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                borderWidth: 1,
                borderColor: isDark ? '#27272a' : '#f4f4f5',
            }}>
                <Ionicons name={item.logo as any} size={28} color={theme.text} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 16, marginBottom: 2 }}>
                    {item.role}
                </Text>
                <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 13, marginBottom: 6 }}>
                    {item.company} • {item.location}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <StatusBadge status={item.status} isDark={isDark} />
                    <Text style={{ fontFamily: 'Outfit-Regular', color: '#a1a1aa', fontSize: 11 }}>
                        {item.date}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={{ paddingHorizontal: 24, paddingTop: 10, marginBottom: 24 }}>
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 28 }}>
                        History
                    </Text>
                    <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 14, marginTop: 4 }}>
                        Track your career progression
                    </Text>
                </View>

                {/* Tab Selector */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? '#111111' : '#f4f4f5',
                    borderRadius: 20,
                    marginHorizontal: 24,
                    padding: 6,
                    marginBottom: 24,
                }}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('Active')}
                        style={{ flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
                    >
                        <Text style={{
                            fontFamily: 'Outfit-Bold',
                            color: activeTab === 'Active' ? (isDark ? '#000' : '#fff') : '#71717a',
                            fontSize: 14
                        }}>
                            Active
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('Past')}
                        style={{ flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
                    >
                        <Text style={{
                            fontFamily: 'Outfit-Bold',
                            color: activeTab === 'Past' ? (isDark ? '#000' : '#fff') : '#71717a',
                            fontSize: 14
                        }}>
                            Past
                        </Text>
                    </TouchableOpacity>

                    {/* Animated Tab Indicator */}
                    <MotiView
                        animate={{
                            translateX: activeTab === 'Active' ? 0 : (wp('100%') - 48 - 12) / 2
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                        style={{
                            position: 'absolute',
                            left: 6,
                            top: 6,
                            width: '49%',
                            height: 44,
                            backgroundColor: isDark ? theme.brand : '#000',
                            borderRadius: 16,
                        }}
                    />
                </View>

                <AnimatePresence>
                    <MotiView
                        key={activeTab}
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -10 }}
                        transition={{ duration: 300 }}
                        style={{ flex: 1 }}
                    >
                        <FlatList
                            data={activeTab === 'Active' ? ACTIVE_DATA : PAST_DATA}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: hp('10%') }}>
                                    <View style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        backgroundColor: isDark ? '#111111' : '#f9f9f9',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 16
                                    }}>
                                        <MaterialCommunityIcons name="clipboard-text-outline" size={32} color="#71717a" />
                                    </View>
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 18 }}>
                                        No applications yet
                                    </Text>
                                    <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
                                        When you apply to jobs, they will appear here.
                                    </Text>
                                </View>
                            }
                        />
                    </MotiView>
                </AnimatePresence>
            </SafeAreaView>
        </View>
    );
}
