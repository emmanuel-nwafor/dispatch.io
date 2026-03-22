import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    useColorScheme,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { user as userApi } from '@/app/data/api';
import { useUserStore } from '@/hooks/useUserStore';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const { user, setUser } = useUserStore();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.profile?.fullName || user?.recruiterProfile?.companyName || '',
        headline: user?.profile?.headline || user?.recruiterProfile?.industry || '',
        bio: user?.profile?.bio || user?.recruiterProfile?.location || '',
        phone: user?.profile?.phone || '',
        location: user?.profile?.location || user?.recruiterProfile?.location || '',
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const res = await userApi.updateProfile(formData);
            if (res.success) {
                setUser(res.user);
                Toast.show({ type: 'success', text1: 'Success', text2: 'Profile updated successfully!' });
                router.back();
            }
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Update Failed', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        backgroundColor: isDark ? '#1c1c1e' : '#f8f9fa',
        color: theme.text,
        borderRadius: wp('4%'),
        borderWidth: 1,
        borderColor: isDark ? '#2c2c2e' : '#e9ecef',
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
            <Stack.Screen options={{ title: 'Edit Profile', headerShown: false }} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="close" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveBtn}>
                    {loading ? <ActivityIndicator size="small" color={theme.brand} /> : <Text style={[styles.saveText, { color: theme.brand }]}>Save</Text>}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Name / Company Name</Text>
                        <TextInput
                            style={[styles.input, inputStyle]}
                            placeholder="Full Name"
                            placeholderTextColor="#71717a"
                            value={formData.fullName}
                            onChangeText={(t) => setFormData({ ...formData, fullName: t })}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Headline</Text>
                        <TextInput
                            style={[styles.input, inputStyle]}
                            placeholder="e.g. Senior Software Engineer"
                            placeholderTextColor="#71717a"
                            value={formData.headline}
                            onChangeText={(t) => setFormData({ ...formData, headline: t })}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            style={[styles.input, inputStyle, { height: hp('15%'), textAlignVertical: 'top' }]}
                            placeholder="Tell us about yourself..."
                            placeholderTextColor="#71717a"
                            value={formData.bio}
                            onChangeText={(t) => setFormData({ ...formData, bio: t })}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Location</Text>
                        <TextInput
                            style={[styles.input, inputStyle]}
                            placeholder="City, Country"
                            placeholderTextColor="#71717a"
                            value={formData.location}
                            onChangeText={(t) => setFormData({ ...formData, location: t })}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
                        <TextInput
                            style={[styles.input, inputStyle]}
                            placeholder="+1 234 567 890"
                            placeholderTextColor="#71717a"
                            value={formData.phone}
                            onChangeText={(t) => setFormData({ ...formData, phone: t })}
                            keyboardType="phone-pad"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        height: hp('7%'),
        borderBottomWidth: 1,
        borderBottomColor: '#2c2c2e',
    },
    headerTitle: {
        fontSize: wp('4.5%'),
        fontFamily: 'Outfit-Bold',
    },
    backBtn: {
        padding: 5,
    },
    saveBtn: {
        padding: 5,
    },
    saveText: {
        fontSize: wp('4%'),
        fontFamily: 'Outfit-Bold',
    },
    scrollContent: {
        padding: wp('6%'),
        paddingBottom: hp('10%')
    },
    section: {
        marginBottom: hp('3%'),
    },
    label: {
        fontSize: wp('3.8%'),
        fontFamily: 'Outfit-Bold',
        marginBottom: 8,
        marginLeft: 4
    },
    input: {
        padding: wp('4%'),
        fontSize: wp('4%'),
        fontFamily: 'Outfit-Medium',
    }
});
