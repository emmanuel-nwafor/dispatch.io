import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EducationCard from '@/components/profile/EducationCard';

interface EducationStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    isDark: boolean;
}

export default function EducationStep({ formData, setFormData, theme, isDark }: EducationStepProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [currentEdu, setCurrentEdu] = useState({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: ''
    });

    const handleSave = () => {
        if (!currentEdu.school.trim() || !currentEdu.degree.trim() || !currentEdu.startDate.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'School, Degree, and Start Year are mandatory.'
            });
            return;
        }

        const newEntry = {
            ...currentEdu,
            id: Math.random().toString(36).substring(7),
        };

        setFormData({
            ...formData,
            education: [newEntry, ...formData.education]
        });

        setIsAdding(false);
        resetForm();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const resetForm = () => {
        setCurrentEdu({ school: '', degree: '', field: '', startDate: '', endDate: '' });
        Keyboard.dismiss();
    };

    const removeEducation = (id: string) => {
        setFormData({ ...formData, education: formData.education.filter((e: any) => e.id !== id) });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const inputBg = isDark ? '#1c1c1e' : '#f3f4f6';

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: hp('3%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%'), fontFamily: 'Outfit-Bold' }}>Education</Text>
                <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.2%'), fontFamily: 'Outfit-Medium' }}>Your academic journey.</Text>
            </View>

            <AnimatePresence>
                {!isAdding ? (
                    <MotiView
                        key="list"
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        <View style={{ gap: 15, marginBottom: hp('3%') }}>
                            {formData.education.length > 0 ? (
                                formData.education.map((edu: any) => (
                                    <EducationCard
                                        key={edu.id}
                                        education={edu}
                                        theme={theme}
                                        isDark={isDark}
                                        onDelete={removeEducation}
                                    />
                                ))
                            ) : (
                                <View style={[styles.emptyState, { backgroundColor: inputBg, borderColor: isDark ? '#2c2c2e' : '#e5e7eb' }]}>
                                    <MaterialCommunityIcons name="school-outline" size={40} color={theme.tabIconDefault} style={{ marginBottom: 12 }} />
                                    <Text style={{ color: theme.tabIconDefault, fontFamily: 'Outfit-Medium' }}>No education added yet.</Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setIsAdding(true);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            style={[styles.addBtn, { borderColor: theme.brand }]}
                        >
                            <Ionicons name="add-circle" size={24} color={theme.brand} style={{ marginRight: 8 }} />
                            <Text style={{ color: theme.brand, fontFamily: 'Outfit-Bold', fontSize: wp('4.5%') }}>Add Education</Text>
                        </TouchableOpacity>
                    </MotiView>
                ) : (
                    <MotiView
                        key="form"
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: 20 }}
                        style={[styles.inlineForm, { backgroundColor: isDark ? '#161618' : '#fff', borderColor: isDark ? '#2c2c2e' : '#e5e7eb' }]}
                    >
                        <View style={styles.formHeader}>
                            <Text style={[styles.formTitle, { color: theme.text }]}>New Qualification</Text>
                            <TouchableOpacity onPress={() => setIsAdding(false)}>
                                <Feather name="x-circle" size={22} color={theme.tabIconDefault} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>INSTITUTION <Text style={{ color: '#ff4444' }}>*</Text></Text>
                        <TextInput
                            placeholder="School (e.g. Stanford University)"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.textInput, { backgroundColor: inputBg, color: theme.text }]}
                            value={currentEdu.school}
                            onChangeText={(t) => setCurrentEdu({ ...currentEdu, school: t })}
                        />

                        <Text style={styles.inputLabel}>QUALIFICATION <Text style={{ color: '#ff4444' }}>*</Text></Text>
                        <TextInput
                            placeholder="Degree (e.g. Bachelor of Science)"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.textInput, { backgroundColor: inputBg, color: theme.text }]}
                            value={currentEdu.degree}
                            onChangeText={(t) => setCurrentEdu({ ...currentEdu, degree: t })}
                        />

                        <TextInput
                            placeholder="Field of Study (e.g. Computer Science)"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.textInput, { backgroundColor: inputBg, color: theme.text }]}
                            value={currentEdu.field}
                            onChangeText={(t) => setCurrentEdu({ ...currentEdu, field: t })}
                        />

                        <Text style={styles.inputLabel}>TIMELINE <Text style={{ color: '#ff4444' }}>*</Text></Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                            <TextInput
                                placeholder="Start Year"
                                placeholderTextColor={theme.tabIconDefault}
                                keyboardType="numeric"
                                style={[styles.textInput, { flex: 1, backgroundColor: inputBg, color: theme.text }]}
                                value={currentEdu.startDate}
                                onChangeText={(t) => setCurrentEdu({ ...currentEdu, startDate: t })}
                            />
                            <TextInput
                                placeholder="End Year"
                                placeholderTextColor={theme.tabIconDefault}
                                keyboardType="numeric"
                                style={[styles.textInput, { flex: 1, backgroundColor: inputBg, color: theme.text }]}
                                value={currentEdu.endDate}
                                onChangeText={(t) => setCurrentEdu({ ...currentEdu, endDate: t })}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.saveInlineBtn, { backgroundColor: theme.brand }]}
                        >
                            <Text style={styles.saveBtnText}>Save Education</Text>
                        </TouchableOpacity>
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: hp('4%'),
        borderRadius: wp('6%'),
        borderWidth: 1.5,
        borderStyle: 'dashed',
    },
    addBtn: {
        padding: 18,
        borderRadius: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inlineForm: {
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    formTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('4.5%'),
    },
    inputLabel: {
        color: '#8e8e93',
        fontFamily: 'Outfit-Bold',
        fontSize: wp('3%'),
        marginBottom: 8,
        letterSpacing: 1
    },
    textInput: {
        padding: 16,
        borderRadius: 12,
        fontFamily: 'Outfit-Medium',
        marginBottom: 12,
    },
    saveInlineBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        fontFamily: 'Outfit-Bold',
        color: '#000',
        fontSize: wp('4%'),
    }
});