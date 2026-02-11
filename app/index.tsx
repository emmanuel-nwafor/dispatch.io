import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const bgTransition = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Outfit': require('@/assets/Outfit/static/Outfit-Regular.ttf'),
    'Outfit-Medium': require('@/assets/Outfit/static/Outfit-Medium.ttf'),
    'Outfit-Bold': require('@/assets/Outfit/static/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
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
        Animated.delay(1500),
      ]).start(() => {
        router.replace('/screens/onboard/onboarding');
      });
    }
  }, [fontsLoaded]);

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

  return (
    <Animated.View style={[styles.masterContainer, { backgroundColor }]}>
      <StatusBar hidden />

      <SafeAreaView style={styles.container}>
        <View style={styles.logoLockup}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: logoTranslateX }]
            }}
          >
            <Animated.Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
          </Animated.View>

          {fontsLoaded && (
            <Animated.View style={{ opacity: textOpacity }}>
              <Text style={styles.brandText}>dispatch.io</Text>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('100%'),
  },
  logo: {
    width: wp('15%'),
    height: wp('15%'),
    marginRight: wp('1%'),
  },
  brandText: {
    fontSize: wp('10%'),
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    letterSpacing: -2,
  },
});