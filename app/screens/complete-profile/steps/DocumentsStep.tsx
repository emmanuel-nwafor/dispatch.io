import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function DocumentsStep({ formData, setFormData, theme, inputStyle }: any) {
    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
        if (!result.canceled) {
            setFormData({ ...formData, resume: { name: result.assets[0].name, uri: result.assets[0].uri } });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    return (
        <View>
            <View style={{ marginBottom: hp('4%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%'), fontFamily: 'Outfit-Bold' }}>Presence</Text>
                <Text style={{ color: '#8e8e93', fontSize: wp('4.2%'), fontFamily: 'Outfit-Medium', marginTop: 5 }}>
                    Showcase your professional footprint.
                </Text>
            </View>

            <TouchableOpacity
                onPress={pickResume}
                activeOpacity={0.8}
                style={[
                    inputStyle,
                    {
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: theme.brand,
                        height: hp('22%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: hp('4%')
                    }
                ]}
            >
                <View style={{ backgroundColor: `${theme.brand}20`, padding: 20, borderRadius: 100, marginBottom: 15 }}>
                    <MaterialCommunityIcons
                        name={formData.resume ? "file-check" : "cloud-upload-outline"}
                        size={wp('10%')}
                        color={theme.brand}
                    />
                </View>
                <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold', fontSize: wp('4.5%') }}>
                    {formData.resume ? formData.resume.name : "Upload Resume (PDF)"}
                </Text>
                <Text style={{ color: '#8e8e93', fontFamily: 'Outfit-Medium', fontSize: wp('3.5%'), marginTop: 5 }}>
                    Max file size: 5MB
                </Text>
            </TouchableOpacity>

            <View style={{ gap: hp('2.5%') }}>
                <View>
                    <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold', marginBottom: 8 }}>Portfolio Website</Text>
                    <TextInput
                        style={[inputStyle, { height: hp('7%'), paddingHorizontal: 15, fontFamily: 'Outfit-Medium' }]}
                        placeholder="https://yourwork.com"
                        placeholderTextColor="#52525b"
                        value={formData.portfolioUrl}
                        onChangeText={(t) => setFormData({ ...formData, portfolioUrl: t })}
                    />
                </View>
                <View>
                    <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold', marginBottom: 8 }}>LinkedIn Profile</Text>
                    <TextInput
                        style={[inputStyle, { height: hp('7%'), paddingHorizontal: 15, fontFamily: 'Outfit-Medium' }]}
                        placeholder="linkedin.com/in/username"
                        placeholderTextColor="#52525b"
                        value={formData.linkedInUrl}
                        onChangeText={(t) => setFormData({ ...formData, linkedInUrl: t })}
                    />
                </View>
            </View>
        </View>
    );
}