import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import CompleteProfileHeader from '@/components/profile/CompleteProfileHeader';
import StepIndicator from '@/components/profile/StepIndicator';

const CATEGORIES = ['Software Engineering', 'Design', 'Product Management', 'Marketing', 'Sales', 'Data Science', 'Other'];

export default function CompleteProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        category: '',
        skills: [] as string[],
        profileImage: null as string | null,
        resume: null as { name: string, uri: string } | null,
    });

    const [skillInput, setSkillInput] = useState('');

    const handleNext = () => {
        if (currentStep < 2) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleComplete = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Here you would typically save to backend
        router.replace('/screens/(home)');
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData({ ...formData, profileImage: result.assets[0].uri });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            setFormData({
                ...formData,
                resume: { name: result.assets[0].name, uri: result.assets[0].uri }
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            setSkillInput('');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <MotiView
                        from={{ opacity: 0, translateX: 50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: -50 }}
                        key="step0"
                        style={styles.stepContainer}
                    >
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Professional Headline</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7', backgroundColor: isDark ? '#18181b' : '#fff' }]}
                                placeholder="e.g. Senior Fullstack Developer"
                                placeholderTextColor="#71717a"
                                value={formData.headline}
                                onChangeText={(text) => setFormData({ ...formData, headline: text })}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7', backgroundColor: isDark ? '#18181b' : '#fff' }]}
                                placeholder="Tell us about yourself..."
                                placeholderTextColor="#71717a"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={formData.bio}
                                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            />
                        </View>
                    </MotiView>
                );
            case 1:
                return (
                    <MotiView
                        from={{ opacity: 0, translateX: 50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: -50 }}
                        key="step1"
                        style={styles.stepContainer}
                    >
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Work Category</Text>
                            <View style={styles.categoryGrid}>
                                {CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setFormData({ ...formData, category: cat })}
                                        style={[
                                            styles.categoryChip,
                                            {
                                                backgroundColor: formData.category === cat ? theme.brand : (isDark ? '#18181b' : '#fff'),
                                                borderColor: formData.category === cat ? theme.brand : (isDark ? '#27272a' : '#e4e4e7')
                                            }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.categoryText,
                                            { color: formData.category === cat ? '#000' : theme.text }
                                        ]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Skills</Text>
                            <View style={styles.skillInputWrapper}>
                                <TextInput
                                    style={[styles.input, { flex: 1, color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7', backgroundColor: isDark ? '#18181b' : '#fff' }]}
                                    placeholder="Add a skill..."
                                    placeholderTextColor="#71717a"
                                    value={skillInput}
                                    onChangeText={setSkillInput}
                                    onSubmitEditing={addSkill}
                                />
                                <TouchableOpacity onPress={addSkill} style={[styles.addButton, { backgroundColor: theme.brand }]}>
                                    <Ionicons name="add" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.skillsContainer}>
                                {formData.skills.map((skill) => (
                                    <View key={skill} style={[styles.skillChip, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                                        <Text style={[styles.skillText, { color: theme.text }]}>{skill}</Text>
                                        <TouchableOpacity onPress={() => removeSkill(skill)}>
                                            <Ionicons name="close-circle" size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </MotiView>
                );
            case 2:
                return (
                    <MotiView
                        from={{ opacity: 0, translateX: 50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: -50 }}
                        key="step2"
                        style={styles.stepContainer}
                    >
                        <View style={styles.mediaGroup}>
                            <Text style={[styles.label, { color: theme.text, textAlign: 'center' }]}>Profile Picture</Text>
                            <TouchableOpacity onPress={pickImage} style={styles.avatarPicker}>
                                {formData.profileImage ? (
                                    <Image source={{ uri: formData.profileImage }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#18181b' : '#f8fafc' }]}>
                                        <Feather name="camera" size={32} color={theme.text} />
                                    </View>
                                )}
                                <View style={[styles.editBadge, { backgroundColor: theme.brand }]}>
                                    <MaterialCommunityIcons name="pencil" size={14} color="#000" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.mediaGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Resume / CV (PDF)</Text>
                            <TouchableOpacity
                                onPress={pickDocument}
                                style={[
                                    styles.uploadBox,
                                    {
                                        backgroundColor: isDark ? '#18181b' : '#f8fafc',
                                        borderColor: isDark ? '#27272a' : '#e4e4e7',
                                        borderStyle: formData.resume ? 'solid' : 'dashed'
                                    }
                                ]}
                            >
                                {formData.resume ? (
                                    <View style={styles.fileInfo}>
                                        <MaterialCommunityIcons name="file-pdf-box" size={40} color="#ef4444" />
                                        <Text numberOfLines={1} style={[styles.fileName, { color: theme.text }]}>{formData.resume.name}</Text>
                                        <TouchableOpacity onPress={() => setFormData({ ...formData, resume: null })}>
                                            <Ionicons name="close-circle" size={24} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        <Feather name="upload-cloud" size={40} color="#71717a" />
                                        <Text style={styles.uploadText}>Select PDF Document</Text>
                                        <Text style={styles.uploadSubtext}>Maximum size 5MB</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                );
            default:
                return null;
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            <SafeAreaView className="flex-1" edges={['top']}>
                <StatusBar style={isDark ? "light" : "dark"} />
                <Stack.Screen options={{ headerShown: false }} />

                <CompleteProfileHeader
                    title="Complete Profile"
                    onBack={handleBack}
                    showBack={currentStep > 0}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.intro}>
                        <Text style={[styles.welcome, { color: theme.text }]}>Almost there!</Text>
                        <Text style={styles.subtitle}>Help us match you with the best opportunities.</Text>
                    </View>

                    <StepIndicator currentStep={currentStep} totalSteps={3} />

                    <View style={styles.content}>
                        <AnimatePresence exitBeforeEnter>
                            {renderStepContent()}
                        </AnimatePresence>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { borderTopColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                    <TouchableOpacity
                        onPress={handleNext}
                        style={[styles.nextButton, { backgroundColor: theme.brand }]}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentStep === 2 ? 'Complete Profile' : 'Next Step'}
                        </Text>
                        <Ionicons name="arrow-forward" size={18} color="#000" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
    },
    intro: {
        paddingHorizontal: wp('6%'),
        paddingVertical: 20,
    },
    welcome: {
        fontSize: wp('7%'),
        fontFamily: 'Outfit-Bold',
    },
    subtitle: {
        fontSize: wp('4%'),
        fontFamily: 'Outfit-Medium',
        color: '#71717a',
        marginTop: 5,
    },
    content: {
        paddingHorizontal: wp('6%'),
        marginTop: 20,
    },
    stepContainer: {
        minHeight: hp('40%'),
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 15,
        fontFamily: 'Outfit-Bold',
        marginBottom: 10,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'Outfit-Medium',
    },
    textArea: {
        height: 120,
        paddingTop: 15,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'Outfit-Bold',
    },
    skillInputWrapper: {
        flexDirection: 'row',
        gap: 10,
    },
    addButton: {
        width: 55,
        height: 55,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 15,
    },
    skillChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    skillText: {
        fontSize: 14,
        fontFamily: 'Outfit-Medium',
    },
    mediaGroup: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarPicker: {
        marginTop: 10,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e4e4e7',
    },
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    uploadBox: {
        width: '100%',
        height: 150,
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    uploadText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        color: '#71717a',
        marginTop: 10,
    },
    uploadSubtext: {
        fontFamily: 'Outfit-Medium',
        fontSize: 12,
        color: '#a1a1aa',
        marginTop: 4,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 15,
    },
    fileName: {
        flex: 1,
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
    },
    footer: {
        paddingHorizontal: wp('6%'),
        paddingVertical: 20,
        borderTopWidth: 1,
    },
    nextButton: {
        height: 60,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    nextButtonText: {
        fontSize: 18,
        fontFamily: 'Outfit-Bold',
        color: '#000',
    },
});