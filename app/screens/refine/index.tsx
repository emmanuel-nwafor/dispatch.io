import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    SafeAreaView,
    Keyboard
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export default function ApplyScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const animation = useRef(null);
    const scrollRef = useRef<ScrollView>(null);

    const [chatMessage, setChatMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (hasStarted) {
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages, isTyping]);

    const handleSendMessage = (content?: string) => {
        const textToSend = content || chatMessage;
        if (!textToSend.trim()) return;

        if (!hasStarted) setHasStarted(true);

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMsg]);
        setChatMessage('');
        setIsTyping(true);

        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Neural alignment complete. I'm ready to optimize your dispatch flow.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} translucent backgroundColor="transparent" />

            {/* 1. RESTORED HEADER: Better positioning like the original */}
            <View style={{
                paddingTop: Platform.OS === 'android' ? hp('6%') : hp('7%'),
                paddingHorizontal: wp('6%'),
                zIndex: 10
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ width: 44, height: 44, justifyContent: 'center' }}
                >
                    <Ionicons name="chevron-back" size={wp('7%')} color={theme.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                // IMPORTANT: This offset prevents the Android Nav bar from blocking the input
                keyboardVerticalOffset={Platform.OS === 'android' ? hp('2%') : 0}
            >
                <ScrollView
                    ref={scrollRef}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: hasStarted ? 'flex-start' : 'center',
                        paddingHorizontal: wp('8%'),
                        paddingBottom: hp('5%')
                    }}
                >
                    {!hasStarted ? (
                        <View style={{ alignItems: 'center', marginTop: -hp('5%') }}>
                            <View style={{ height: wp('50%'), width: wp('50%'), marginBottom: hp('1%') }}>
                                <LottieView
                                    autoPlay
                                    loop
                                    ref={animation}
                                    style={{ flex: 1 }}
                                    source={require('@/assets/animations/Learning.json')}
                                />
                            </View>

                            <Text style={{ fontFamily: 'Outfit-Medium', color: isDark ? '#a1a1aa' : '#666', fontSize: wp('4.5%') }}>
                                Hi Emmanuel
                            </Text>
                            <Text style={{
                                fontFamily: 'Outfit-Bold',
                                color: theme.text,
                                fontSize: wp('9%'),
                                textAlign: 'center',
                                marginTop: 4
                            }}>
                                Where should we start?
                            </Text>

                            <View className="flex-row flex-wrap justify-center gap-3 mt-8">
                                {[
                                    { label: 'Optimize CV', icon: 'sparkles' },
                                    { label: 'Analyze Match', icon: 'document-text' },
                                    { label: 'Tweak Skills', icon: 'flash' }
                                ].map((item, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => handleSendMessage(item.label)}
                                        className="flex-row items-center px-5 py-3 rounded-full bg-zinc-500/10 border border-zinc-500/5"
                                    >
                                        <Ionicons name={item.icon as any} size={14} color={theme.brand} style={{ marginRight: 8 }} />
                                        <Text style={{ fontFamily: 'Outfit-Medium', color: theme.text, fontSize: wp('3.5%') }}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={{ paddingTop: hp('2%') }}>
                            {messages.map((msg) => (
                                <View
                                    key={msg.id}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.sender === 'user' ? theme.brand : 'rgba(113, 113, 122, 0.1)',
                                        padding: 18,
                                        borderRadius: 24,
                                        borderBottomRightRadius: msg.sender === 'user' ? 4 : 24,
                                        borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 24,
                                        marginBottom: 16,
                                        maxWidth: wp('80%')
                                    }}
                                >
                                    <Text style={{
                                        color: msg.sender === 'user' ? '#000' : theme.text,
                                        fontFamily: 'Outfit-Medium',
                                        fontSize: wp('4.2%'),
                                        lineHeight: 22
                                    }}>
                                        {msg.text}
                                    </Text>
                                </View>
                            ))}
                            {isTyping && (
                                <View style={{ alignSelf: 'flex-start', paddingLeft: 10 }}>
                                    <ActivityIndicator size="small" color="#006400" />
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>

                {/* 2. FIXED INPUT AREA: Lifted and safe from Nav bar */}
                <View style={{
                    paddingHorizontal: wp('5%'),
                    paddingBottom: Platform.OS === 'android' ? hp('3%') : hp('4%'),
                    backgroundColor: theme.background,
                }}>
                    <View
                        style={{
                            height: hp('7%'),
                            marginBottom: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(113, 113, 122, 0.1)',
                            borderRadius: 35,
                            paddingHorizontal: 15,
                            borderWidth: 1,
                            borderColor: 'rgba(113, 113, 122, 0.1)'
                        }}
                    >
                        <TouchableOpacity className="p-2">
                            <Ionicons name="add" size={wp('7%')} color={theme.text} />
                        </TouchableOpacity>

                        <TextInput
                            placeholder="Ask Dispatch Brain..."
                            placeholderTextColor="#71717a"
                            value={chatMessage}
                            onChangeText={setChatMessage}
                            className="flex-1"
                            style={{
                                fontFamily: 'Outfit-Medium',
                                fontSize: wp('4%'),
                                color: theme.text,
                                paddingHorizontal: 10,
                            }}
                        />

                        <View className="flex-row items-center">
                            <TouchableOpacity className="p-2 mr-1">
                                <Ionicons name="mic-outline" size={wp('6%')} color={theme.text} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleSendMessage()}
                                style={{
                                    width: wp('11%'),
                                    height: wp('11%'),
                                    backgroundColor: chatMessage.trim() ? theme.brand : 'transparent',
                                    borderRadius: 25,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Ionicons
                                    name="arrow-up"
                                    size={wp('5.5%')}
                                    color={chatMessage.trim() ? "#000" : theme.text}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}