import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionProps {
    label: string;
    icon: string;
    onPress?: () => void;
}

const QuickAction = ({ label, icon, onPress }: QuickActionProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.actionButton, { backgroundColor: theme.brand }]}
        >
            <Ionicons name={icon as any} size={20} color="#000" />
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const QuickActions = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>Quick Actions</Text>
            <View style={styles.actionsRow}>
                <QuickAction label="Post Job" icon="add-circle" />
                <QuickAction label="Sourcing" icon="search" />
                <QuickAction label="Schedule" icon="calendar" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    title: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
        marginBottom: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionLabel: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
        color: '#000',
    }
});

export default QuickActions;
