import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EducationCard from '@/components/profile/EducationCard';

interface EducationStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    isDark: boolean;
}

export default function EducationStep({ formData, setFormData, theme, isDark }: EducationStepProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentEdu, setCurrentEdu] = useState({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: ''
    });

    const handleSave = () => {
        if (!currentEdu.school || !currentEdu.degree || !currentEdu.startDate) {
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Please fill in School, Degree, and Start Year.'
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

        closeForm();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
            type: 'success',
            text1: 'Education Added',
            text2: `Successfully added ${currentEdu.school}`
        });
    };

    const closeForm = () => {
        setModalVisible(false);
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

            {/* List View */}
            <View style={{ gap: 15, marginBottom: hp('4%') }}>
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
                    setModalVisible(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[styles.addBtn, { borderColor: theme.brand }]}
            >
                <Ionicons name="add-circle" size={24} color={theme.brand} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.brand, fontFamily: 'Outfit-Bold', fontSize: wp('4.5%') }}>Add Education</Text>
            </TouchableOpacity>

            {/* View-Based Overlay Form */}
            <AnimatePresence>
                {modalVisible && (
                    <View style={StyleSheet.absoluteFill}>
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={styles.backdrop}
                        >
                            <TouchableOpacity style={{ flex: 1 }} onPress={closeForm} />
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0, translateY: hp('100%') }}
                            animate={{ opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0, translateY: hp('100%') }}
                            transition={{ type: 'timing', duration: 300 }}
                            style={[styles.formCard, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}
                        >
                            <View style={styles.formHeader}>
                                <TouchableOpacity onPress={closeForm}>
                                    <Feather name="x" size={24} color={theme.text} />
                                </TouchableOpacity>
                                <Text style={[styles.formTitle, { color: theme.text }]}>Add Education</Text>
                                <TouchableOpacity onPress={handleSave}>
                                    <Text style={{ color: theme.brand, fontFamily: 'Outfit-Bold', fontSize: wp('4%') }}>Save</Text>
                                </TouchableOpacity>
                            </View>

                            <KeyboardAwareScrollView
                                style={{ flex: 1 }}
                                contentContainerStyle={{ padding: 20 }}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <Text style={styles.inputLabel}>INSTITUTION</Text>
                                <TextInput
                                    placeholder="School (e.g. Stanford University)"
                                    placeholderTextColor={theme.tabIconDefault}
                                    style={[styles.textInput, { backgroundColor: inputBg, color: theme.text }]}
                                    value={currentEdu.school}
                                    onChangeText={(t) => setCurrentEdu({ ...currentEdu, school: t })}
                                />

                                <Text style={styles.inputLabel}>QUALIFICATION</Text>
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

                                <Text style={styles.inputLabel}>TIMELINE</Text>
                                <View style={{ flexDirection: 'row', gap: 12, marginBottom: hp('5%') }}>
                                    <TextInput
                                        placeholder="Start Year"
                                        placeholderTextColor={theme.tabIconDefault}
                                        keyboardType="numeric"
                                        style={[styles.textInput, { flex: 1, backgroundColor: inputBg, color: theme.text }]}
                                        value={currentEdu.startDate}
                                        onChangeText={(t) => setCurrentEdu({ ...currentEdu, startDate: t })}
                                    />
                                    <TextInput
                                        placeholder="End Year (or Expected)"
                                        placeholderTextColor={theme.tabIconDefault}
                                        keyboardType="numeric"
                                        style={[styles.textInput, { flex: 1, backgroundColor: inputBg, color: theme.text }]}
                                        value={currentEdu.endDate}
                                        onChangeText={(t) => setCurrentEdu({ ...currentEdu, endDate: t })}
                                    />
                                </View>
                            </KeyboardAwareScrollView>
                        </MotiView>
                    </View>
                )}
            </AnimatePresence>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: hp('5%'),
        borderRadius: wp('8%'),
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
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    formCard: {
        position: 'absolute',
        bottom: 0,
        width: wp('100%'),
        height: hp('75%'),
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#8e8e9330'
    },
    formTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('4.5%'),
    },
    inputLabel: {
        color: '#8e8e93',
        fontFamily: 'Outfit-Bold',
        fontSize: wp('3%'),
        marginBottom: 10,
        marginTop: 5,
        letterSpacing: 1
    },
    textInput: {
        padding: 18,
        borderRadius: 15,
        fontFamily: 'Outfit-Medium',
        marginBottom: 15,
    }
});