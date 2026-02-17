import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';

interface ExpertiseStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

const SUGGESTED_SKILLS = [
    "Product Design", "React Native", "UX Research",
    "Tailwind CSS", "TypeScript", "Node.js",
    "Project Management", "UI Design", "Figma"
];

export default function ExpertiseStep({ formData, setFormData, theme, inputStyle }: ExpertiseStepProps) {
    const [skillInput, setSkillInput] = useState('');
    const [isBioFocused, setIsBioFocused] = useState(false);

    const addSkill = (skillName?: string) => {
        const skillToAdd = (skillName || skillInput).trim();
        if (skillToAdd && !formData.skills.includes(skillToAdd)) {
            setFormData({ ...formData, skills: [...formData.skills, skillToAdd] });
            setSkillInput('');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const removeSkill = (index: number) => {
        setFormData({ ...formData, skills: formData.skills.filter((_: any, i: number) => i !== index) });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const bioLength = formData.bio?.length || 0;
    const maxBioLength = 500;

    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Expertise</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Highlight your professional skills and story.</Text>
            </View>

            {/* Bio Section */}
            <View className="mb-8">
                <View className="flex-row justify-between items-center mb-3 ml-1">
                    <Text style={{ color: theme.text }} className="font-[Outfit-Bold]">Bio</Text>
                    <Text style={{ color: bioLength > maxBioLength ? '#ef4444' : theme.tabIconDefault }} className="font-[Outfit-Medium] text-xs">
                        {bioLength}/{maxBioLength}
                    </Text>
                </View>
                <TextInput
                    multiline
                    onFocus={() => setIsBioFocused(true)}
                    onBlur={() => setIsBioFocused(false)}
                    className="p-5 rounded-xl border font-[Outfit-Medium] h-40"
                    style={[
                        inputStyle,
                        { borderColor: isBioFocused ? theme.brand : inputStyle.borderColor }
                    ]}
                    textAlignVertical="top"
                    placeholder="E.g. Full-stack developer with 5+ years of experience in building scalable apps..."
                    placeholderTextColor={theme.tabIconDefault}
                    value={formData.bio}
                    onChangeText={(t) => setFormData({ ...formData, bio: t })}
                    maxLength={maxBioLength}
                />
            </View>

            {/* Top Skills Section */}
            <View className="mb-6">
                <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Top Skills</Text>
                <View className="flex-row gap-2 mb-4">
                    <TextInput
                        className="flex-1 p-5 rounded-xl border font-[Outfit-Medium]"
                        style={inputStyle}
                        placeholder="Add a skill..."
                        placeholderTextColor={theme.tabIconDefault}
                        value={skillInput}
                        onChangeText={setSkillInput}
                        onSubmitEditing={() => addSkill()}
                    />
                    <TouchableOpacity
                        onPress={() => addSkill()}
                        style={{ backgroundColor: theme.brand }}
                        className="w-16 h-16 rounded-xl items-center justify-center"
                    >
                        <Ionicons name="add" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Suggested Skills */}
                <View className="mb-6">
                    <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Bold] text-xs uppercase tracking-wider mb-3 ml-1">Suggested for you</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {SUGGESTED_SKILLS.filter(s => !formData.skills.includes(s)).map((s, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => addSkill(s)}
                                style={{ borderColor: theme.tabIconDefault + '30' }}
                                className="bg-zinc-50 dark:bg-zinc-900/50 border px-4 py-2 rounded-full mr-2 flex-row items-center"
                            >
                                <Ionicons name="add" size={14} color={theme.text} className="mr-1" />
                                <Text style={{ color: theme.text }} className="font-[Outfit-Medium] text-sm">{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Selected Skills Tags */}
                <View className="flex-row flex-wrap">
                    <AnimatePresence>
                        {formData.skills.map((s: string, i: number) => (
                            <MotiView
                                from={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                key={s}
                                style={{ backgroundColor: theme.brand + '20', borderColor: theme.brand }}
                                className="px-4 py-2.5 ml-1 mb-2 rounded-xl flex-row items-center border"
                            >
                                <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mr-2">{s}</Text>
                                <TouchableOpacity onPress={() => removeSkill(i)}>
                                    <Ionicons name="close-circle" size={18} color={theme.text} />
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </AnimatePresence>
                </View>
            </View>
        </View>
    );
}
