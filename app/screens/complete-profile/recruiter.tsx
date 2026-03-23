import React, { useState, useEffect } from 'react';
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

// Steps
import VisualsStep from './steps/VisualsStep';

// Recruiter Steps
import CompanyIdentityStep from './recruiter-steps/CompanyIdentityStep';
import CompanyDetailStep from './recruiter-steps/CompanyDetailStep';
import CompanyAboutStep from './recruiter-steps/CompanyAboutStep';

// Components
import CompleteProfileHeader from '@/components/profile/CompleteProfileHeader';
import LocationPopup from '@/components/popups/LocationPopup';
import SuccessModal from '@/components/modals/SuccessModal';

export default function RecruiterCompleteProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const setUser = useUserStore((state) => state.setUser);

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const totalSteps = 4;

    useEffect(() => {
        const loadDraft = async () => {
            const savedData = await storage.getItem('recruiter_profile_draft');
            if (savedData) setFormData(JSON.parse(savedData));
        };
        loadDraft();
    }, []);

    useEffect(() => {
        storage.saveItem('recruiter_profile_draft', JSON.stringify(formData));
    }, [formData]);

    const validateCurrentStep = () => {
        if (step === 1) {
            if (!formData.fullName.trim()) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Toast.show({
                    type: 'error',
                    text1: 'Required Field',
                    text2: 'Please provide the company name to continue.',
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
            const payload = {
                role: 'recruiter',
                fullName: formData.fullName,
                headline: formData.headline,
                bio: formData.bio,
                location: `${formData.location.state}, ${formData.location.country}`,
                skills: formData.skills,
                industry: formData.industry,
                avatar: formData.profileImage,
                coverImage: formData.coverImage,
                experience: formData.experience,
                education: formData.education,
                languages: formData.languages,
                birthday: formData.birthday,
                gender: formData.gender,
                portfolioUrl: formData.portfolioUrl,
                linkedInUrl: formData.linkedInUrl,
            };

            const response = await api.completeProfile(payload);
            await storage.saveUser(response.user);
            setUser(response.user);
            await storage.removeItem('recruiter_profile_draft');

            setLoading(false);
            setShowSuccessModal(true);
        } catch (error: any) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Submission Failed',
                text2: error.response?.data?.message || error.message
            });
        }
    };

    const handleFinalRedirect = () => {
        setShowSuccessModal(false);
        router.replace('/screens/(recruiters)');
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

            <CompleteProfileHeader
                title="Company Profile"
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
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        {(() => {
                            switch (step) {
                                case 1: return <CompanyIdentityStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} />;
                                case 2: return <CompanyDetailStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} onOpenLocation={() => setLocationModalVisible(true)} />;
                                case 3: return <VisualsStep formData={formData} setFormData={setFormData} theme={theme} isDark={isDark} />;
                                case 4: return <CompanyAboutStep formData={formData} setFormData={setFormData} theme={theme} inputStyle={inputStyle} />;
                                default: return null;
                            }
                        })()}
                    </MotiView>
                </AnimatePresence>
            </KeyboardAwareScrollView>

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

            <SuccessModal
                visible={showSuccessModal}
                onClose={handleFinalRedirect}
                title="Profile Ready!"
                message="Your company profile has been created successfully."
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