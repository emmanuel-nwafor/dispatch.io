import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Constants & Components
import { Colors } from '@/app/constants/Colors';
import LocationModal from '@/components/modals/LocationModal';
import CompleteProfileHeader from '@/components/profile/CompleteProfileHeader';

// Modular Steps
import IdentityStep from './steps/IdentityStep';
import AboutStep from './steps/AboutStep';
import ExpertiseStep from './steps/ExpertiseStep';
import ExperienceStep from './steps/ExperienceStep';
import EducationStep from './steps/EducationStep';
import VisualsStep from './steps/VisualsStep';
import DocumentsStep from './steps/DocumentsStep';
import PersonalStep from './steps/PersonalStep';

interface Experience {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

// Updated interface: Added optional flags to match the Modal's output
interface SelectedLocation {
    country: string;
    countryCode: string;
    state?: string;      // Optional
    stateCode?: string;  // Optional
}

export default function ProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [locationModalVisible, setLocationModalVisible] = useState(false);

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        fullName: '',
        headline: '',
        bio: '',
        location: {
            country: '',
            state: '',
            countryCode: '',
            stateCode: ''
        },
        category: '',
        industry: '',
        skills: [] as string[],
        experience: [] as Experience[],
        education: [] as Education[],
        profileImage: null as string | null,
        coverImage: null as string | null,
        resume: null as { name: string; uri: string } | null,
        portfolioUrl: '',
        linkedInUrl: '',
        birthday: '',
        gender: '',
        languages: [] as string[]
    });

    const totalSteps = 8;
    const progressPercent = (step / totalSteps) * 100;

    // --- ACTIONS ---
    const handleNext = () => {
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
        setTimeout(async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Profile Complete!',
                text2: 'Redirecting you to home...',
            });
            router.replace('/screens/(home)');
        }, 2500);
    };

    const inputStyle = {
        backgroundColor: isDark ? '#18181b' : '#f4f4f5',
        color: theme.text,
        borderColor: isDark ? '#27272a' : '#e4e4e7',
    };

    const renderStep = () => {
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
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack.Screen options={{ headerShown: false }} />

            <CompleteProfileHeader
                title={`Step ${step} of ${totalSteps}`}
                onBack={handleBack}
                showBack={step > 1}
            />

            {/* Progress Bar */}
            <View style={{ paddingHorizontal: wp('6%'), marginBottom: hp('3%') }}>
                <View className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <MotiView
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ type: 'spring', damping: 20 }}
                        style={{ backgroundColor: theme.brand }}
                        className="h-full"
                    />
                </View>
            </View>

            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: wp('6%'), paddingBottom: hp('5%') }}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
            >
                <AnimatePresence exitBeforeEnter>
                    <MotiView
                        key={step}
                        from={{ opacity: 0, translateX: 10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: -10 }}
                        transition={{ type: 'timing', duration: 300 }}
                    >
                        {renderStep()}
                    </MotiView>
                </AnimatePresence>
            </KeyboardAwareScrollView>

            {/* Footer Navigation */}
            <View
                style={{
                    paddingHorizontal: wp('6%'),
                    paddingVertical: hp('2%'),
                    borderTopWidth: 1,
                    borderTopColor: isDark ? '#18181b' : '#f4f4f5'
                }}
                className="flex-row gap-4"
            >
                {step > 1 && (
                    <TouchableOpacity
                        onPress={handleBack}
                        style={{ height: hp('7%') }}
                        className="flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 items-center justify-center flex-row"
                    >
                        <Ionicons name="chevron-back" size={20} color={theme.text} className="mr-2" />
                        <Text style={{ color: theme.text }} className="font-[Outfit-Bold] text-lg">Back</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleNext}
                    disabled={loading}
                    style={{ backgroundColor: theme.brand, height: hp('7%') }}
                    className="flex-[2] rounded-xl items-center justify-center flex-row"
                >
                    {loading ? (
                        <ActivityIndicator color="darkgreen" />
                    ) : (
                        <>
                            <Text className="font-[Outfit-Bold] text-black text-lg mr-2">
                                {step === totalSteps ? 'Complete Profile' : 'Continue'}
                            </Text>
                            {step < totalSteps && <Ionicons name="chevron-forward" size={20} color="black" />}
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <LocationModal
                visible={locationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onSelect={(loc: SelectedLocation) => {
                    setFormData({
                        ...formData,
                        location: {
                            country: loc.country,
                            countryCode: loc.countryCode,
                            state: loc.state || '',
                            stateCode: loc.stateCode || ''
                        }
                    });
                    setLocationModalVisible(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                theme={theme}
                isDark={isDark}
            />
        </SafeAreaView>
    );
}