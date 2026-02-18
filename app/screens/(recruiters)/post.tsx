import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function RecruitersPost() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Post a job</Text>
                <Text style={styles.headerSubtitle}>Step {step} of {totalSteps}</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            backgroundColor: theme.brand,
                            width: `${(step / totalSteps) * 100}%`
                        }
                    ]}
                />
            </View>
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Start with the basics</Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Job title *</Text>
                <TextInput
                    placeholder="e.g. Senior UI Engineer"
                    placeholderTextColor="#71717a"
                    style={[styles.input, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Company</Text>
                <TextInput
                    value="Dispatch.io"
                    editable={false}
                    style={[styles.input, { color: '#71717a', backgroundColor: isDark ? '#111111' : '#f9f9f9', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Workplace type *</Text>
                <View style={styles.pillContainer}>
                    {['On-site', 'Remote', 'Hybrid'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.pill, { borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                        >
                            <Text style={[styles.pillText, { color: theme.text }]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Add job details</Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Job description *</Text>
                <TextInput
                    placeholder="Describe the role, responsibilities, and team..."
                    placeholderTextColor="#71717a"
                    multiline
                    numberOfLines={8}
                    style={[styles.textArea, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Skills *</Text>
                <TextInput
                    placeholder="Add skills (e.g. React Native, TypeScript)"
                    placeholderTextColor="#71717a"
                    style={[styles.input, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                />
                <Text style={styles.hintText}>Add up to 10 skills to help candidates find your job.</Text>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Finalize and post</Text>

            <View style={styles.previewCard}>
                <View style={[styles.infoBox, { backgroundColor: isDark ? '#111111' : '#f9f9f9', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}>
                    <Ionicons name="eye-outline" size={24} color={theme.brand} />
                    <View style={styles.infoBoxText}>
                        <Text style={[styles.infoBoxTitle, { color: theme.text }]}>Preview your post</Text>
                        <Text style={styles.infoBoxDesc}>See how your job listing will appear to candidates before it goes live.</Text>
                    </View>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>How do you want to receive applicants?</Text>
                <TouchableOpacity style={[styles.optionRow, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                    <Ionicons name="mail-outline" size={20} color="#71717a" />
                    <Text style={[styles.optionText, { color: theme.text }]}>Email (emmanuel@dispatch.io)</Text>
                    <Ionicons name="radio-button-on" size={20} color={theme.brand} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="globe-outline" size={20} color="#71717a" />
                    <Text style={[styles.optionText, { color: theme.text }]}>External website</Text>
                    <Ionicons name="radio-button-off" size={20} color="#71717a" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {renderHeader()}
                {renderProgressBar()}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </ScrollView>

                <View style={[styles.footer, { borderTopColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: theme.brand }]}
                        onPress={() => step < totalSteps ? setStep(step + 1) : router.back()}
                    >
                        <Text style={styles.nextButtonText}>
                            {step === totalSteps ? 'Post job' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
    },
    headerSubtitle: {
        fontFamily: 'Outfit-Medium',
        fontSize: 12,
        color: '#71717a',
    },
    cancelText: {
        fontFamily: 'Outfit-Medium',
        fontSize: 14,
    },
    progressContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    progressBar: {
        height: 4,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    stepContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    stepTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 24,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontFamily: 'Outfit-Medium',
        fontSize: 16,
    },
    textArea: {
        height: 160,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        fontFamily: 'Outfit-Medium',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    pillContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    pillText: {
        fontFamily: 'Outfit-Medium',
        fontSize: 14,
    },
    hintText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        color: '#71717a',
        marginTop: 8,
    },
    previewCard: {
        marginBottom: 24,
    },
    infoBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    infoBoxText: {
        flex: 1,
    },
    infoBoxTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        marginBottom: 4,
    },
    infoBoxDesc: {
        fontFamily: 'Outfit-Regular',
        fontSize: 13,
        color: '#71717a',
        lineHeight: 18,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
    },
    optionText: {
        flex: 1,
        fontFamily: 'Outfit-Medium',
        fontSize: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        backgroundColor: 'transparent',
    },
    nextButton: {
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        color: '#000',
    }
});