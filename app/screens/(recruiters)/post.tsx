import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { jobs as jobsApi } from '@/app/data/api';
import { useUserStore } from '@/hooks/useUserStore';

export default function RecruitersPost() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id } = params;
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const { user: currentUser } = useUserStore();

    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [title, setTitle] = useState('');
    const [jobType, setJobType] = useState('Remote');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [applicationMethod, setApplicationMethod] = useState<'email' | 'external'>('email');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingJob, setIsLoadingJob] = useState(false);

    useEffect(() => {
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        setIsLoadingJob(true);
        try {
            const res = await jobsApi.getById(id as string);
            if (res.success && res.job) {
                const job = res.job;
                setTitle(job.title);
                setJobType(job.jobType || 'Remote');
                setDescription(job.description);
                setSkills(job.skillsRequired?.join(', ') || '');
            }
        } catch (error) {
            console.error("Failed to load job details:", error);
            Alert.alert("Error", "Failed to load job details.");
        } finally {
            setIsLoadingJob(false);
        }
    };

    const validateStep = () => {
        if (step === 1) {
            if (!title.trim()) {
                Alert.alert("Required", "Please enter a job title.");
                return false;
            }
        } else if (step === 2) {
            if (!description.trim()) {
                Alert.alert("Required", "Please enter a job description.");
                return false;
            }
            if (!skills.trim()) {
                Alert.alert("Required", "Please add at least one skill.");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (step < totalSteps) {
                setStep(step + 1);
            } else {
                handlePostJob();
            }
        }
    };

    const handlePostJob = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert("Missing Fields", "Please provide at least a title and description for the job.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title,
                companyName: currentUser?.recruiterProfile?.companyName || "Your Company",
                description,
                jobType: jobType === 'Remote' ? 'Remote' : (jobType === 'On-site' ? 'Full-time' : 'Contract'),
                location: jobType === 'Remote' ? 'Remote' : (currentUser?.recruiterProfile?.location || 'Company Office'),
                skillsRequired: skills.split(',').map(s => s.trim()).filter(Boolean),
                salaryRange: { min: 80000, max: 150000, currency: 'USD' },
                experienceLevel: 'Mid',
                status: 'open',
                applicationMethod
            };

            let res;
            if (id) {
                res = await jobsApi.update(id as string, payload);
            } else {
                res = await jobsApi.create(payload);
            }

            if (res.success) {
                Alert.alert("Success", id ? "Job updated successfully!" : "Job posted successfully!");
                router.replace('/screens/(recruiters)/jobs');
            }
        } catch (error) {
            console.error("Failed to save job:", error);
            Alert.alert("Error", "Failed to save job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{id ? "Edit job" : "Post a job"}</Text>
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
                    value={title}
                    onChangeText={setTitle}
                    style={[styles.input, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Company</Text>
                <TextInput
                    value={currentUser?.recruiterProfile?.companyName || "Your Company"}
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
                            onPress={() => setJobType(type)}
                            style={[
                                styles.pill,
                                {
                                    borderColor: jobType === type ? theme.brand : (isDark ? '#27272a' : '#e4e4e7'),
                                    backgroundColor: jobType === type ? `${theme.brand}20` : 'transparent'
                                }
                            ]}
                        >
                            <Text style={[styles.pillText, { color: jobType === type ? theme.brand : theme.text }]}>
                                {type}
                            </Text>
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
                    value={description}
                    onChangeText={setDescription}
                    numberOfLines={8}
                    style={[styles.textArea, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Skills *</Text>
                <TextInput
                    placeholder="Add skills (e.g. React Native, TypeScript)"
                    placeholderTextColor="#71717a"
                    value={skills}
                    onChangeText={setSkills}
                    style={[styles.input, { color: theme.text, borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                />
                <Text style={styles.hintText}>Comma separate skills.</Text>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Finalize and post</Text>

            <View style={styles.previewCard}>
                <Text style={[styles.previewSectionTitle, { color: theme.text }]}>Preview</Text>
                <View style={[styles.previewBox, { backgroundColor: isDark ? '#111111' : '#f9f9f9', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}>
                    <Text style={[styles.previewTitle, { color: theme.text }]}>{title || "Job Title"}</Text>
                    <Text style={styles.previewSubtitle}>{currentUser?.recruiterProfile?.companyName || "Company Name"} • {jobType}</Text>

                    <View style={styles.previewDivider} />

                    <Text style={[styles.previewLabel, { color: theme.text }]}>Description</Text>
                    <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={4}>{description || "No description provided."}</Text>

                    <Text style={[styles.previewLabel, { color: theme.text, marginTop: 12 }]}>Skills</Text>
                    <View style={styles.previewSkillsContainer}>
                        {skills ? skills.split(',').map((s, i) => (
                            <View key={i} style={[styles.previewSkillBadge, { backgroundColor: isDark ? '#27272a' : '#e4e4e7' }]}>
                                <Text style={[styles.previewSkillText, { color: theme.text }]}>{s.trim()}</Text>
                            </View>
                        )) : <Text style={styles.previewText}>No skills added.</Text>}
                    </View>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>How do you want to receive applicants?</Text>
                <TouchableOpacity
                    style={[styles.optionRow, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}
                    onPress={() => setApplicationMethod('email')}
                >
                    <Ionicons name="mail-outline" size={20} color={applicationMethod === 'email' ? theme.brand : "#71717a"} />
                    <Text style={[styles.optionText, { color: theme.text }]}>Email ({currentUser?.email || "your-email"})</Text>
                    <Ionicons
                        name={applicationMethod === 'email' ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={applicationMethod === 'email' ? theme.brand : "#71717a"}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => setApplicationMethod('external')}
                >
                    <Ionicons name="globe-outline" size={20} color={applicationMethod === 'external' ? theme.brand : "#71717a"} />
                    <Text style={[styles.optionText, { color: theme.text }]}>External website</Text>
                    <Ionicons
                        name={applicationMethod === 'external' ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={applicationMethod === 'external' ? theme.brand : "#71717a"}
                    />
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

                {isLoadingJob ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={theme.brand} />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 24 }}
                            style={{ flex: 1 }}
                        >
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                        </ScrollView>

                        <View style={[styles.footer, {
                            borderTopColor: isDark ? '#27272a' : '#f4f4f5',
                            backgroundColor: theme.background,
                            paddingBottom: Platform.OS === 'ios' ? 120 : 130 // Account for absolute tab bar
                        }]}>
                            <TouchableOpacity
                                style={[styles.nextButton, { backgroundColor: theme.brand }]}
                                disabled={isSubmitting}
                                onPress={handleNext}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.nextButtonText}>
                                        {step === totalSteps ? (id ? 'Update job' : 'Post job') : 'Next'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
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
    },
    previewSectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        marginBottom: 12,
    },
    previewBox: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    previewTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
        marginBottom: 4,
    },
    previewSubtitle: {
        fontFamily: 'Outfit-Medium',
        fontSize: 14,
        color: '#71717a',
        marginBottom: 12,
    },
    previewDivider: {
        height: 1,
        backgroundColor: '#e4e4e7',
        marginVertical: 12,
    },
    previewLabel: {
        fontFamily: 'Outfit-Bold',
        fontSize: 13,
        marginBottom: 6,
    },
    previewText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 20,
    },
    previewSkillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    previewSkillBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    previewSkillText: {
        fontFamily: 'Outfit-Medium',
        fontSize: 12,
    }
});