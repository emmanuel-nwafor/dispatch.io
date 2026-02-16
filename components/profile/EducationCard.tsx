import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

interface EducationCardProps {
    education: Education;
    theme: any;
    isDark: boolean;
    onDelete: (id: string) => void;
}

export default function EducationCard({ education, theme, isDark, onDelete }: EducationCardProps) {
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
                        {education.school}
                    </Text>
                    <Text style={{ color: theme.brand }} className="font-[Outfit-Medium]">
                        {education.degree} in {education.field}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onDelete(education.id)}
                    className="p-2 rounded-full bg-red-50 dark:bg-red-950/30"
                >
                    <Feather name="trash-2" size={16} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
                <Feather name="calendar" size={14} color={theme.tabIconDefault} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.tabIconDefault }} className="text-xs font-[Outfit-Medium]">
                    {education.startDate} — {education.endDate}
                </Text>
            </View>
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
