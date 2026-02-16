import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface IdentityStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

export default function IdentityStep({ formData, setFormData, theme, inputStyle }: IdentityStepProps) {
    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Identity</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">How should the world see you?</Text>
            </View>

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Full Name</Text>
            <TextInput
                className="p-5 rounded-xl border font-[Outfit-Medium] mb-6"
                style={inputStyle}
                placeholder="Enter your legal name"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.fullName}
                onChangeText={(t) => setFormData({ ...formData, fullName: t })}
            />

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Professional Headline</Text>
            <TextInput
                className="p-5 rounded-xl border font-[Outfit-Medium] mb-6"
                style={inputStyle}
                placeholder="e.g. Senior Product Designer"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.headline}
                onChangeText={(t) => setFormData({ ...formData, headline: t })}
            />
        </View>
    );
}
