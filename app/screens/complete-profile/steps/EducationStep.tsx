import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
            <AnimatePresence exitBeforeEnter>
                {!isAdding ? (
                    /* LIST VIEW - FULL SCREEN STATE */
                    <MotiView
                        key="list"
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        <View style={{ marginBottom: hp('3%') }}>
                            <Text style={{ color: theme.text, fontSize: wp('8%'), fontFamily: 'Outfit-Bold' }}>Education</Text>
                            <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.2%'), fontFamily: 'Outfit-Medium' }}>Your academic journey and qualifications.</Text>
                        </View>

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
                    /* FORM VIEW - FULL SCREEN ENTRY */
                    <MotiView
                        key="form"
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'timing', duration: 200 }}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.formHeader}>
                            <TouchableOpacity
                                onPress={() => setIsAdding(false)}
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Feather name="arrow-left" size={24} color={theme.text} />
                                <Text style={[styles.formTitle, { color: theme.text, marginLeft: 10 }]}>Add Qualification</Text>
                            </TouchableOpacity>
                        </View>

                        <KeyboardAwareScrollView
                            enableOnAndroid={true}
                            extraScrollHeight={100}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 40 }}
                        >
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
                                placeholder="Field of Study (e.g. Psychology)"
                                placeholderTextColor={theme.tabIconDefault}
                                style={[styles.textInput, { backgroundColor: inputBg, color: theme.text }]}
                                value={currentEdu.field}
                                onChangeText={(t) => setCurrentEdu({ ...currentEdu, field: t })}
                            />

                            <Text style={styles.inputLabel}>TIMELINE <Text style={{ color: '#ff4444' }}>*</Text></Text>
                            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 25 }}>
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

                            <TouchableOpacity
                                onPress={() => setIsAdding(false)}
                                style={{ marginTop: 25, alignItems: 'center' }}
                            >
                                <Text style={{ color: theme.tabIconDefault, fontFamily: 'Outfit-Medium' }}>Cancel</Text>
                            </TouchableOpacity>
                        </KeyboardAwareScrollView>
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
        borderRadius: wp('4%'),
        borderWidth: 2,
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingTop: 5
    },
    formTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('6%'),
    },
    inputLabel: {
        color: '#8e8e93',
        fontFamily: 'Outfit-Bold',
        fontSize: wp('3.2%'),
        marginBottom: 10,
        letterSpacing: 1,
        marginTop: 10
    },
    textInput: {
        padding: 18,
        borderRadius: wp('4%'),
        fontFamily: 'Outfit-Medium',
        marginBottom: 15,
        fontSize: wp('4%'),
    },
    saveInlineBtn: {
        padding: 18,
        borderRadius: wp('4%'),
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
    },
    saveBtnText: {
        fontFamily: 'Outfit-Bold',
        color: '#000',
        fontSize: wp('4.5%'),
    }
});