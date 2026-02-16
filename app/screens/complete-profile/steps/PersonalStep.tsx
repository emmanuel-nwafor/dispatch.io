import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface PersonalStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

export default function PersonalStep({ formData, setFormData, theme, inputStyle }: PersonalStepProps) {
    const [langInput, setLangInput] = useState('');

    const addLanguage = () => {
        if (langInput.trim()) {
            setFormData({ ...formData, languages: [...formData.languages, langInput.trim()] });
            setSkillInput('');
            Haptics.selectionAsync();
        }
    };

    const removeLanguage = (index: number) => {
        setFormData({ ...formData, languages: formData.languages.filter((_: any, i: number) => i !== index) });
    };

    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Final Touches</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Almost there!</Text>
            </View>

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Birthday</Text>
            <TextInput
                className="p-5 rounded-3xl border font-[Outfit-Medium] mb-6"
                style={inputStyle}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.birthday}
                onChangeText={(t) => setFormData({ ...formData, birthday: t })}
            />

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Preferred Languages</Text>
            <View className="flex-row gap-2 mb-6">
                <TextInput
                    className="flex-1 p-5 rounded-3xl border font-[Outfit-Medium]"
                    style={inputStyle}
                    placeholder="English, Spanish..."
                    placeholderTextColor={theme.tabIconDefault}
                    value={langInput}
                    onChangeText={setLangInput}
                    onSubmitEditing={addLanguage}
                />
                <TouchableOpacity
                    onPress={addLanguage}
                    style={{ backgroundColor: theme.brand }}
                    className="w-16 h-16 rounded-3xl items-center justify-center"
                >
                    <Ionicons name="language" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap gap-2">
                {formData.languages.map((l: string, i: number) => (
                    <View key={i} style={{ backgroundColor: theme.brand }} className="px-5 py-2.5 rounded-2xl flex-row items-center">
                        <Text className="font-[Outfit-Bold] text-black mr-2">{l}</Text>
                        <TouchableOpacity onPress={() => removeLanguage(i)}>
                            <Ionicons name="close-circle" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}
function setSkillInput(arg0: string) {
    throw new Error('Function not implemented.');
}

