import { Colors } from '@/app/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import { Easing } from 'react-native-reanimated';
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
        }
    }, [visible]);

    const handleDismiss = () => {
        setIsInternalVisible(false);
        setTimeout(() => {
            onClose();
        }, 400);
    };

    const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.translationY > 80) {
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
                                {/* Overlay */}
                                <MotiView
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        type: 'timing',
                                        duration: 300,
                                        easing: Easing.out(Easing.quad)
                                    }}
                                    style={[StyleSheet.absoluteFillObject, styles.overlay]}
                                >
                                    <Pressable style={{ flex: 1 }} onPress={handleDismiss} />
                                </MotiView>

                                {/* Bottom Sheet */}
                                <PanGestureHandler onGestureEvent={onGestureEvent}>
                                    <MotiView
                                        from={{ translateY: hp('40%') }}
                                        animate={{ translateY: 0 }}
                                        exit={{ translateY: hp('40%') }}
                                        transition={{
                                            type: 'timing',
                                            duration: 400,
                                            easing: Easing.bezier(0.33, 1, 0.68, 1),
                                        }}
                                        style={[
                                            styles.sheet,
                                            {
                                                backgroundColor: isDark ? '#000' : theme.background,
                                                paddingBottom: Platform.OS === 'ios' ? hp('5%') : hp('3%'),
                                            }
                                        ]}
                                    >
                                        <View style={styles.header}>
                                            <View style={[
                                                styles.handle,
                                                { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }
                                            ]} />
                                        </View>

                                        <View style={styles.content}>
                                            <MotiView
                                                from={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: 'spring', damping: 12, delay: 200 }}
                                                style={[styles.iconCircle, { backgroundColor: theme.brand }]}
                                            >
                                                <Ionicons name="checkmark" size={wp('10%')} color="#000" />
                                            </MotiView>

                                            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                                            <Text style={[styles.message, { color: '#71717a' }]}>{message}</Text>

                                            <TouchableOpacity
                                                onPress={handleDismiss}
                                                style={[styles.button, { backgroundColor: theme.brand }]}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.buttonText}>Continue</Text>
                                            </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
        width: '100%',
        paddingHorizontal: wp('8%'),
    },
    header: {
        alignItems: 'center',
        paddingVertical: hp('2%'),
    },
    handle: {
        width: wp('12%'),
        height: 5,
        borderRadius: 10,
    },
    content: {
        alignItems: 'center',
        paddingBottom: hp('2%'),
    },
    iconCircle: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: wp('10%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('3%'),
    },
    title: {
        fontSize: wp('6.5%'),
        fontFamily: 'Outfit-Bold',
        textAlign: 'center',
        marginBottom: hp('1%'),
    },
    message: {
        fontSize: wp('4%'),
        fontFamily: 'Outfit-Medium',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: hp('4%'),
    },
    button: {
        width: '100%',
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Outfit-Bold',
        color: '#000',
    },
});
