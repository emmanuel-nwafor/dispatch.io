import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MotiView, AnimatePresence } from 'moti';

interface HeaderProps {
    title: string;
    onBack: () => void;
    currentStep: number;
    totalSteps: number;
    theme: any;
}

const CompleteProfileHeader = ({ title, onBack, currentStep, totalSteps, theme }: HeaderProps) => {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';

    const isSkippable = currentStep > 1;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Left Section: Back Button */}
            <View style={styles.sideSection}>
                <TouchableOpacity
                    onPress={onBack}
                    activeOpacity={0.7}
                    style={[
                        styles.iconBtn,
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }
                    ]}
                >
                    <Ionicons
                        name={currentStep === 1 ? "close" : "arrow-back"}
                        size={wp('5.5%')}
                        color={theme.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Center Section: Title & Step Pills */}
            <View style={styles.centerSection}>
                <Text style={[styles.title, { color: theme.text }]}>
                    {title}
                </Text>

                <View style={styles.pillContainer}>
                    {Array.from({ length: totalSteps }).map((_, index) => {
                        const isCompleted = index + 1 < currentStep;
                        const isActive = index + 1 === currentStep;

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.pill,
                                    {
                                        width: isActive ? wp('4%') : wp('1.5%'),
                                        backgroundColor: isActive
                                            ? theme.brand
                                            : isCompleted ? theme.brand + '80' : (isDark ? '#333' : '#E0E0E0'),
                                    }
                                ]}
                            />
                        );
                    })}
                </View>
            </View>

            {/* Right Section: Skip Button (Hidden on Step 1) */}
            <View style={styles.sideSection}>
                <AnimatePresence>
                    {isSkippable && (
                        <MotiView
                            from={{ opacity: 0, translateX: 10 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            exit={{ opacity: 0, translateX: 10 }}
                        >
                            <TouchableOpacity
                                onPress={() => router.replace('/screens/(home)')}
                                style={styles.skipBtn}
                            >
                                <Text style={[styles.skipText, { color: theme.tabIconDefault }]}>
                                    Skip
                                </Text>
                            </TouchableOpacity>
                        </MotiView>
                    )}
                </AnimatePresence>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
        height: hp('10%'),
    },
    sideSection: {
        width: wp('15%'),
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: wp('4.2%'),
        fontFamily: 'Outfit-Bold',
        marginBottom: 6,
    },
    iconBtn: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pill: {
        height: 4,
        borderRadius: 2,
    },
    skipBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    skipText: {
        fontFamily: 'Outfit-Bold',
        fontSize: wp('3.5%'),
    }
});

export default CompleteProfileHeader;