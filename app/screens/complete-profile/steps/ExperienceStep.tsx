import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Keyboard } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ExperienceCard from '@/components/profile/ExperienceCard';

interface ExperienceStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    isDark: boolean;
}

export default function ExperienceStep({ formData, setFormData, theme, isDark }: ExperienceStepProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [currentExp, setCurrentExp] = useState({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });

    const handleSave = () => {
        // Compulsory Field Validation
        if (!currentExp.title.trim() || !currentExp.company.trim() || !currentExp.startDate.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Title, Company, and Start Year are mandatory.'
            });
            return;
        }

        const newEntry = {
            ...currentExp,
            id: Math.random().toString(36).substring(7),
            endDate: currentExp.current ? 'Present' : currentExp.endDate
        };

        setFormData({
            ...formData,
            experience: [newEntry, ...formData.experience]
        });

        setIsAdding(false);
        resetForm();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const resetForm = () => {
        setCurrentExp({ title: '', company: '', startDate: '', endDate: '', current: false, description: '' });
        Keyboard.dismiss();
    };

    const removeExperience = (id: string) => {
        setFormData({ ...formData, experience: formData.experience.filter((e: any) => e.id !== id) });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const inputBg = isDark ? '#1c1c1e' : '#f3f4f6';

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: hp('3%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%'), fontFamily: 'Outfit-Bold' }}>Work History</Text>
                <Text style={{ color: theme.tabIconDefault, fontSize: wp('4.2%'), fontFamily: 'Outfit-Medium' }}>Where have you made an impact?</Text>
            </View>

            <AnimatePresence>
                {!isAdding ? (
                    <MotiView
                        key="list"
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        {/* Experience List */}
                        <View style={{ gap: 15, marginBottom: hp('3%') }}>
                            {formData.experience.length > 0 ? (
                                formData.experience.map((exp: any) => (
                                    <ExperienceCard
                                        key={exp.id}
                                        experience={exp}
                                        theme={theme}
                                        isDark={isDark}
                                        onDelete={removeExperience}
                                    />
                                ))
                            ) : (
                                <View style={[styles.emptyState, { backgroundColor: inputBg, borderColor: isDark ? '#2c2c2e' : '#e5e7eb' }]}>
                                    <Feather name="briefcase" size={40} color={theme.tabIconDefault} style={{ marginBottom: 12 }} />
                                    <Text style={{ color: theme.tabIconDefault, fontFamily: 'Outfit-Medium' }}>No experience added yet.</Text>
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
                            <Text style={{ color: theme.brand, fontFamily: 'Outfit-Bold', fontSize: wp('4.5%') }}>Add Experience</Text>
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
                            <Text style={[styles.formTitle, { color: theme.text }]}>New Experience</Text>
                            <TouchableOpacity onPress={() => setIsAdding(false)}>
                                <Feather name="x-circle" size={22} color={theme.tabIconDefault} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>ROLE DETAILS <Text style={{ color: '#ff4444' }}>*</Text></Text>
                        <TextInput
                            placeholder="Title (e.g. Designer)"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.textInput, { backgroundColor: inputBg, color: theme.text }]}
                            value={currentExp.title}
                            onChangeText={(t) => setCurrentExp({ ...currentExp, title: t })}
                        />

                        <TextInput
                            placeholder="Company (e.g. Apple)"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.textInput, { backgroundColor: inputBg, color: theme.text }]}
                            value={currentExp.company}
                            onChangeText={(t) => setCurrentExp({ ...currentExp, company: t })}
                        />

                        <Text style={styles.inputLabel}>TIMELINE <Text style={{ color: '#ff4444' }}>*</Text></Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 15 }}>
                            <TextInput
                                placeholder="Start Year"
                                placeholderTextColor={theme.tabIconDefault}
                                keyboardType="numeric"
                                style={[styles.textInput, { flex: 1, backgroundColor: inputBg, color: theme.text }]}
                                value={currentExp.startDate}
                                onChangeText={(t) => setCurrentExp({ ...currentExp, startDate: t })}
                            />
                            {!currentExp.current && (
                                <TextInput
                                    placeholder="End Year"
                                    placeholderTextColor={theme.tabIconDefault}
                                    keyboardType="numeric"
                                    style={[styles.textInput, { flex: 1, backgroundColor: inputBg, color: theme.text }]}
                                    value={currentExp.endDate}
                                    onChangeText={(t) => setCurrentExp({ ...currentExp, endDate: t })}
                                />
                            )}
                        </View>

                        <View style={[styles.switchRow, { backgroundColor: inputBg }]}>
                            <Text style={{ color: theme.text, fontFamily: 'Outfit-Medium' }}>I currently work here</Text>
                            <Switch
                                value={currentExp.current}
                                onValueChange={(v) => setCurrentExp({ ...currentExp, current: v })}
                                trackColor={{ false: '#767577', true: theme.brand }}
                            />
                        </View>

                        <Text style={styles.inputLabel}>DESCRIPTION</Text>
                        <TextInput
                            placeholder="Achievements..."
                            placeholderTextColor={theme.tabIconDefault}
                            multiline
                            style={[styles.textArea, { backgroundColor: inputBg, color: theme.text }]}
                            value={currentExp.description}
                            onChangeText={(t) => setCurrentExp({ ...currentExp, description: t })}
                        />

                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.saveInlineBtn, { backgroundColor: theme.brand }]}
                        >
                            <Text style={styles.saveBtnText}>Save Experience</Text>
                        </TouchableOpacity>
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        justifyContent: 'center',
        padding: hp('4%'),
        borderRadius: wp('6%'),
        borderWidth: 1.5,
        borderStyle: 'dashed',
        alignItems: 'center'
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
        marginBottom: 10,
        letterSpacing: 1
    },
    textInput: {
        padding: 16,
        borderRadius: 12,
        fontFamily: 'Outfit-Medium',
        marginBottom: 12,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center'
    },
    textArea: {
        padding: 16,
        borderRadius: 12,
        fontFamily: 'Outfit-Medium',
        height: hp('12%'),
        marginBottom: 20,
        textAlignVertical: 'top'
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