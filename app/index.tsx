import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '@/app/utils/storage';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const bgTransition = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('@/assets/Outfit/static/Outfit-Regular.ttf'),
    'Outfit-Medium': require('@/assets/Outfit/static/Outfit-Medium.ttf'),
    'Outfit-Bold': require('@/assets/Outfit/static/Outfit-Bold.ttf'),
    'Outfit-Light': require('@/assets/Outfit/static/Outfit-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.sequence([
        // Initial logo fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        // Logo slide and background color swap
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.2, 0, 0, 1),
            useNativeDriver: true,
          }),
          Animated.timing(bgTransition, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          })
        ]),
        Animated.delay(1200),
      ]).start(async () => {
        const token = await storage.getToken();
        const user = await storage.getUser();

        if (token && user) {
          // Graceful role handling
          if (user.role === 'recruiter') {
            router.replace('/screens/(recruiters)');
          } else {
            router.replace('/screens/(home)');
          }
        } else {
          router.replace('/screens/auth/login');
        }
      });
    }
  }, [fontsLoaded]);

  // Interpolations
  const backgroundColor = bgTransition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  const logoTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [wp('18%'), 0],
  });

  const textOpacity = slideAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
  });

  const brandTextColor = bgTransition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#000000'],
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor }}>
      <StatusBar hidden />

      <SafeAreaView className="flex-1 justify-center items-center">
        <View style={{ width: wp('100%') }} className="flex-row items-center justify-center">

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: logoTranslateX }]
            }}
          >
            <Animated.Image
              source={require('@/assets/images/logo.png')}
              style={{ width: wp('15%'), height: wp('15%') }}
              className="mr-1"
              resizeMode="contain"
            />
          </Animated.View>

          {fontsLoaded && (
            <Animated.View style={{ opacity: textOpacity }}>
              <Animated.Text
                style={{
                  fontFamily: 'Outfit-Bold',
                  fontSize: wp('10%'),
                  color: brandTextColor,
                  letterSpacing: -2
                }}
              >
                dispatch.io
              </Animated.Text>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}