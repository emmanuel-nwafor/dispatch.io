import { Colors } from '@/app/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

export default function ApplyScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [status, setStatus] = useState<'idle' | 'analyzing' | 'ready'>('idle');
    const [chatMessage, setChatMessage] = useState('');
    const [matchRate, setMatchRate] = useState(64);

    const handleRefine = () => {
        setStatus('analyzing');
        setTimeout(() => {
            setMatchRate(98);
            setStatus('ready');
        }, 3000);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style="light" />

            {/* KEYBOARD WRAPPER - This manages the lift */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                // This offset ensures the input is lifted exactly above the keyboard
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* 1. BRAND HEADER (Fixed) */}
                <LinearGradient
                    colors={isDark ? ['#064e3b', '#000'] : [theme.brand, '#accf00']}
                    style={{
                        paddingTop: hp('6%'),
                        paddingBottom: hp('3%'),
                        paddingHorizontal: wp('6%'),
                        borderBottomLeftRadius: wp('8%'),
                        borderBottomRightRadius: wp('8%'),
                    }}
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={() => router.back()} className="bg-black/10 p-2 rounded-full">
                            <Ionicons name="close" size={wp('6%')} color={isDark ? theme.brand : "#000"} />
                        </TouchableOpacity>
                        <View className="items-center">
                            <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4.5%') }} className="text-white">Dispatch Brain</Text>
                            <Text className="text-white/40 uppercase tracking-widest" style={{ fontSize: wp('2%') }}>Neural Match v1.0</Text>
                        </View>
                        <View style={{ width: wp('10%') }} />
                    </View>
                </LinearGradient>

                {/* 2. SCROLLABLE CONTENT */}
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp('4%') }}
                    style={{ flex: 1 }}
                >
                    <View style={{ paddingHorizontal: wp('6%'), paddingTop: hp('3%') }}>

                        {/* MATCH RATE SCOREBOARD */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: wp('6%') }}>Optimizing...</Text>
                                <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium', fontSize: wp('3.5%') }}>Target: Google Job API</Text>
                            </View>
                            <View className="items-center justify-center bg-zinc-500/10 rounded-full" style={{ width: wp('20%'), height: wp('20%'), borderWidth: 2, borderColor: theme.brand }}>
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand, fontSize: wp('6%') }}>{matchRate}%</Text>
                            </View>
                        </View>

                        {/* DYNAMIC STATES */}
                        {status === 'idle' && (
                            <View>
                                <View className="p-6 bg-zinc-500/5 border border-zinc-500/10 rounded-[32px] mb-8">
                                    <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium', lineHeight: 22 }}>
                                        I've scanned your master profile. To hit a <Text style={{ color: theme.brand }}>98% match</Text> for this Senior UI role, I need to restructure your "System Design" bullet points.
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleRefine}
                                    style={{ height: hp('8%'), borderRadius: wp('4%') }}
                                    className="bg-[#DFFF00] flex-row items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="brain" size={wp('6%')} color="#000" />
                                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: wp('4%') }} className="text-black ml-3">Start Neural Alignment</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {status === 'analyzing' && (
                            <View style={{ marginTop: hp('5%') }} className="items-center">
                                <ActivityIndicator size="large" color="#004d40" />
                                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text }} className="mt-4">Rewriting CV...</Text>
                            </View>
                        )}

                        {status === 'ready' && (
                            <View className="animate-in fade-in duration-500">
                                <View style={{ padding: wp('6%'), borderRadius: wp('8%') }} className="bg-zinc-500/5 border border-zinc-500/10 mb-6">
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand }} className="mb-2 text-xs uppercase">AI Improvement:</Text>
                                    <Text style={{ fontFamily: 'Outfit-Regular', color: theme.text, fontSize: wp('3.8%'), lineHeight: 24 }}>
                                        "Led the migration of legacy design systems to a <Text className="text-blue-400">Headless Architecture</Text>, reducing dev-cycles by 30%."
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={{ height: hp('8%'), borderRadius: wp('4%') }}
                                    className="bg-white items-center justify-center border border-zinc-800"
                                >
                                    <Text style={{ fontFamily: 'Outfit-Bold', color: '#000' }}>Confirm & Dispatch</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* 3. THE INPUT FIELD - LIFTED BY KEYBOARDAVOIDINGVIEW */}
                <View
                    style={{
                        paddingHorizontal: wp('6%'),
                        paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
                        paddingTop: hp('2%'),
                        backgroundColor: theme.background,
                        borderTopWidth: 1,
                        borderTopColor: isDark ? '#111' : '#eee'
                    }}
                >
                    <View className="flex-row items-center bg-zinc-500/10 rounded-full px-5 py-2">
                        <TextInput
                            placeholder="Ask the brain to tweak..."
                            placeholderTextColor="#71717a"
                            value={chatMessage}
                            onChangeText={setChatMessage}
                            className="flex-1 py-3 text-white"
                            style={{ fontFamily: 'Outfit-Medium', fontSize: wp('4%'), color: isDark ? '#fff' : '#000' }}
                            // Prevents the view from staying stuck
                            blurOnSubmit={true}
                        />
                        <TouchableOpacity
                            style={{ width: wp('10%'), height: wp('10%') }}
                            className="bg-[#DFFF00] rounded-full items-center justify-center ml-2"
                        >
                            <Ionicons name="send" size={wp('4%')} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}