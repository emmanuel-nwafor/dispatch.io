import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const CompleteProfileHeader = ({ title, onBack, showBack }: { title: string, onBack: () => void, showBack: boolean }) => {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';

    return (
        <View className="flex-row items-center justify-between py-4" style={{ paddingHorizontal: wp('5%') }}>
            <View className="flex-row items-center">
                {showBack ? (
                    <TouchableOpacity onPress={onBack} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <Ionicons name="arrow-back" size={22} color={isDark ? 'white' : 'black'} />
                    </TouchableOpacity>
                ) : (
                    <View className="w-10" />
                )}
            </View>

            <Text style={{ fontSize: wp('4.5%'), fontFamily: 'Outfit-Bold' }} className="text-zinc-900 dark:text-white">
                {title}
            </Text>

            <TouchableOpacity onPress={() => router.push('/screens/(home)')}>
                <Text className="text-zinc-500 font-[Outfit-Bold]">Skip</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CompleteProfileHeader;