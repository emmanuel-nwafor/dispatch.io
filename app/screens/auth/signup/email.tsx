import { Colors } from '@/app/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

export default function SignupUserInputEmail() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        // Validation: Ensure input is not empty
        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Email Required',
                text2: 'Please enter your email address to continue.'
            });
            return;
        }

        // Basic Email Regex validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address.'
            });
            return;
        }

        setIsLoading(true);

        // Simulate a small check (e.g., checking if email exists)
        setTimeout(() => {
            setIsLoading(false);
            router.push({
                pathname: '/screens/auth/signup/password',
                params: { email: email.toLowerCase() }
            });
        }, 800);
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
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp('6%') }}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: hp('5%'), flex: 1 }}>
                        {/* Brand Identity */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('1%') }}>
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={{ width: wp('10%'), height: wp('10%') }}
                                resizeMode="contain"
                            />
                            <Text
                                style={{
                                    fontFamily: 'Outfit-Bold',
                                    color: theme.text,
                                    fontSize: wp('6%'),
                                    marginLeft: wp('2%')
                                }}
                            >
                                dispatch.io
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontFamily: 'Outfit-Bold',
                                color: theme.text,
                                fontSize: wp('8%'),
                                marginTop: hp('2%')
                            }}
                        >
                            Create Account
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Outfit-Medium',
                                color: isDark ? '#a1a1aa' : '#6b7280',
                                fontSize: wp('4.5%'),
                                marginTop: hp('1%')
                            }}
                        >
                            Sign up to get started.
                        </Text>

                        {/* Input Fields */}
                        <View style={{ marginTop: hp('6%') }}>
                            <View
                                style={{
                                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                                    paddingHorizontal: wp('4%'),
                                    paddingVertical: hp('1.5%'),
                                    borderRadius: wp('4%'),
                                    borderWidth: 1,
                                    borderColor: isDark ? 'rgba(39, 39, 42, 0.5)' : 'rgba(228, 228, 231, 0.5)'
                                }}
                            >
                                <TextInput
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!isLoading}
                                    style={{
                                        fontFamily: 'Outfit-Medium',
                                        color: theme.text,
                                        fontSize: wp('4%')
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: isDark ? theme.brand : '#000000',
                                    paddingVertical: hp('2%'),
                                    borderRadius: wp('4%'),
                                    alignItems: 'center',
                                    marginTop: hp('2%'),
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 10,
                                    elevation: 5,
                                    opacity: isLoading ? 0.7 : 1
                                }}
                                onPress={handleContinue}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#006400" />
                                ) : (
                                    <Text
                                        style={{
                                            fontFamily: 'Outfit-Bold',
                                            color: isDark ? '#000000' : '#FFFFFF',
                                            fontSize: wp('4.5%')
                                        }}
                                    >
                                        Continue
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Line Divider with "or" */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: hp('5%') }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                            <Text style={{ fontFamily: 'Outfit-Medium', marginHorizontal: wp('4%'), color: '#71717a' }}>or</Text>
                            <View style={{ flex: 1, height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                        </View>

                        {/* Social Logins */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                                    flex: 1,
                                    paddingVertical: hp('2%'),
                                    borderRadius: wp('4%'),
                                    borderWidth: 1,
                                    borderColor: isDark ? 'rgba(39, 39, 42, 0.5)' : 'rgba(228, 228, 231, 0.5)',
                                    alignItems: 'center',
                                    marginRight: wp('2%')
                                }}
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                                    flex: 1,
                                    paddingVertical: hp('2%'),
                                    borderRadius: wp('4%'),
                                    borderWidth: 1,
                                    borderColor: isDark ? 'rgba(39, 39, 42, 0.5)' : 'rgba(228, 228, 231, 0.5)',
                                    alignItems: 'center',
                                    marginLeft: wp('2%')
                                }}
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={{ marginBottom: hp('4%'), marginTop: hp('3%'), alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.push('/screens/auth/login' as any)}>
                            <Text style={{
                                fontFamily: 'Outfit-Medium',
                                color: isDark ? '#a1a1aa' : '#6b7280',
                                fontSize: wp('4%')
                            }}>
                                Already have an account? <Text style={{ color: theme.brand }}>Log In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}