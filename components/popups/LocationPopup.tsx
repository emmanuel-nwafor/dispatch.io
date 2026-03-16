import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Pressable,
    Keyboard
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { Country, State } from 'country-state-city';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface LocationModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (location: { country: string; state: string; countryCode: string; stateCode: string }) => void;
    theme: any;
    isDark: boolean;
}

export default function LocationPopup({ visible, onClose, onSelect, theme, isDark }: LocationModalProps) {
    const [step, setStep] = useState<'country' | 'state'>('country');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<{ name: string; isoCode: string } | null>(null);

    useEffect(() => {
        if (visible) {
            setStep('country');
            setSearchQuery('');
            setSelectedCountry(null);
        }
    }, [visible]);

    const data = useMemo(() => {
        let result: any[] = [];
        if (step === 'country') {
            result = Country.getAllCountries().map(c => ({ name: c.name, isoCode: c.isoCode, flag: c.flag }));
        } else if (step === 'state' && selectedCountry) {
            result = State.getStatesOfCountry(selectedCountry.isoCode).map(s => ({ name: s.name, isoCode: s.isoCode }));
        }

        if (searchQuery.trim()) {
            return result.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [step, selectedCountry, searchQuery]);

    const handleSelect = (item: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (step === 'country') {
            setSelectedCountry(item);
            setStep('state');
            setSearchQuery('');
        } else {
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

    return (
        <AnimatePresence>
            {visible && (
                <View style={styles.overlayContainer}>
                    {/* Backdrop */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.backdrop}
                    >
                        <Pressable style={{ flex: 1 }} onPress={() => {
                            Keyboard.dismiss();
                            onClose();
                        }} />
                    </MotiView>

                    {/* Centered Popup Content */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.keyboardView}
                        // This prevents the "jumping down" effect by keeping the container centered
                        keyboardVerticalOffset={Platform.OS === 'ios' ? hp('5%') : 0}
                    >
                        <MotiView
                            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0 }}
                            exit={{ opacity: 0, scale: 0.9, translateY: 20 }}
                            transition={{ type: 'timing', duration: 200 }}
                            style={[
                                styles.popupCard,
                                { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
                            ]}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
                                    <Ionicons
                                        name={step === 'country' ? "close" : "chevron-back"}
                                        size={wp('5.5%')}
                                        color={theme.text}
                                    />
                                </TouchableOpacity>

                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.title, { color: theme.text }]}>
                                        {step === 'country' ? 'Location' : 'Select State'}
                                    </Text>
                                    {selectedCountry && (
                                        <Text style={{ color: theme.brand, fontSize: wp('3%'), fontFamily: 'Outfit-Bold' }}>
                                            {selectedCountry.name}
                                        </Text>
                                    )}
                                </View>
                                <View style={{ width: wp('10%') }} />
                            </View>

                            {/* Search */}
                            <View style={styles.searchBox}>
                                <View style={[styles.searchInner, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                                    <Feather name="search" size={wp('4%')} color={theme.tabIconDefault} />
                                    <TextInput
                                        style={[styles.input, { color: theme.text }]}
                                        placeholder={`Search...`}
                                        placeholderTextColor={theme.tabIconDefault}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            {/* List Section */}
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => `${item.isoCode}-${index}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item)}
                                        style={[styles.listItem, { borderBottomColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                                    >
                                        <Text style={styles.flagText}>{item.flag || '📍'}</Text>
                                        <Text style={[styles.itemLabel, { color: theme.text }]}>{item.name}</Text>
                                        <Ionicons name="chevron-forward" size={wp('4%')} color={theme.tabIconDefault} />
                                    </TouchableOpacity>
                                )}
                                // Fixed height to prevent keyboard from squishing it too much
                                style={{ height: hp('45%') }}
                                keyboardShouldPersistTaps="handled"
                                ListEmptyComponent={
                                    <View style={styles.loader}>
                                        <ActivityIndicator color="darkgreen" />
                                    </View>
                                }
                            />
                        </MotiView>
                    </KeyboardAvoidingView>
                </View>
            )}
        </AnimatePresence>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('8%'),
    },
    popupCard: {
        width: '100%',
        borderRadius: wp('6%'),
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp('4%'),
    },
    iconBtn: {
        width: wp('10%'),
        height: wp('10%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('4.5%'),
    },
    searchBox: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('1%'),
    },
    searchInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        height: hp('5.5%'),
        borderRadius: wp('3%'),
    },
    input: {
        flex: 1,
        marginLeft: wp('2%'),
        fontFamily: 'Outfit-Medium',
        fontSize: wp('3.8%'),
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('6%'),
        borderBottomWidth: 1,
    },
    flagText: {
        fontSize: wp('5%'),
        marginRight: wp('4%'),
    },
    itemLabel: {
        flex: 1,
        fontFamily: 'Outfit-Medium',
        fontSize: wp('4%'),
    },
    loader: {
        padding: hp('5%'),
    }
});