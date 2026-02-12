import { Colors } from '@/app/constants/Colors';
import { toastConfig } from '@/app/utils/toastConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function VerifyOtp() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 4) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        console.log("[OTP Flow]: User requested resend.");
        setTimer(30);
        setCanResend(false);
        Toast.show({
            type: 'success',
            text1: 'Code Sent',
            text2: 'A new verification code has been sent.',
        });
    };

    const handleVerify = async () => {
        const fullOtp = otp.join('');

        // Tracking: Empty input
        if (fullOtp.length === 0) {
            console.warn("[Verification Error]: Attempted verify with no digits.");
            Toast.show({
                type: 'error',
                text1: 'Missing Code',
                text2: 'Please enter the 5-digit code to continue.',
            });
            return;
        }

        // Tracking: Incomplete input
        if (fullOtp.length < 5) {
            console.warn(`[Verification Error]: Incomplete code entered: ${fullOtp.length}/5`);
            Toast.show({
                type: 'error',
                text1: 'Invalid Code',
                text2: `Please enter the full 5-digit code. You only entered ${fullOtp.length}.`,
            });
            return;
        }

        setIsLoading(true);
        console.log("[OTP Flow]: Verifying code:", fullOtp);

        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            Toast.show({
                type: 'success',
                text1: 'Verified',
                text2: 'Your account has been verified!',
            });

            setTimeout(() => {
                router.replace('/screens/(home)');
            }, 1500);

        } catch (error) {
            console.error("[OTP Error]: Verification failed", error);
            Toast.show({
                type: 'error',
                text1: 'Verification Error',
                text2: 'Something went wrong. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            <LinearGradient
                colors={[`${theme.brand}15`, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.4, y: 0.4 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp('8%') }}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                >
                    <View style={{ marginTop: hp('4%'), flex: 1 }}>
                        <View className="flex-row items-center mb-1">
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={{
                                    width: wp('8%'),
                                    height: wp('8%'),
                                }}
                                resizeMode="contain"
                            />
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl ml-2">
                                dispatch.io
                            </Text>
                        </View>

                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-2xl mt-3">
                            Verify Account
                        </Text>
                        <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#6b7280' }} className="text-base mt-1">
                            Enter the code sent to your email.
                        </Text>

                        {/* OTP Input Row */}
                        <View style={{ marginTop: hp('6%'), flexDirection: 'row', justifyContent: 'space-between' }}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { inputs.current[index] = ref; }}
                                    style={{
                                        width: wp('13%'),
                                        height: wp('14%'),
                                        backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                                        borderColor: digit ? theme.brand : 'rgba(113, 113, 122, 0.2)',
                                        borderWidth: 1,
                                        borderRadius: 12,
                                        fontSize: 24,
                                        fontFamily: 'Outfit-Bold',
                                        color: theme.text,
                                        textAlign: 'center',
                                    }}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    editable={!isLoading}
                                    onChangeText={(val) => handleOtpChange(val, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    selectionColor={theme.brand}
                                />
                            ))}
                        </View>

                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            {canResend ? (
                                <TouchableOpacity onPress={handleResend} disabled={isLoading}>
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand }}>
                                        Resend Code
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#52525b' : '#a1a1aa' }}>
                                    Resend code in <Text style={{ color: theme.text }}>
                                        00:{timer < 10 ? `0${timer}` : timer}
                                    </Text>
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity
                            style={{
                                backgroundColor: isDark ? theme.brand : '#000000',
                                opacity: isLoading ? 0.7 : 1
                            }}
                            className="py-4 rounded-xl items-center mt-8 shadow-lg"
                            onPress={handleVerify}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#006400" />
                            ) : (
                                <Text style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#000000' : '#FFFFFF' }} className="text-lg">
                                    Verify & Continue
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
            <Toast config={toastConfig} />
        </View>
    );
}