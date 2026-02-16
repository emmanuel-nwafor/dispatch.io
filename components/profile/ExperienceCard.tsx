import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface Experience {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface ExperienceCardProps {
    experience: Experience;
    theme: any;
    isDark: boolean;
    onDelete: (id: string) => void;
}

export default function ExperienceCard({ experience, theme, isDark, onDelete }: ExperienceCardProps) {
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
                    borderColor: isDark ? '#1a1a1a' : '#f0f0f0'
                }
            ]}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-4">
                    <Text style={{ color: theme.text }} className="text-lg font-[Outfit-Bold]">
                        {experience.title}
                    </Text>
                    <Text style={{ color: theme.brand }} className="font-[Outfit-Medium]">
                        {experience.company}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onDelete(experience.id)}
                    className="p-2 rounded-full bg-red-50 dark:bg-red-950/30"
                >
                    <Feather name="trash-2" size={16} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-3">
                <Feather name="calendar" size={14} color={theme.tabIconDefault} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.tabIconDefault }} className="text-xs font-[Outfit-Medium]">
                    {experience.startDate} — {experience.current ? 'Present' : experience.endDate}
                </Text>
            </View>

            {experience.description ? (
                <Text
                    style={{ color: theme.text, opacity: 0.7 }}
                    className="text-sm font-[Outfit-Regular] leading-5"
                    numberOfLines={3}
                >
                    {experience.description}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    }
});
