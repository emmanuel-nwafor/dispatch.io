import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { Job } from '@/app/data/api';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface JobCardProps {
    job: Job;
    onPress?: () => void;
}

export default function JobCard({ job, onPress }: JobCardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="p-5 rounded-[32px] border mb-4"
            style={{
                backgroundColor: isDark ? '#1a1a1a' : '#fff',
                borderColor: isDark ? '#222' : '#f0f0f0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2
            }}
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-4">
                    <Text
                        className="text-[17px] mb-1"
                        style={{ fontFamily: 'Outfit-Bold', color: theme.text }}
                    >
                        {job.title}
                    </Text>
                    <Text
                        className="text-zinc-500 text-[14px] mb-3"
                        style={{ fontFamily: 'Outfit-Medium' }}
                    >
                        {job.companyName} • {job.location}
                    </Text>
                </View>
                <View
                    className="w-10 h-10 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: theme.brand + '15' }}
                >
                    <Ionicons name="briefcase" size={20} color={theme.brand} />
                </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center bg-zinc-500/5 px-4 py-2 rounded-full">
                    <Text style={{ fontFamily: 'Outfit-Bold', color: theme.brand, fontSize: 13 }}>
                        {job.salaryRange.currency}{job.salaryRange.min / 1000}k - {job.salaryRange.max / 1000}k
                    </Text>
                </View>
                <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 12 }}>
                    {job.applicantsCount || 0} applicants
                </Text>
            </View>
        </TouchableOpacity>
    );
}
