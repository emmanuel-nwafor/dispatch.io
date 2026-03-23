import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface StatItemProps {
    label: string;
    value: string;
    icon: string;
    color: string;
}

const StatItem = ({ label, value, icon, color }: StatItemProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';
    const theme = Colors[colorScheme];

    return (
        <View style={[styles.statItem, {
            backgroundColor: isDark ? '#111111' : '#f9f9f9',
            borderColor: isDark ? '#27272a' : '#f4f4f5',
        }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

interface RecruiterStatsProps {
    stats: StatItemProps[];
}

const RecruiterStats = ({ stats }: RecruiterStatsProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>
                <TouchableOpacity>
                    <Text style={[styles.seeAll, { color: theme.brand }]}>View all</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <StatItem key={index} {...stat} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
    },
    seeAll: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    statItem: {
        width: (wp('100%') - 32 - 12) / 2,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontFamily: 'Outfit-Bold',
        fontSize: 20,
        marginBottom: 2,
    },
    statLabel: {
        fontFamily: 'Outfit-Medium',
        fontSize: 12,
        color: '#71717a',
    }
});

export default RecruiterStats;
