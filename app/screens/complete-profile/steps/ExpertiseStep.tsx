import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface ExpertiseStepProps {
    formData: any;
    setFormData: (data: any) => void;
    theme: any;
    inputStyle: any;
}

const SUGGESTED_SKILLS = [
    "Product Design", "React Native", "UX Research",
    "Tailwind CSS", "TypeScript", "Node.js",
    "Project Management", "UI Design", "Figma"
];

export default function ExpertiseStep({ formData, setFormData, theme, inputStyle }: ExpertiseStepProps) {
    const [skillInput, setSkillInput] = useState('');
    const [isBioFocused, setIsBioFocused] = useState(false);

    const addSkill = (skillName?: string) => {
        const skillToAdd = (skillName || skillInput).trim();
        if (skillToAdd && !formData.skills.includes(skillToAdd)) {
            setFormData({ ...formData, skills: [...formData.skills, skillToAdd] });
            setSkillInput('');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const removeSkill = (index: number) => {
        setFormData({ ...formData, skills: formData.skills.filter((_: any, i: number) => i !== index) });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const bioLength = formData.bio?.length || 0;
    const maxBioLength = 500;

    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={hp('10%')}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={{ marginBottom: hp('4%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%'), fontFamily: 'Outfit-Bold' }}>
                    Expertise
                </Text>
                <Text style={{ color: '#8e8e93', fontSize: wp('4.2%'), fontFamily: 'Outfit-Medium', marginTop: 5 }}>
                    Highlight your professional skills and story.
                </Text>
            </View>

            {/* Bio Section */}
            <View style={{ marginBottom: hp('4%') }}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
                    <Text style={{
                        color: bioLength > maxBioLength ? '#ef4444' : '#8e8e93',
                        fontFamily: 'Outfit-Medium',
                        fontSize: wp('3%')
                    }}>
                        {bioLength}/{maxBioLength}
                    </Text>
                </View>
                <TextInput
                    multiline
                    onFocus={() => setIsBioFocused(true)}
                    onBlur={() => setIsBioFocused(false)}
                    style={[
                        inputStyle,
                        styles.bioInput,
                        {
                            borderColor: isBioFocused ? theme.brand : inputStyle.borderColor,
                            color: theme.text,
                            backgroundColor: isBioFocused ? theme.background : inputStyle.backgroundColor
                        }
                    ]}
                    textAlignVertical="top"
                    placeholder="E.g. Full-stack developer with 5+ years of experience..."
                    placeholderTextColor="#52525b"
                    value={formData.bio}
                    onChangeText={(t) => setFormData({ ...formData, bio: t })}
                    maxLength={maxBioLength}
                />
            </View>

            {/* Top Skills Section */}
            <View style={{ marginBottom: hp('3%') }}>
                <Text style={[styles.label, { color: theme.text, marginBottom: hp('1.5%') }]}>Top Skills</Text>
                <View style={styles.skillInputRow}>
                    <View style={[inputStyle, styles.skillInputWrapper]}>
                        <Feather name="zap" size={18} color={theme.brand} style={{ marginRight: 10 }} />
                        <TextInput
                            style={{ flex: 1, height: hp('7%'), fontFamily: 'Outfit-Medium', color: theme.text }}
                            placeholder="Add a skill..."
                            placeholderTextColor="#52525b"
                            value={skillInput}
                            onChangeText={setSkillInput}
                            onSubmitEditing={() => addSkill()}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => addSkill()}
                        activeOpacity={0.8}
                        style={[styles.addButton, { backgroundColor: theme.brand }]}
                    >
                        <Ionicons name="add" size={28} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Suggested Skills */}
                <View style={{ marginTop: hp('2%'), marginBottom: hp('3%') }}>
                    <Text style={styles.subLabel}>SUGGESTED FOR YOU</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestedScroll}>
                        {SUGGESTED_SKILLS.filter(s => !formData.skills.includes(s)).map((s, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => addSkill(s)}
                                style={[styles.suggestedChip, { borderColor: '#8e8e9330' }]}
                            >
                                <Ionicons name="add" size={14} color={theme.brand} style={{ marginRight: 4 }} />
                                <Text style={{ color: theme.text, fontFamily: 'Outfit-Medium', fontSize: wp('3.5%') }}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Selected Skills Tags */}
                <View style={styles.tagsContainer}>
                    <AnimatePresence>
                        {formData.skills.map((s: string, i: number) => (
                            <MotiView
                                from={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', damping: 15 }}
                                key={s}
                                style={[styles.tag, { backgroundColor: theme.brand + '15', borderColor: theme.brand }]}
                            >
                                <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold', marginRight: 8 }}>{s}</Text>
                                <TouchableOpacity onPress={() => removeSkill(i)}>
                                    <Ionicons name="close-circle" size={18} color={theme.text} />
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </AnimatePresence>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 5
    },
    label: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('4%'),
    },
    subLabel: {
        color: '#8e8e93',
        fontFamily: 'Outfit-Bold',
        fontSize: wp('3%'),
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 5
    },
    bioInput: {
        padding: 15,
        borderRadius: wp('4%'),
        fontFamily: 'Outfit-Medium',
        height: hp('18%'),
        borderWidth: 1.5,
    },
    skillInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    skillInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: wp('4%'),
    },
    addButton: {
        width: hp('7%'),
        height: hp('7%'),
        borderRadius: wp('4%'),
        // itemsCenter: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center'
    },
    suggestedScroll: {
        flexDirection: 'row',
    },
    suggestedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(142, 142, 147, 0.1)',
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 100,
        marginRight: 10
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    }
});