import { Colors } from '@/app/constants/Colors';
import { toastConfig } from '@/app/utils/toastConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SignupUserInputPassword() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);

    const handleNext = () => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (password.length < 8 || !hasLetter || !hasNumber) {
            Toast.show({
                type: 'error',
                text1: 'Security Requirement',
                text2: 'Please follow the criteria below',
                position: 'top',
                topOffset: 60,
            });
            return;
        }

        Toast.show({
            type: 'success',
            text1: 'Password Set',
            text2: 'Proceeding to confirmation...',
            position: 'top',
            topOffset: 60,
        });

        setTimeout(() => {
            router.push({
                pathname: '/screens/auth/signup/cpassword',
                params: { password: password }
            } as any);
        }, 1000);
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
                                style={{ width: wp('8%'), height: wp('8%'), tintColor: isDark ? theme.brand : undefined }}
                                resizeMode="contain"
                            />
                            <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-xl ml-2">dispatch.io</Text>
                        </View>

                        <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="text-2xl mt-3">Create Password</Text>

                        <View style={{ marginTop: hp('4%') }}>
                            {/* Slim Input */}
                            <View style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }} className="px-4 py-3 rounded-xl border border-zinc-800/10 flex-row items-center mb-3">
                                <TextInput
                                    placeholder="Enter password"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                                    secureTextEntry={secureText}
                                    style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: 15, flex: 1 }}
                                />
                                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                    <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={18} color={isDark ? '#52525b' : '#a1a1aa'} />
                                </TouchableOpacity>
                            </View>

                            <View className="mt-4 space-y-2">
                                <Requirement text="Min 8 characters" met={password.length >= 8} theme={theme} />
                                <Requirement text="Include letters" met={/[a-zA-Z]/.test(password)} theme={theme} />
                                <Requirement text="Include numbers" met={/[0-9]/.test(password)} theme={theme} />
                            </View>

                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? theme.brand : '#000000' }}
                                className="py-3.5 rounded-xl items-center mt-8"
                                onPress={handleNext}
                            >
                                <Text style={{ fontFamily: 'Outfit-Bold', color: isDark ? '#000000' : '#FFFFFF' }} className="text-base">Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>

            <Toast config={toastConfig} />
        </View>
    );
}

const Requirement = ({ text, met, theme }: { text: string, met: boolean, theme: any }) => (
    <View className="flex-row items-center space-x-2">
        <Ionicons name={met ? "checkmark-circle" : "ellipse-outline"} size={14} color={met ? theme.brand : '#6b7280'} />
        <Text style={{ fontFamily: 'Outfit-Medium', color: met ? theme.text : '#6b7280', fontSize: 12 }}>{text}</Text>
    </View>
);