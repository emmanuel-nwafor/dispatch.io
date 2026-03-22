import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
        outputRange: [-wp('100%'), wp('100%')],
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
    const borderColor = isDark ? '#2f3336' : '#eff3f4';

    return (
        <View style={styles.container}>
            {/* Header placeholder */}
            <View style={styles.header}>
                <Skeleton width={wp('11%')} height={wp('11%')} borderRadius={wp('5.5%')} />
                <Skeleton width={wp('60%')} height={hp('5%')} borderRadius={25} />
                <Skeleton width={wp('11%')} height={wp('11%')} borderRadius={wp('5.5%')} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
                {/* Banner placeholder */}
                <View style={{ paddingHorizontal: wp('4%'), marginTop: 10 }}>
                    <Skeleton width="100%" height={hp('15%')} borderRadius={16} />
                </View>

                {/* Companies Section */}
                <View style={{ paddingHorizontal: wp('4%'), marginTop: 24 }}>
                    <Skeleton width={wp('35%')} height={18} borderRadius={4} style={{ marginBottom: 15 }} />
                    <View style={{ flexDirection: 'row', gap: wp('3%') }}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} width={wp('20%')} height={wp('20%')} borderRadius={16} />
                        ))}
                    </View>
                </View>

                {/* Tabs placeholder */}
                <View style={[styles.tabs, { borderBottomColor: borderColor }]}>
                    <Skeleton width="30%" height={20} borderRadius={4} />
                    <Skeleton width="30%" height={20} borderRadius={4} />
                </View>

                {/* Feed Items placeholders - Adjusted to match FeedItem UI */}
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.feedItem, { borderBottomColor: borderColor }]}>
                        <View style={styles.feedRow}>
                            {/* Left Column: Avatar */}
                            <View style={styles.avatarCol}>
                                <Skeleton width={wp('12%')} height={wp('12%')} borderRadius={wp('6%')} />
                            </View>

                            {/* Right Column: Content */}
                            <View style={styles.contentCol}>
                                <View style={styles.userInfoRow}>
                                    <Skeleton width={wp('30%')} height={15} borderRadius={4} />
                                    <Skeleton width={wp('20%')} height={15} borderRadius={4} style={{ marginLeft: 8 }} />
                                </View>

                                <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                                <Skeleton width="85%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />

                                {/* Attachment Placeholder */}
                                <Skeleton width="100%" height={hp('25%')} borderRadius={16} style={{ marginBottom: 16 }} />

                                {/* Interaction Bar Placeholder */}
                                <View style={styles.interactionBar}>
                                    <Skeleton width={wp('10%')} height={12} borderRadius={4} />
                                    <Skeleton width={wp('10%')} height={12} borderRadius={4} />
                                    <Skeleton width={wp('10%')} height={12} borderRadius={4} />
                                    <Skeleton width={wp('5%')} height={12} borderRadius={4} />
                                </View>
                            </View>
                        </View>
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
        paddingHorizontal: wp('4%'),
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
        width: '100%',
        borderBottomWidth: 1,
    },
    feedRow: {
        flexDirection: 'row',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('2%'),
    },
    avatarCol: {
        marginRight: wp('3%'),
    },
    contentCol: {
        flex: 1,
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    interactionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: wp('8%'),
        marginTop: 4,
    }
});