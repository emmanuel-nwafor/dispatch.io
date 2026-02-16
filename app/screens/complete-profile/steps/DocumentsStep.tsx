import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

interface DocumentsStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

export default function DocumentsStep({ formData, setFormData, theme, inputStyle }: DocumentsStepProps) {
    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
        if (!result.canceled) {
            setFormData({ ...formData, resume: { name: result.assets[0].name, uri: result.assets[0].uri } });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({
                type: 'success',
                text1: 'Resume Uploaded',
                text2: result.assets[0].name
            });
        }
    };

    return (
        <View>
            <View className="mb-8">
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Presence</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Where else do you exist?</Text>
            </View>

            <TouchableOpacity
                onPress={pickResume}
                style={[inputStyle, { borderStyle: 'dashed', borderWidth: 2, borderColor: theme.brand }]}
                className="w-full h-44 rounded-[40px] items-center justify-center p-8 mb-8"
            >
                <MaterialCommunityIcons
                    name={formData.resume ? "file-check" : "file-pdf-box"}
                    size={48}
                    color={formData.resume ? theme.brand : '#ef4444'}
                    className="mb-2"
                />
                <Text style={{ color: theme.text }} className="font-[Outfit-Bold] text-lg text-center">
                    {formData.resume ? formData.resume.name : "Upload Resume (PDF)"}
                </Text>
            </TouchableOpacity>

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Personal Website</Text>
            <TextInput
                className="p-5 rounded-3xl border font-[Outfit-Medium] mb-6"
                style={inputStyle}
                placeholder="https://yourwork.com"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.portfolioUrl}
                onChangeText={(t) => setFormData({ ...formData, portfolioUrl: t })}
            />

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">LinkedIn</Text>
            <TextInput
                className="p-5 rounded-3xl border font-[Outfit-Medium] mb-6"
                style={inputStyle}
                placeholder="linkedin.com/in/username"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.linkedInUrl}
                onChangeText={(t) => setFormData({ ...formData, linkedInUrl: t })}
            />
        </View>
    );
}
