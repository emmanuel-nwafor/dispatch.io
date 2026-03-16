import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
    StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Colors } from '@/app/constants/Colors';
import { useUserStore } from '@/hooks/useUserStore';
import { storage } from '@/app/utils/storage';
import { user as api } from '@/app/data/api';

// Steps & Header
import IdentityStep from './steps/IdentityStep';
import AboutStep from './steps/AboutStep';
import ExpertiseStep from './steps/ExpertiseStep';
import ExperienceStep from './steps/ExperienceStep';
import EducationStep from './steps/EducationStep';
import VisualsStep from './steps/VisualsStep';
import DocumentsStep from './steps/DocumentsStep';
import PersonalStep from './steps/PersonalStep';
import CompleteProfileHeader from '@/components/profile/CompleteProfileHeader';
import LocationPopup from '@/components/popups/LocationPopup';

export default function CompleteProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const storeRole = useUserStore((state) => state.role);

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [locationModalVisible, setLocationModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        headline: '',
        bio: '',
        location: { country: '', state: '', countryCode: '', stateCode: '' },
        category: '',
        industry: '',
        skills: [] as string[],
        experience: [] as any[],
        education: [] as any[],
        profileImage: null,
        coverImage: null,
        resume: null,
        portfolioUrl: '',
        linkedInUrl: '',
        birthday: '',
        gender: '',
        languages: []
    });

    const totalSteps = 8;

    const validateCurrentStep = () => {
        if (step === 1) {
            if (!formData.fullName.trim() || !formData.headline.trim()) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Toast.show({
                    type: 'error',
                    text1: 'Required Fields',
                    text2: 'Please provide your name and headline to continue.',
                });
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (!validateCurrentStep()) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            submitProfile();
        }
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (step > 1) setStep(prev => prev - 1);
        else router.back();
    };

    const submitProfile = async () => {
        setLoading(true);
        try {
            const mappedRole = storeRole === 'employer' ? 'recruiter' : 'seeker';
            const payload = {
                role: mappedRole,
                fullName: formData.fullName,
                headline: formData.headline,
                bio: formData.bio,
                location: `${formData.location.state}, ${formData.location.country}`,
                skills: formData.skills,
                industry: formData.industry,
                avatar: formData.profileImage,
                coverImage: formData.coverImage
            };

            const response = await api.completeProfile(payload);
            await storage.saveUser(response.user);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            Toast.show({ type: 'success', text1: 'Profile Complete!' });
            router.replace(mappedRole === 'recruiter' ? '/screens/(recruiters)' : '/screens/(home)');
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
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
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Advanced Header with Integrated Stepper */}
            <CompleteProfileHeader
                title="Complete Profile"
                onBack={handleBack}
                currentStep={step}
                totalSteps={totalSteps}
                theme={theme}
            />

            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: wp('6%'), paddingBottom: hp('15%') }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <AnimatePresence exitBeforeEnter>
                    <MotiView
                        key={step}
                        from={{ opacity: 0, scale: 0.95, translateY: 10 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        exit={{ opacity: 0, scale: 1.05, translateY: -10 }}
                        transition={{ type: 'timing', duration: 400 }}
                    >
                        {(() => {
                            switch (step) {
                                case 1: return <IdentityStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} />;
                                case 2: return <AboutStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} onOpenLocation={() => setLocationModalVisible(true)} />;
                                case 3: return <ExpertiseStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} />;
                                case 4: return <ExperienceStep formData={formData} setFormData={setFormData} theme={theme} isDark={isDark} />;
                                case 5: return <EducationStep formData={formData} setFormData={setFormData} theme={theme} isDark={isDark} />;
                                case 6: return <VisualsStep formData={formData} setFormData={setFormData} theme={theme} isDark={isDark} />;
                                case 7: return <DocumentsStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} />;
                                case 8: return <PersonalStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} />;
                                default: return null;
                            }
                        })()}
                    </MotiView>
                </AnimatePresence>
            </KeyboardAwareScrollView>

            {/* Fixed Floating Footer */}
            <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: isDark ? '#2c2c2e' : '#e9ecef' }]}>
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={loading}
                    activeOpacity={0.8}
                    style={[styles.mainBtn, { backgroundColor: theme.brand }]}
                >
                    {loading ? (
                        <ActivityIndicator color="darkgreen" />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.btnText}>{step === totalSteps ? 'Finish Profile' : 'Continue'}</Text>
                            <Ionicons name="chevron-forward" size={wp('5%')} color="black" style={{ marginLeft: 5 }} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <LocationPopup
                visible={locationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onSelect={(loc) => {
                    setFormData({ ...formData, location: loc });
                    setLocationModalVisible(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                theme={theme}
                isDark={isDark}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        width: wp('100%'),
        paddingHorizontal: wp('6%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('4%'),
        borderTopWidth: 1,
    },
    mainBtn: {
        height: hp('7.5%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    btnText: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('4.5%'),
        color: '#000',
    }
});