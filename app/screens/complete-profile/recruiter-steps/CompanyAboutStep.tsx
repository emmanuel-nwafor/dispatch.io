import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface CompanyAboutStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

export default function CompanyAboutStep({ formData, setFormData, theme, inputStyle }: CompanyAboutStepProps) {
    const handleTextChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <View style={{ paddingHorizontal: wp('2%'), paddingBottom: hp('5%') }}>
            <View style={{ marginBottom: hp('4%'), marginTop: hp('2%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%') }} className="font-[Outfit-Bold] mb-2">Company Bio</Text>
                <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.5%') }} className="font-[Outfit-Medium]">Describe your company culture and mission.</Text>
            </View>

            <View style={{ marginBottom: hp('3%') }}>
                <Text style={{ color: theme.text, marginBottom: 10 }} className="font-[Outfit-Bold]">Description</Text>
                <TextInput
                    multiline
                    numberOfLines={6}
                    className="p-5 rounded-xl border font-[Outfit-Medium]"
                    style={[inputStyle, { height: hp('20%'), textAlignVertical: 'top' }]}
                    placeholder="Write a brief overview of your company..."
                    placeholderTextColor={theme.tabIconDefault}
                    value={formData.bio}
                    onChangeText={(t) => handleTextChange('bio', t)}
                />
            </View>
        </View>
    );
}
