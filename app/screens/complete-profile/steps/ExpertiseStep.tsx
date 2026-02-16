import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

interface ExpertiseStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

export default function ExpertiseStep({ formData, setFormData, theme, inputStyle }: ExpertiseStepProps) {
    const [skillInput, setSkillInput] = useState('');

    const addSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            setSkillInput('');
            Haptics.selectionAsync();
        }
    };

    const removeSkill = (index: number) => {
        setFormData({ ...formData, skills: formData.skills.filter((_: any, i: number) => i !== index) });
    };

    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Expertise</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Share your vibe and skills.</Text>
            </View>

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Bio</Text>
            <TextInput
                multiline
                className="p-5 rounded-xl border font-[Outfit-Medium] mb-8 h-40"
                style={inputStyle}
                textAlignVertical="top"
                placeholder="Write a brief intro about yourself..."
                placeholderTextColor={theme.tabIconDefault}
                value={formData.bio}
                onChangeText={(t) => setFormData({ ...formData, bio: t })}
            />

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Top Skills</Text>
            <View className="flex-row gap-2 mb-6">
                <TextInput
                    className="flex-1 p-5 rounded-xl border font-[Outfit-Medium]"
                    style={inputStyle}
                    placeholder="Add a skill..."
                    placeholderTextColor={theme.tabIconDefault}
                    value={skillInput}
                    onChangeText={setSkillInput}
                    onSubmitEditing={addSkill}
                />
                <TouchableOpacity
                    onPress={addSkill}
                    style={{ backgroundColor: theme.brand }}
                    className="w-16 h-16 rounded-xl items-center justify-center"
                >
                    <Ionicons name="add" size={28} color="black" />
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap gap-2">
                {formData.skills.map((s: string, i: number) => (
                    <MotiView
                        from={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        key={i}
                        style={{ backgroundColor: theme.brand }}
                        className="px-5 py-2.5 rounded-2xl flex-row items-center"
                    >
                        <Text className="font-[Outfit-Bold] text-black mr-2">{s}</Text>
                        <TouchableOpacity onPress={() => removeSkill(i)}>
                            <Ionicons name="close-circle" size={18} color="black" />
                        </TouchableOpacity>
                    </MotiView>
                ))}
            </View>
        </View>
    );
}
