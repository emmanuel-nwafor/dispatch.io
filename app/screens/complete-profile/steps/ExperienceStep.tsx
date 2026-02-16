import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ExperienceCard from '@/components/profile/ExperienceCard';

interface ExperienceStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    isDark: boolean;
}

export default function ExperienceStep({ formData, setFormData, theme, isDark }: ExperienceStepProps) {
    const addExperience = () => {
        // Quick mock add for demo
        const newExp = {
            id: Math.random().toString(),
            title: 'Lead Designer',
            company: 'Vercel',
            startDate: '2022',
            endDate: 'Present',
            current: true,
            description: 'Leading the design system team.'
        };
        setFormData({ ...formData, experience: [...formData.experience, newExp] });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const removeExperience = (id: string) => {
        setFormData({ ...formData, experience: formData.experience.filter((e: any) => e.id !== id) });
    };

    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Work History</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Where have you made an impact?</Text>
            </View>

            {formData.experience.length > 0 ? (
                formData.experience.map((exp: any) => (
                    <ExperienceCard
                        key={exp.id}
                        experience={exp}
                        theme={theme}
                        isDark={isDark}
                        onDelete={removeExperience}
                    />
                ))
            ) : (
                <View className="items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900/40 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800 mb-8">
                    <Feather name="briefcase" size={40} color={theme.tabIconDefault} className="mb-4" />
                    <Text style={{ color: theme.tabIconDefault }} className="text-center font-[Outfit-Medium]">No experience added yet.</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={addExperience}
                className="p-5 rounded-3xl border-2 border-dashed flex-row items-center justify-center"
                style={{ borderColor: theme.brand }}
            >
                <Ionicons name="add-circle" size={24} color={theme.brand} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.brand }} className="font-[Outfit-Bold] text-lg">Add Experience</Text>
            </TouchableOpacity>
        </View>
    );
}
