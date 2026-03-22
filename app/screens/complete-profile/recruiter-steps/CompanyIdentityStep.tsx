import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';

interface CompanyIdentityStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

export default function CompanyIdentityStep({ formData, setFormData, theme, inputStyle }: CompanyIdentityStepProps) {
    const [errors, setErrors] = useState({
        companyName: false,
    });

    const handleTextChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (value.trim().length > 0) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
        >
            <View style={{ paddingHorizontal: wp('2%'), paddingBottom: hp('5%') }}>
                <View style={{ marginBottom: hp('4%'), marginTop: hp('2%') }}>
                    <Text style={{ color: theme.text, fontSize: wp('8%') }} className="font-[Outfit-Bold] mb-2">Company Identity</Text>
                    <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.5%') }} className="font-[Outfit-Medium]">Tell us about your organization.</Text>
                </View>

                <View style={{ marginBottom: hp('3%') }}>
                    <Text style={{ color: theme.text, marginBottom: 10 }} className="font-[Outfit-Bold]">Company Name</Text>
                    <TextInput
                        className="p-5 rounded-xl border font-[Outfit-Medium]"
                        style={[inputStyle, { height: hp('8%'), borderColor: errors.companyName ? '#ef4444' : (inputStyle.borderColor || theme.border) }]}
                        placeholder="e.g. Acme Corp"
                        placeholderTextColor={theme.tabIconDefault}
                        value={formData.fullName} // We use fullName as companyName in the backend payload for simplicity if needed, or we map it later
                        onChangeText={(t) => handleTextChange('fullName', t)}
                    />
                </View>

                <View style={{ marginBottom: hp('3%') }}>
                    <Text style={{ color: theme.text, marginBottom: 10 }} className="font-[Outfit-Bold]">Company Website</Text>
                    <TextInput
                        className="p-5 rounded-xl border font-[Outfit-Medium]"
                        style={[inputStyle, { height: hp('8%') }]}
                        placeholder="https://acme.com"
                        placeholderTextColor={theme.tabIconDefault}
                        value={formData.portfolioUrl} // Mapping portfolioUrl to website
                        onChangeText={(t) => handleTextChange('portfolioUrl', t)}
                        autoCapitalize="none"
                        keyboardType="url"
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
