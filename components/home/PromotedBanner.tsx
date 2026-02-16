import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PromotedBannerProps {
    onPress?: () => void;
}

const PromotedBanner: React.FC<PromotedBannerProps> = ({ onPress }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [isVisible, setIsVisible] = useState(true);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleDismiss = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.poly(4)),
            useNativeDriver: true,
        }).start(() => {
            setIsVisible(false);
        });
    };

    if (!isVisible) return null;

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{
                    scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1]
                    })
                }],
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#2f3336' : '#eff3f4'
            }}
        >
            <LinearGradient
                colors={isDark ? ['#064e3b', '#022c22'] : [theme.brand, '#accf00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center p-4"
            >
                {/* Main Action Area */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onPress}
                    className="flex-1 flex-row items-center"
                >
                    <MaterialCommunityIcons name="auto-fix" size={20} color="white" />
                    <View className="ml-3 flex-1">
                        <Text className="text-white text-sm" style={{ fontFamily: 'Outfit-Bold' }}>
                            AI Co-Pilot is active.
                        </Text>
                        <Text className="text-white text-xs opacity-80" style={{ fontFamily: 'Outfit-Medium' }}>
                            Optimize your CV now.
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Vertical Divider */}
                <View
                    style={{
                        width: 1,
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        marginHorizontal: 10
                    }}
                />

                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={handleDismiss}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close-circle" size={22} color="white" style={{ opacity: 0.6 }} />
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
};

export default PromotedBanner;