import React, { useEffect, useRef } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    Dimensions,
    ScrollView,
    useColorScheme,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
    width: number | string;
    height: number | string;
    borderRadius?: number;
    style?: any;
}

// Premium Gray Shimmer Component
const Skeleton = ({ width, height, borderRadius = 8, style }: SkeletonProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const shimmerValue = useRef(new Animated.Value(0)).current;

    const backgroundColor = isDark ? '#1E2123' : '#E1E1E1';
    const highlightColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)';

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
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

export default function RecruiterProfileSkeleton() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const borderColor = isDark ? '#2F3336' : '#eff3f4';
    const bgColor = isDark ? '#000' : '#fff';

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            {/* 1. Banner */}
            <Skeleton width={wp('100%')} height={hp('22%')} borderRadius={0} />

            {/* 2. Avatar & Action Button Row */}
            <View style={styles.actionRow}>
                <View style={[styles.avatarBorder, { backgroundColor: bgColor }]}>
                    <Skeleton width={wp('24%')} height={wp('24%')} borderRadius={16} />
                </View>
                <Skeleton width={wp('28%')} height={hp('5%')} borderRadius={25} style={{ marginBottom: 4 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
                {/* 3. Identity Info */}
                <View style={{ paddingHorizontal: wp('5%'), marginTop: hp('2%') }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Skeleton width={wp('55%')} height={hp('3.5%')} />
                        <Skeleton width={wp('18%')} height={hp('2.5%')} style={{ marginLeft: 8 }} />
                    </View>

                    <Skeleton width={wp('35%')} height={hp('2%')} style={{ marginBottom: 20 }} />

                    <Skeleton width={wp('90%')} height={hp('1.8%')} style={{ marginBottom: 8 }} />
                    <Skeleton width={wp('85%')} height={hp('1.8%')} style={{ marginBottom: 8 }} />
                    <Skeleton width={wp('60%')} height={hp('1.8%')} style={{ marginBottom: 20 }} />

                    <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
                        <Skeleton width={wp('25%')} height={hp('1.8%')} />
                        <Skeleton width={wp('30%')} height={hp('1.8%')} />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 24 }}>
                        <Skeleton width={wp('22%')} height={hp('2.2%')} />
                        <Skeleton width={wp('22%')} height={hp('2.2%')} />
                    </View>
                </View>

                {/* 4. Tabs Row */}
                <View style={[styles.tabs, { borderBottomColor: borderColor }]}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
                            <Skeleton width={wp('14%')} height={hp('2%')} />
                        </View>
                    ))}
                </View>

                {/* 5. Content Body */}
                <View style={{ paddingHorizontal: wp('5%'), paddingVertical: 24 }}>
                    <Skeleton width={wp('25%')} height={hp('2.5%')} style={{ marginBottom: 16 }} />
                    <Skeleton width="95%" height={hp('1.8%')} style={{ marginBottom: 8 }} />
                    <Skeleton width="90%" height={hp('1.8%')} style={{ marginBottom: 8 }} />
                    <Skeleton width="92%" height={hp('1.8%')} style={{ marginBottom: 8 }} />
                    <Skeleton width="45%" height={hp('1.8%')} style={{ marginBottom: 32 }} />

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Skeleton width={wp('30%')} height={hp('4%')} borderRadius={20} />
                        <Skeleton width={wp('25%')} height={hp('4%')} borderRadius={20} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: wp('4%'),
        marginTop: -wp('12%'),
        zIndex: 10,
    },
    avatarBorder: {
        padding: 4,
        borderRadius: 24,
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 24,
        borderBottomWidth: 1,
    }
});