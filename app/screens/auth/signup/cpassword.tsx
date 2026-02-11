import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SignupUserInputConfirmPassword() {
    const router = useRouter();
    const { password } = useLocalSearchParams<{ password: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureConfirmText, setSecureConfirmText] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!password) {
            console.error("[SignupError]: No password received from previous screen.");
            Toast.show({
                type: 'error',
                text1: 'System Error',
                text2: 'Initial password missing. Please go back.'
            });
        }
    }, [password]);

    const handleCompleteSignup = async () => {
        if (!confirmPassword || confirmPassword.trim().length === 0) {
            console.warn("[SignupValidation]: User attempted to proceed with empty confirm password.");
            Toast.show({
                type: 'error',
                text1: 'Empty Field',
                text2: 'Please re-type your password to confirm.'
            });
            return;
        }

        if (confirmPassword !== password) {
            console.warn("[SignupValidation]: Password mismatch detected.");
            Toast.show({
                type: 'error',
                text1: 'Mismatch',
                text2: 'The passwords you entered do not match.'
            });
            return;
        }

        setIsLoading(true);
        console.log("[SignupFlow]: Validation passed. Starting registration process...");

        try {
            // Simulated API call logic
            await new Promise(resolve => setTimeout(resolve, 2000));

            Toast.show({
                type: 'success',
                text1: 'Account Verified',
                text2: 'Welcome to dispatch.io'
            });

            setTimeout(() => {
                router.replace('/screens/auth/otp/verify-otp');
            }, 1000);

        } catch (error: any) {
            console.error("[SignupError]: Registration process failed", error?.message || error);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: 'Something went wrong on our end. Please try again.'
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
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: hp('4%'), flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('1%') }}>
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={{ width: wp('8%'), height: wp('8%') }}
                                resizeMode="contain"
                            />
                            <Text style={{
                                fontFamily: 'Outfit-Bold',
                                color: theme.text,
                                fontSize: wp('5%'),
                                marginLeft: wp('2%')
                            }}>
                                dispatch.io
                            </Text>
                        </View>

                        <Text style={{
                            fontFamily: 'Outfit-Bold',
                            color: theme.text,
                            fontSize: wp('6.5%'),
                            marginTop: hp('2%')
                        }}>
                            Confirm Password
                        </Text>
                        <Text style={{
                            fontFamily: 'Outfit-Medium',
                            color: isDark ? '#a1a1aa' : '#6b7280',
                            fontSize: wp('4%'),
                            marginTop: hp('1%')
                        }}>
                            Final step: re-type your password.
                        </Text>

                        <View style={{ marginTop: hp('4%') }}>
                            {/* Visual reference of first password */}
                            <View
                                style={{
                                    backgroundColor: isDark ? '#18181b50' : '#f4f4f550',
                                    opacity: 0.6,
                                    paddingHorizontal: wp('4%'),
                                    paddingVertical: hp('1.5%'),
                                    borderRadius: wp('3%'),
                                    borderWidth: 1,
                                    borderColor: 'rgba(120,120,120,0.1)',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: hp('2%')
                                }}
                            >
                                <Ionicons name="lock-closed-outline" size={wp('4.5%')} color={isDark ? '#52525b' : '#a1a1aa'} />
                                <Text style={{
                                    fontFamily: 'Outfit-Medium',
                                    color: isDark ? '#52525b' : '#a1a1aa',
                                    marginLeft: wp('2.5%')
                                }}>
                                    ••••••••••••
                                </Text>
                            </View>

                            {/* Confirm Password Input */}
                            <View
                                style={{
                                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                                    paddingHorizontal: wp('4%'),
                                    paddingVertical: hp('1.5%'),
                                    borderRadius: wp('3%'),
                                    borderWidth: 1,
                                    borderColor: 'rgba(120,120,120,0.1)',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <TextInput
                                    placeholder="Re-type password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    secureTextEntry={secureConfirmText}
                                    editable={!isLoading}
                                    style={{
                                        fontFamily: 'Outfit-Medium',
                                        color: theme.text,
                                        fontSize: wp('4%'),
                                        flex: 1
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setSecureConfirmText(!secureConfirmText)}
                                    disabled={isLoading}
                                >
                                    <Ionicons
                                        name={secureConfirmText ? "eye-off-outline" : "eye-outline"}
                                        size={wp('4.5%')}
                                        color={isDark ? '#52525b' : '#a1a1aa'}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: isDark ? theme.brand : '#000000',
                                    paddingVertical: hp('2%'),
                                    borderRadius: wp('3%'),
                                    alignItems: 'center',
                                    marginTop: hp('4%'),
                                    opacity: isLoading ? 0.8 : 1
                                }}
                                onPress={handleCompleteSignup}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#006400" />
                                ) : (
                                    <Text style={{
                                        fontFamily: 'Outfit-Bold',
                                        color: isDark ? '#000000' : '#FFFFFF',
                                        fontSize: wp('4.2%')
                                    }}>
                                        Complete Signup
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginBottom: hp('3%'), marginTop: hp('2%'), alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                            <Text style={{
                                fontFamily: 'Outfit-Medium',
                                color: isDark ? '#a1a1aa' : '#6b7280',
                                fontSize: wp('3.5%')
                            }}>
                                Entered it wrong? <Text style={{ color: theme.brand }}>Go Back</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}