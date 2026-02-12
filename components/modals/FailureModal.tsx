import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import React from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface FailureModalProps {
    visible: boolean;
    onClose: () => void;
    onRetry?: () => void;
    title?: string;
    message?: string;
}

export default function FailureModal({ visible, onClose, onRetry, title = "Oops!", message = "Something went wrong. Please try again." }: FailureModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
                <AnimatePresence>
                    {visible && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0 }}
                            exit={{ opacity: 0, scale: 0.9, translateY: 20 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                            style={{
                                backgroundColor: theme.background,
                                borderRadius: 32,
                                padding: 32,
                                width: '100%',
                                alignItems: 'center',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.2,
                                shadowRadius: 20,
                                elevation: 10,
                            }}
                        >
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: '#ef4444',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 24,
                            }}>
                                <Ionicons name="close" size={48} color="#fff" />
                            </View>

                            <Text style={{
                                fontSize: wp('6%'),
                                fontFamily: 'Outfit-Bold',
                                color: theme.text,
                                marginBottom: 8,
                                textAlign: 'center'
                            }}>
                                {title}
                            </Text>

                            <Text style={{
                                fontSize: wp('4%'),
                                fontFamily: 'Outfit-Medium',
                                color: '#71717a',
                                textAlign: 'center',
                                marginBottom: 32,
                                lineHeight: 22
                            }}>
                                {message}
                            </Text>

                            <View style={{ width: '100%', gap: 12 }}>
                                {onRetry && (
                                    <TouchableOpacity
                                        onPress={onRetry}
                                        style={{
                                            backgroundColor: theme.text,
                                            paddingVertical: 16,
                                            borderRadius: 24,
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', fontFamily: 'Outfit-Bold', color: theme.background, fontSize: 16 }}>
                                            Try Again
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                        paddingVertical: 16,
                                        borderRadius: 24,
                                        borderWidth: 1,
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Text style={{ textAlign: 'center', fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 16 }}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </MotiView>
                    )}
                </AnimatePresence>
            </View>
        </Modal>
    );
}