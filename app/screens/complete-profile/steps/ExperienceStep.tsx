import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, Modal, ScrollView, SafeAreaView } from 'react-native';
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
    const [modalVisible, setModalVisible] = useState(false);

    const [currentExp, setCurrentExp] = useState({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });

    const handleSave = () => {
        if (!currentExp.title || !currentExp.company || !currentExp.startDate) {
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Please fill in Title, Company, and Start Date.'
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

        // Close and Reset
        setModalVisible(false);
        setCurrentExp({ title: '', company: '', startDate: '', endDate: '', current: false, description: '' });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Toast.show({
            type: 'success',
            text1: 'Experience Added',
            text2: `Successfully added ${currentExp.title}`
        });
    };

    const removeExperience = (id: string) => {
        setFormData({ ...formData, experience: formData.experience.filter((e: any) => e.id !== id) });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log(`Log: Deleted experience ID: ${id}`);
    };

    const modalBg = isDark ? '#000000' : '#ffffff';
    const inputBg = isDark ? '#1c1c1e' : '#f3f4f6';

    return (
        <View>
            <View style={{ marginBottom: hp('4%') }}>
                <Text style={{ color: theme.text }} className="text-3xl font-[Outfit-Bold] mb-2">Work History</Text>
                <Text style={{ color: theme.tabIconDefault }} className="font-[Outfit-Medium] text-lg">Where have you made an impact?</Text>
            </View>

            {/* List View */}
            <View className="gap-y-4 mb-8">
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
                    <View
                        style={{ backgroundColor: inputBg }}
                        className="items-center justify-center p-12 rounded-[40px] border border-dashed border-zinc-300 dark:border-zinc-800"
                    >
                        <Feather name="briefcase" size={40} color={theme.tabIconDefault} className="mb-4" />
                        <Text style={{ color: theme.tabIconDefault }} className="text-center font-[Outfit-Medium]">No experience added yet.</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                onPress={() => {
                    setModalVisible(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="p-5 rounded-3xl border-2 border-dashed flex-row items-center justify-center"
                style={{ borderColor: theme.brand }}
            >
                <Ionicons name="add-circle" size={24} color={theme.brand} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.brand }} className="font-[Outfit-Bold] text-lg">Add Experience</Text>
            </TouchableOpacity>

            {/* Experience Form Modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: modalBg }}>
                    <View className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Feather name="x" size={28} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }} className="text-xl font-[Outfit-Bold]">Add Experience</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={{ color: theme.brand }} className="text-lg font-[Outfit-Bold]">Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
                        <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-2 ml-1 opacity-60 uppercase text-xs">Role Details</Text>

                        <TextInput
                            placeholder="Title (e.g. Software Engineer)"
                            placeholderTextColor={theme.tabIconDefault}
                            style={{ backgroundColor: inputBg, color: theme.text }}
                            className="p-5 rounded-2xl font-[Outfit-Medium] mb-4"
                            value={currentExp.title}
                            onChangeText={(t) => setCurrentExp({ ...currentExp, title: t })}
                        />

                        <TextInput
                            placeholder="Company (e.g. Google)"
                            placeholderTextColor={theme.tabIconDefault}
                            style={{ backgroundColor: inputBg, color: theme.text }}
                            className="p-5 rounded-2xl font-[Outfit-Medium] mb-6"
                            value={currentExp.company}
                            onChangeText={(t) => setCurrentExp({ ...currentExp, company: t })}
                        />

                        <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-2 ml-1 opacity-60 uppercase text-xs">Timeline</Text>

                        <View className="flex-row gap-4 mb-4">
                            <TextInput
                                placeholder="Start Year"
                                placeholderTextColor={theme.tabIconDefault}
                                keyboardType="numeric"
                                style={{ backgroundColor: inputBg, color: theme.text }}
                                className="flex-1 p-5 rounded-2xl font-[Outfit-Medium]"
                                value={currentExp.startDate}
                                onChangeText={(t) => setCurrentExp({ ...currentExp, startDate: t })}
                            />
                            {!currentExp.current && (
                                <TextInput
                                    placeholder="End Year"
                                    placeholderTextColor={theme.tabIconDefault}
                                    keyboardType="numeric"
                                    style={{ backgroundColor: inputBg, color: theme.text }}
                                    className="flex-1 p-5 rounded-2xl font-[Outfit-Medium]"
                                    value={currentExp.endDate}
                                    onChangeText={(t) => setCurrentExp({ ...currentExp, endDate: t })}
                                />
                            )}
                        </View>

                        <View
                            style={{ backgroundColor: inputBg }}
                            className="flex-row items-center justify-between p-5 rounded-2xl mb-6"
                        >
                            <Text style={{ color: theme.text }} className="font-[Outfit-Medium] text-base">Current Position</Text>
                            <Switch
                                value={currentExp.current}
                                onValueChange={(v) => setCurrentExp({ ...currentExp, current: v })}
                                trackColor={{ false: '#767577', true: theme.brand }}
                            />
                        </View>

                        <Text style={{ color: theme.text }} className="font-[Outfit-Bold] mb-2 ml-1 opacity-60 uppercase text-xs">Description</Text>
                        <TextInput
                            placeholder="What did you achieve in this role?"
                            placeholderTextColor={theme.tabIconDefault}
                            multiline
                            style={{ backgroundColor: inputBg, color: theme.text, height: hp('20%') }}
                            className="p-5 rounded-2xl font-[Outfit-Medium] mb-10"
                            textAlignVertical="top"
                            value={currentExp.description}
                            onChangeText={(t) => setCurrentExp({ ...currentExp, description: t })}
                        />
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </View>
    );
}