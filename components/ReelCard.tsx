import React from 'react';
import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { Reel } from '@/app/data/api';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ReelCardProps {
    reel: Reel;
    onPress?: () => void;
}

export default function ReelCard({ reel, onPress }: ReelCardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={{
                width: (wp('100%') - 48) / 2,
                height: hp('30%'),
                marginBottom: 8
            }}
            className="rounded-3xl overflow-hidden bg-zinc-900 shadow-sm"
        >
            <Image
                source={{ uri: reel.thumbnailUrl }}
                className="w-full h-full"
                resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/20" />

            <View className="absolute bottom-4 left-4 right-4">
                <Text
                    numberOfLines={1}
                    className="text-white text-xs mb-1"
                    style={{ fontFamily: 'Outfit-Bold' }}
                >
                    {reel.title}
                </Text>
                <View className="flex-row items-center">
                    <Ionicons name="play" size={10} color="#fff" />
                    <Text className="text-white text-[10px] ml-1 font-bold">{reel.views || 0}</Text>
                </View>
            </View>

            <View className="absolute top-3 right-3">
                <View className="bg-black/50 px-2 py-1 rounded-lg border border-white/20">
                    <Text className="text-[8px] text-white font-bold uppercase tracking-widest">
                        {reel.type.replace('_', ' ')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
