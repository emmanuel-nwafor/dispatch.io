import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import EducationCard from '@/components/profile/EducationCard';

interface EducationStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    isDark: boolean;
}

export default function EducationStep({ formData, setFormData, theme, isDark }: EducationStepProps) {
    const addEducation = () => {
        const newEdu = {
            id: Math.random().toString(),
            school: 'Stanford University',
            degree: 'Master of Arts',
            field: 'Human Computer Interaction',
            startDate: '2018',
            endDate: '2020'
        };
        setFormData({ ...formData, education: [...formData.education, newEdu] });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const removeEducation = (id: string) => {
        setFormData({ ...formData, education: formData.education.filter((e: any) => e.id !== id) });
    };

    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Education</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Your academic journey.</Text>
            </View>

            {formData.education.length > 0 ? (
                formData.education.map((edu: any) => (
                    <EducationCard
                        key={edu.id}
                        education={edu}
                        theme={theme}
                        isDark={isDark}
                        onDelete={removeEducation}
                    />
                ))
            ) : (
                <View className="items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900/40 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800 mb-8">
                    <MaterialCommunityIcons name="school-outline" size={40} color={theme.tabIconDefault} className="mb-4" />
                    <Text style={{ color: theme.tabIconDefault }} className="text-center font-[Outfit-Medium]">No education added yet.</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={addEducation}
                className="p-5 rounded-3xl border-2 border-dashed flex-row items-center justify-center"
                style={{ borderColor: theme.brand }}
            >
                <Ionicons name="add-circle" size={24} color={theme.brand} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.brand }} className="font-[Outfit-Bold] text-lg">Add Education</Text>
            </TouchableOpacity>
        </View>
    );
}
