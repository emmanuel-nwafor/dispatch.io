import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
            setFormData({
                ...formData,
                languages: [...(formData.languages || []), langInput.trim()]
            });
            setLangInput(''); // Fixed: replaced setSkillInput
            Haptics.selectionAsync();
        }
    };

    const removeLanguage = (index: number) => {
        setFormData({
            ...formData,
            languages: formData.languages.filter((_: any, i: number) => i !== index)
        });
    };

    return (
        <View style={{ paddingHorizontal: wp('2%') }}>
            <View style={{ marginBottom: hp('4%') }}>
                <Text
                    style={{ color: theme.text, fontSize: wp('8%') }}
                    className="font-[Outfit-Bold] mb-2"
                >
                    Final Touches
                </Text>
                <Text
                    style={{ color: theme.tabIconDefault, fontSize: wp('4.5%') }}
                    className="font-[Outfit-Medium]"
                >
                    Almost there!
                </Text>
            </View>

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Birthday</Text>
            <TextInput
                className="p-5 rounded-3xl border font-[Outfit-Medium]"
                style={[inputStyle, { marginBottom: hp('3%'), height: hp('8%') }]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.birthday}
                onChangeText={(t) => setFormData({ ...formData, birthday: t })}
            />

            <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-3 ml-1">Preferred Languages</Text>
            <View className="flex-row gap-2" style={{ marginBottom: hp('3%') }}>
                <TextInput
                    className="flex-1 p-5 rounded-3xl border font-[Outfit-Medium]"
                    style={[inputStyle, { height: hp('8%') }]}
                    placeholder="English, Spanish..."
                    placeholderTextColor={theme.tabIconDefault}
                    value={langInput}
                    onChangeText={setLangInput}
                    onSubmitEditing={addLanguage}
                />
                <TouchableOpacity
                    onPress={addLanguage}
                    style={{
                        backgroundColor: theme.brand,
                        width: wp('16%'),
                        height: wp('16%'),
                        borderRadius: wp('6%')
                    }}
                    className="items-center justify-center"
                >
                    <Ionicons name="language" size={wp('6%')} color="black" />
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap gap-2">
                {formData.languages?.map((l: string, i: number) => (
                    <View
                        key={i}
                        style={{ backgroundColor: theme.brand, borderRadius: wp('4%') }}
                        className="px-5 py-2.5 flex-row items-center"
                    >
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