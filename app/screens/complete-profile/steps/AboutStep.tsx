import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AboutStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
    onOpenLocation: () => void;
}

export default function AboutStep({ formData, setFormData, theme, inputStyle, onOpenLocation }: AboutStepProps) {
    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Location & Industry</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Where are you based and what do you do?</Text>
            </View>

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Industry</Text>
            <TextInput
                className="p-5 rounded-xl border font-[Outfit-Medium] mb-6"
                style={inputStyle}
                placeholder="e.g. Tech, Healthcare, Finance"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.industry}
                onChangeText={(t) => setFormData({ ...formData, industry: t })}
            />

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Location</Text>
            <TouchableOpacity
                onPress={onOpenLocation}
                style={inputStyle}
                className="p-5 rounded-xl border flex-row items-center justify-between mb-6"
            >
                <Text style={{ color: formData.location.country ? theme.text : theme.tabIconDefault }} className="font-[Outfit-Medium]">
                    {formData.location.country ? `${formData.location.state ? `${formData.location.state}, ` : ''}${formData.location.country}` : "Select your location"}
                </Text>
                <Feather name="map-pin" size={18} color={theme.brand} />
            </TouchableOpacity>
        </View>
    );
}
