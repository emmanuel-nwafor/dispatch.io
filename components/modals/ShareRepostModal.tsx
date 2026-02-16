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

interface ShareRepostModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (option: 'repost' | 'share') => void;
}

export default function ShareRepostModal({ visible, onClose, onSelect }: ShareRepostModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [isInternalVisible, setIsInternalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            setIsInternalVisible(true);
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

    const handleAction = (type: 'repost' | 'share') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelect(type);
        handleDismiss();
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
                                            <TouchableOpacity
                                                onPress={handleDismiss}
                                                style={[styles.closeIcon, { backgroundColor: isDark ? '#272a2e' : '#f1f5f9' }]}
                                            >
                                                <Ionicons name="close" size={wp('5%')} color={theme.text} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.optionsContent}>
                                            <TouchableOpacity
                                                onPress={() => handleAction('repost')}
                                                style={styles.optionRow}
                                                activeOpacity={0.6}
                                            >
                                                <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1d2023' : '#f8fafc' }]}>
                                                    <Ionicons name="repeat" size={wp('6%')} color={theme.text} />
                                                </View>
                                                <Text style={[styles.optionText, { color: theme.text }]}>Repost</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => handleAction('share')}
                                                style={styles.optionRow}
                                                activeOpacity={0.6}
                                            >
                                                <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1d2023' : '#f8fafc' }]}>
                                                    <Ionicons name="share-outline" size={wp('6%')} color={theme.text} />
                                                </View>
                                                <Text style={[styles.optionText, { color: theme.text }]}>Share via...</Text>
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
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
        width: '100%',
        paddingHorizontal: wp('6%'),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('2%'),
        position: 'relative',
    },
    handle: {
        width: wp('10%'),
        height: 5,
        borderRadius: 10,
    },
    closeIcon: {
        position: 'absolute',
        right: 0,
        top: hp('1.5%'),
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('4.5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsContent: {
        marginTop: hp('1%'),
        paddingBottom: hp('2%'),
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        marginVertical: hp('0.5%'),
    },
    iconCircle: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp('4%'),
    },
    optionText: {
        fontSize: wp('4.2%'),
        fontFamily: 'Outfit-Bold',
    },
});