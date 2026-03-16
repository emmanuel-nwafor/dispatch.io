import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';

interface IdentityStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

export default function IdentityStep({ formData, setFormData, theme, inputStyle }: IdentityStepProps) {
    // Local state to track validation errors
    const [errors, setErrors] = useState({
        fullName: false,
        headline: false,
    });

    const handleTextChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        // Clear error as soon as user starts typing
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
                {/* Header Section */}
                <View style={{ marginBottom: hp('4%'), marginTop: hp('2%') }}>
                    <Text
                        style={{ color: theme.text, fontSize: wp('8%') }}
                        className="font-[Outfit-Bold] mb-2"
                    >
                        Identity
                    </Text>
                    <Text
                        style={{ color: theme.tabIconDefault, fontSize: wp('4.5%') }}
                        className="font-[Outfit-Medium]"
                    >
                        How should the world see you?
                    </Text>
                </View>

                {/* Full Name Input */}
                <View style={{ marginBottom: hp('3%') }}>
                    <View className="flex-row justify-between items-center mb-3 ml-1">
                        <Text style={{ color: theme.text }} className="font-[Outfit-Bold]">Full Name</Text>
                        {errors.fullName && (
                            <Text style={{ color: '#ef4444', fontSize: wp('3%') }} className="font-[Outfit-Medium]">
                                Please fill your name
                            </Text>
                        )}
                    </View>
                    <TextInput
                        className="p-5 rounded-xl border font-[Outfit-Medium]"
                        style={[
                            inputStyle,
                            {
                                height: hp('8%'),
                                borderColor: errors.fullName ? '#ef4444' : (inputStyle.borderColor || theme.border)
                            }
                        ]}
                        placeholder="Enter your legal name"
                        placeholderTextColor={theme.tabIconDefault}
                        value={formData.fullName}
                        onChangeText={(t) => handleTextChange('fullName', t)}
                        onBlur={() => !formData.fullName.trim() && setErrors(prev => ({ ...prev, fullName: true }))}
                    />
                </View>

                {/* Professional Headline Input */}
                <View style={{ marginBottom: hp('3%') }}>
                    <View className="flex-row justify-between items-center mb-3 ml-1">
                        <Text style={{ color: theme.text }} className="font-[Outfit-Bold]">Professional Headline</Text>
                        {errors.headline && (
                            <Text style={{ color: '#ef4444', fontSize: wp('3%') }} className="font-[Outfit-Medium]">
                                Headline is required
                            </Text>
                        )}
                    </View>
                    <TextInput
                        className="p-5 rounded-xl border font-[Outfit-Medium]"
                        style={[
                            inputStyle,
                            {
                                height: hp('8%'),
                                borderColor: errors.headline ? '#ef4444' : (inputStyle.borderColor || theme.border)
                            }
                        ]}
                        placeholder="e.g. Senior Product Designer"
                        placeholderTextColor={theme.tabIconDefault}
                        value={formData.headline}
                        onChangeText={(t) => handleTextChange('headline', t)}
                        onBlur={() => !formData.headline.trim() && setErrors(prev => ({ ...prev, headline: true }))}
                    />
                </View>

                {/* Branded Info Toast / Tip Box */}
                <View
                    style={{
                        backgroundColor: `${theme.brand}15`,
                        padding: wp('4%'),
                        borderRadius: wp('4%'),
                        borderWidth: 0.5,
                        borderColor: `${theme.brand}30`,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Ionicons name="information-circle" size={wp('5%')} color={theme.brand} style={{ marginRight: wp('3%') }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.brand, fontSize: wp('3.5%'), lineHeight: wp('5%') }} className="font-[Outfit-Bold]">
                            Why this matters
                        </Text>
                        <Text style={{ color: theme.text, fontSize: wp('3.2%'), opacity: 0.8 }} className="font-[Outfit-Medium]">
                            Using your real name and a clear headline helps you connect with more people and builds trust.
                        </Text>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}