import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, ScrollView, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
    width: number | string;
    height: number | string;
    borderRadius?: number;
    style?: any;
}

export const Skeleton = ({ width, height, borderRadius = 8, style }: SkeletonProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const shimmerValue = useRef(new Animated.Value(0)).current;

    // Premium Dark Mode Colors: Deep charcoal/navy base
    const backgroundColor = isDark ? '#1E2123' : '#E1E1E1';
    const highlightColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)';

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.timing(shimmerValue, {
                    toValue: 1,
                    duration: 2000, // Slower duration for a more "expensive" feel
                    useNativeDriver: true,
                })
            ).start();
        };
        startAnimation();
    }, []);

    const animatedTranslateX = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });

    return (
        <View style={[{
            width,
            height,
            borderRadius,
            backgroundColor,
            overflow: 'hidden'
        }, style]}>
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: animatedTranslateX }] }]}>
                <LinearGradient
                    colors={['transparent', highlightColor, 'transparent']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </View>
    );
};

export const HomeSkeleton = () => {
    const isDark = useColorScheme() === 'dark';
    const borderColor = isDark ? '#2F3336' : '#F0F0F0';

    return (
        <View style={styles.container}>
            {/* Header placeholder - matches HomeHeader structure */}
            <View style={styles.header}>
                <Skeleton width={42} height={42} borderRadius={21} />
                <Skeleton width="65%" height={40} borderRadius={25} />
                <Skeleton width={42} height={42} borderRadius={21} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
                {/* Banner placeholder */}
                <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
                    <Skeleton width="100%" height={120} borderRadius={16} />
                </View>

                {/* Companies Section */}
                <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
                    <Skeleton width={130} height={18} borderRadius={4} style={{ marginBottom: 15 }} />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} width={75} height={75} borderRadius={16} />
                        ))}
                    </View>
                </View>

                {/* Tabs placeholder */}
                <View style={[styles.tabs, { borderBottomColor: borderColor }]}>
                    <Skeleton width="30%" height={20} borderRadius={4} />
                    <Skeleton width="30%" height={20} borderRadius={4} />
                </View>

                {/* Feed Items placeholders */}
                {[1, 2].map((i) => (
                    <View key={i} style={[styles.feedItem, { borderBottomColor: borderColor }]}>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                            <Skeleton width={48} height={48} borderRadius={24} />
                            <View style={{ justifyContent: 'center', gap: 6 }}>
                                <Skeleton width={140} height={16} borderRadius={4} />
                                <Skeleton width={90} height={12} borderRadius={4} />
                            </View>
                        </View>
                        <Skeleton width="95%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                        <Skeleton width="85%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />
                        <Skeleton width="100%" height={220} borderRadius={16} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        marginTop: 10,
        borderBottomWidth: 1,
    },
    feedItem: {
        padding: 16,
        borderBottomWidth: 1,
    }
});