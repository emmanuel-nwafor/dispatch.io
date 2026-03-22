import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface CompanyDetailStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
    onOpenLocation?: () => void;
}

export default function CompanyDetailStep({ formData, setFormData, theme, inputStyle, onOpenLocation }: CompanyDetailStepProps) {
    const handleTextChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <KeyboardAwareScrollView style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: wp('2%'), paddingBottom: hp('5%') }}>
                <View style={{ marginBottom: hp('4%'), marginTop: hp('2%') }}>
                    <Text style={{ color: theme.text, fontSize: wp('8%') }} className="font-[Outfit-Bold] mb-2">Company Details</Text>
                    <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.5%') }} className="font-[Outfit-Medium]">Help candidates find you easily.</Text>
                </View>

                <View style={{ marginBottom: hp('3%') }}>
                    <Text style={{ color: theme.text, marginBottom: 10 }} className="font-[Outfit-Bold]">Industry</Text>
                    <TextInput
                        className="p-5 rounded-xl border font-[Outfit-Medium]"
                        style={[inputStyle, { height: hp('8%') }]}
                        placeholder="e.g. Technology, Healthcare"
                        placeholderTextColor={theme.tabIconDefault}
                        value={formData.industry}
                        onChangeText={(t) => handleTextChange('industry', t)}
                    />
                </View>

                <View style={{ marginBottom: hp('3%') }}>
                    <Text style={{ color: theme.text, marginBottom: 10 }} className="font-[Outfit-Bold]">Company Size</Text>
                    <TextInput
                        className="p-5 rounded-xl border font-[Outfit-Medium]"
                        style={[inputStyle, { height: hp('8%') }]}
                        placeholder="e.g. 50-200"
                        placeholderTextColor={theme.tabIconDefault}
                        value={formData.headline} // We'll use headline for size temporarily or add a new field
                        onChangeText={(t) => handleTextChange('headline', t)}
                    />
                </View>

                <View style={{ marginBottom: hp('3%') }}>
                    <Text style={{ color: theme.text, marginBottom: 10 }} className="font-[Outfit-Bold]">Location</Text>
                    <TextInput
                        className="p-5 rounded-xl border font-[Outfit-Medium]"
                        style={[inputStyle, { height: hp('8%') }]}
                        placeholder="Select City/Country"
                        placeholderTextColor={theme.tabIconDefault}
                        value={formData.location.state ? `${formData.location.state}, ${formData.location.country}` : ''}
                        onFocus={onOpenLocation}
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
