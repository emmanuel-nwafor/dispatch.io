import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    FlatList,
    Animated,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/app/constants/Colors';

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'AI-Powered Refinement',
        description: 'Let our advanced AI analyze and polish your resume to perfection, ensuring you stand out to recruiters.',
        animation: require('@/assets/animations/cv.json'),
        gradientStart: { x: 1, y: 0 },
    },
    {
        id: '2',
        title: 'Automated Applications',
        description: 'Apply to thousands of relevant jobs with a single click. We handle the tedious form-filling for you.',
        animation: require('@/assets/animations/auto-apply.json'),
        gradientStart: { x: 0, y: 0 },
    },
    {
        id: '3',
        title: 'Smart Job Matching',
        description: 'Stop searching. We find roles that perfectly match your skills, experience, and career goals.',
        animation: require('@/assets/animations/matching-2.json'),
        gradientStart: { x: 0.5, y: 1 },
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const nextIndex = viewableItems[0].index;
            if (nextIndex !== currentIndex) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentIndex(nextIndex);
            }
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = async () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push('/screens/auth/role/role-select');
        }
    };

    const scrollToBack = async () => {
        if (currentIndex > 0) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            slidesRef.current?.scrollToIndex({ index: currentIndex - 1 });
        }
    };

    const skipToLast = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        slidesRef.current?.scrollToIndex({ index: ONBOARDING_DATA.length - 1 });
    };

    const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
        <View style={{ width: wp('100%'), flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View
                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
                className="w-64 h-64 rounded-full justify-center items-center mb-10 border border-zinc-800/10"
            >
                <LottieView
                    source={item.animation}
                    style={{ width: wp('50%'), height: wp('50%') }}
                    autoPlay
                    loop
                />
            </View>

            <Text
                style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: wp('8.5%') }}
                className="mb-4 text-center px-4"
            >
                {item.title}
            </Text>

            <Text
                style={{
                    fontFamily: 'Outfit-Medium',
                    color: isDark ? '#a1a1aa' : '#6b7280',
                    fontSize: wp('4.6%'),
                }}
                className="text-center px-10 leading-relaxed"
            >
                {item.description}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDark ? "light" : "dark"} />

            <LinearGradient
                colors={[`${theme.brand}20`, 'transparent']}
                start={ONBOARDING_DATA[currentIndex]?.gradientStart || { x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView className="flex-1">
                <FlatList
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />

                <View className="p-6">
                    {/* Pagination Dots */}
                    <View className="flex-row justify-center mb-10">
                        {ONBOARDING_DATA.map((_, i) => {
                            const inputRange = [(i - 1) * wp('100%'), i * wp('100%'), (i + 1) * wp('100%')];
                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [10, 24, 10],
                                extrapolate: 'clamp',
                            });
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    key={i.toString()}
                                    style={[
                                        styles.dot,
                                        { width: dotWidth, opacity, backgroundColor: theme.brand },
                                    ]}
                                />
                            );
                        })}
                    </View>

                    {/* Navigation Buttons */}
                    <View className="flex-row justify-between items-center mb-4">
                        {currentIndex < ONBOARDING_DATA.length - 1 ? (
                            <>
                                <TouchableOpacity onPress={currentIndex === 0 ? skipToLast : scrollToBack} activeOpacity={0.7}>
                                    <Text
                                        style={{ fontFamily: 'Outfit-Medium' }}
                                        className="text-gray-400 text-lg ml-2"
                                    >
                                        {currentIndex === 0 ? 'Skip' : 'Back'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: isDark ? theme.brand : '#000000' }}
                                    className="py-4 px-10 rounded-2xl"
                                    onPress={scrollToNext}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Outfit-Bold',
                                            color: isDark ? '#000000' : '#FFFFFF',
                                        }}
                                        className="text-lg"
                                    >
                                        Next
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={{ backgroundColor: isDark ? theme.brand : '#000000' }}
                                className="py-5 rounded-2xl items-center w-full"
                                onPress={scrollToNext}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Outfit-Bold',
                                        color: isDark ? '#000000' : '#FFFFFF',
                                    }}
                                    className="text-xl"
                                >
                                    Get Started
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
});