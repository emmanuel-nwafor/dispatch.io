import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Modal,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { Country, State, City } from 'country-state-city';

interface LocationModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (location: { country: string; state: string; countryCode: string; stateCode: string }) => void;
    theme: any;
    isDark: boolean;
}

export default function LocationModal({ visible, onClose, onSelect, theme, isDark }: LocationModalProps) {
    const [step, setStep] = useState<'country' | 'state'>('country');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState<{ name: string; isoCode: string } | null>(null);
    const [selectedState, setSelectedState] = useState<{ name: string; isoCode: string } | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setStep('country');
            setSearchQuery('');
            setSelectedCountry(null);
            setSelectedState(null);
        }
    }, [visible]);

    const data = useMemo(() => {
        setLoading(true);
        let result: any[] = [];
        try {
            if (step === 'country') {
                result = Country.getAllCountries().map(c => ({ name: c.name, isoCode: c.isoCode, flag: c.flag }));
            } else if (step === 'state' && selectedCountry) {
                result = State.getStatesOfCountry(selectedCountry.isoCode).map(s => ({ name: s.name, isoCode: s.isoCode }));
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
        }

        if (searchQuery.trim()) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setLoading(false);
        return result;
    }, [step, selectedCountry, searchQuery]);

    const handleConfirm = () => {
        if (!selectedCountry) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSelect({
            country: selectedCountry.name,
            countryCode: selectedCountry.isoCode,
            state: selectedState?.name || '',
            stateCode: selectedState?.isoCode || '',
        });
        onClose();
    };

    const handleSelect = (item: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (step === 'country') {
            setSelectedCountry(item);
            setStep('state');
            setSearchQuery('');
        } else {
            setSelectedState(item);
            onSelect({
                country: selectedCountry?.name || '',
                countryCode: selectedCountry?.isoCode || '',
                state: item.name,
                stateCode: item.isoCode
            });
            onClose();
        }
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (step === 'state') {
            setStep('country');
            setSelectedCountry(null);
        } else {
            onClose();
        }
    };

    const title = useMemo(() => {
        if (step === 'country') return 'Select Country';
        return 'Select State/Province';
    }, [step]);

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}
            >
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: isDark ? '#1a1a1a' : '#f0f0f0' }]}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name={step === 'country' ? "close" : "chevron-back"} size={24} color={theme.text} />
                        </TouchableOpacity>

                        <View className="items-center">
                            <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
                            {selectedCountry && (
                                <Text style={{ color: theme.tabIconDefault, fontSize: 12, fontFamily: 'Outfit-Medium' }}>
                                    {selectedCountry.name}
                                </Text>
                            )}
                        </View>

                        <View style={{ width: 44 }}>
                            {selectedCountry && (
                                <TouchableOpacity onPress={handleConfirm} className="items-center justify-center h-full">
                                    <Text style={{ color: theme.brand }} className="font-[Outfit-Bold]">Done</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View className="px-5 py-4">
                        <MotiView
                            from={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={[
                                styles.searchContainer,
                                {
                                    backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
                                    borderColor: isDark ? '#262626' : '#e5e5e5'
                                }
                            ]}
                        >
                            <Feather name="search" size={18} color={theme.tabIconDefault} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.text }]}
                                placeholder={`Search ${step}...`}
                                placeholderTextColor={theme.tabIconDefault}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoCorrect={false}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={18} color={theme.tabIconDefault} />
                                </TouchableOpacity>
                            )}
                        </MotiView>
                    </View>

                    {/* Content */}
                    <AnimatePresence exitBeforeEnter>
                        {loading && data.length === 0 ? (
                            <View key="loading" className="flex-1 items-center justify-center">
                                <ActivityIndicator color={theme.brand} />
                            </View>
                        ) : data.length === 0 ? (
                            <MotiView
                                key="empty"
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 items-center justify-center p-10"
                            >
                                <View className="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
                                    <Feather name="map-pin" size={32} color={theme.tabIconDefault} />
                                </View>
                                <Text style={{ color: theme.text }} className="text-lg font-[Outfit-Bold] text-center">
                                    No {step}s found
                                </Text>
                                <Text style={{ color: theme.tabIconDefault }} className="text-sm font-[Outfit-Medium] text-center mt-2 mb-6">
                                    Try a different search term or check back later.
                                </Text>

                                {selectedCountry && (
                                    <TouchableOpacity
                                        onPress={handleConfirm}
                                        style={{ backgroundColor: theme.brand }}
                                        className="px-8 py-4 rounded-2xl"
                                    >
                                        <Text className="text-black font-[Outfit-Bold]">Finish with {selectedCountry.name}</Text>
                                    </TouchableOpacity>
                                )}
                            </MotiView>
                        ) : (
                            <MotiView
                                key={step}
                                from={{ opacity: 0, translateX: 10 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                exit={{ opacity: 0, translateX: -10 }}
                                transition={{ type: 'timing', duration: 200 }}
                                className="flex-1"
                            >
                                <FlatList
                                    data={data}
                                    keyExtractor={(item, index) => `${item.isoCode || item.name}-${index}`}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.item, { borderBottomColor: isDark ? '#1a1a1a' : '#f8f8f8' }]}
                                            onPress={() => handleSelect(item)}
                                        >
                                            <View className="flex-row items-center flex-1">
                                                {item.flag && (
                                                    <Text className="text-2xl mr-4">{item.flag}</Text>
                                                )}
                                                <View className="flex-1">
                                                    <Text style={[styles.itemText, { color: theme.text }]}>{item.name}</Text>
                                                    {item.isoCode && (
                                                        <Text style={{ color: theme.tabIconDefault, fontSize: 12 }}>{item.isoCode}</Text>
                                                    )}
                                                </View>
                                            </View>
                                            <Ionicons name="chevron-forward" size={18} color={isDark ? '#333' : '#ccc'} />
                                        </TouchableOpacity>
                                    )}
                                    keyboardShouldPersistTaps="handled"
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                    showsVerticalScrollIndicator={false}
                                />
                            </MotiView>
                        )}
                    </AnimatePresence>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 64,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: 'Outfit-Bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Outfit-Medium',
        marginLeft: 12,
        padding: 0,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'Outfit-Medium',
    },
});
