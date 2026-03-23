import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import React, { useState, useEffect } from 'react';
import {
    Modal,
    Platform,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    Pressable,
    StyleSheet,
} from 'react-native';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export default function SuccessModal({
    visible,
    onClose,
    title = "Success!",
    message = "Action completed successfully."
}: SuccessModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [isInternalVisible, setIsInternalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            setIsInternalVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            setIsInternalVisible(false);
        }
    }, [visible]);

    const handleDismiss = () => {
        setIsInternalVisible(false);
        // Delay the actual unmounting to allow exit animations to finish
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.translationY > 100) {
            handleDismiss();
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleDismiss}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <AnimatePresence>
                        {isInternalVisible && (
                            <>
                                {/* Backdrop */}
                                <MotiView
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'timing', duration: 300 }}
                                    style={[StyleSheet.absoluteFillObject, styles.overlay]}
                                >
                                    <Pressable style={{ flex: 1 }} onPress={handleDismiss} />
                                </MotiView>

                                {/* Bottom Sheet */}
                                <PanGestureHandler onGestureEvent={onGestureEvent}>
                                    <MotiView
                                        from={{ translateY: hp('50%'), scale: 0.95 }}
                                        animate={{ translateY: 0, scale: 1 }}
                                        exit={{ translateY: hp('50%'), scale: 0.95 }}
                                        transition={{
                                            type: 'spring',
                                            damping: 18,
                                            stiffness: 120,
                                            mass: 0.8,
                                        }}
                                        style={[
                                            styles.sheet,
                                            {
                                                backgroundColor: isDark ? '#121212' : theme.background,
                                                paddingBottom: Platform.OS === 'ios' ? hp('5%') : hp('3%'),
                                            }
                                        ]}
                                    >
                                        <View style={styles.header}>
                                            <View style={[
                                                styles.handle,
                                                { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                                            ]} />
                                        </View>

                                        <View style={styles.content}>
                                            {/* Icon Animation - Pops in slightly after sheet */}
                                            <MotiView
                                                from={{ scale: 0, rotate: '-45deg' }}
                                                animate={{ scale: 1, rotate: '0deg' }}
                                                transition={{ type: 'spring', delay: 150 }}
                                                style={[styles.iconCircle, { backgroundColor: theme.brand }]}
                                            >
                                                <Ionicons name="checkmark-sharp" size={wp('10%')} color="#000" />
                                            </MotiView>

                                            {/* Text Animation - Fades up */}
                                            <MotiView
                                                from={{ opacity: 0, translateY: 10 }}
                                                animate={{ opacity: 1, translateY: 0 }}
                                                transition={{ type: 'timing', duration: 400, delay: 250 }}
                                                style={{ alignItems: 'center' }}
                                            >
                                                <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                                                <Text style={[styles.message, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                                                    {message}
                                                </Text>
                                            </MotiView>

                                            {/* Button Animation */}
                                            <MotiView
                                                from={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ type: 'spring', delay: 350 }}
                                                style={{ width: '100%' }}
                                            >
                                                <TouchableOpacity
                                                    onPress={handleDismiss}
                                                    style={[styles.button, { backgroundColor: theme.brand }]}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text style={styles.buttonText}>Continue</Text>
                                                </TouchableOpacity>
                                            </MotiView>
                                        </View>
                                    </MotiView>
                                </PanGestureHandler>
                            </>
                        )}
                    </AnimatePresence>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
        width: '100%',
        paddingHorizontal: wp('6%'),
        // Soft shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: hp('2%'),
    },
    handle: {
        width: wp('10%'),
        height: 5,
        borderRadius: 10,
    },
    content: {
        alignItems: 'center',
        paddingBottom: hp('2%'),
    },
    iconCircle: {
        width: wp('22%'),
        height: wp('22%'),
        borderRadius: wp('11%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('2.5%'),
        // Extra inner glow effect could go here
    },
    title: {
        fontSize: wp('6%'),
        fontWeight: '700', // Fallback if Outfit-Bold isn't loaded
        fontFamily: 'Outfit-Bold',
        textAlign: 'center',
        marginBottom: hp('1%'),
    },
    message: {
        fontSize: wp('4%'),
        fontFamily: 'Outfit-Medium',
        textAlign: 'center',
        lineHeight: wp('5.5%'),
        marginBottom: hp('4%'),
        paddingHorizontal: wp('4%'),
    },
    button: {
        width: '100%',
        height: hp('7%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: wp('4.5%'),
        fontFamily: 'Outfit-Bold',
        color: '#000',
    },
});