import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

// Define the shape for TypeScript safety
interface Company {
    id: number;
    name: string;
    logo: string;
    jobs: number;
}

const COMPANIES: Company[] = [
    { id: 1, name: 'Airbnb', logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111320.png', jobs: 12 },
    { id: 2, name: 'Stripe', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968382.png', jobs: 8 },
    { id: 3, name: 'Google', logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', jobs: 24 },
    { id: 4, name: 'Tesla', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969031.png', jobs: 5 },
    { id: 5, name: 'Meta', logo: 'https://cdn-icons-png.flaticon.com/512/6033/6033716.png', jobs: 15 },
];

const FeaturedCompanies = () => {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <View style={styles.container}>
            <View className="flex-row justify-between items-center px-4 mb-3">
                <Text style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 16 }}>Featured Companies</Text>
                <TouchableOpacity>
                    <Text style={{ fontFamily: 'Outfit-Medium', color: theme.brand, fontSize: 13 }}>View all</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {COMPANIES.map((company) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: "/screens/featured-companies/[id]" as any,
                            params: { id: company.id }
                        })}
                        key={company.id}
                        className="mr-4 items-center p-3 rounded-2xl border shadow-none"
                        style={{
                            borderColor: isDark ? '#2f3336' : '#eff3f4',
                            backgroundColor: isDark ? '#111' : '#fcfcfc',
                            width: 100
                        }}
                    >
                        <View
                            className="w-12 h-12 rounded-full bg-white items-center justify-center mb-2 border"
                            style={{ borderColor: isDark ? '#2f3336' : '#e8e8e8ff' }}
                        >
                            <Image
                                source={{ uri: company.logo }}
                                className="w-8 h-8"
                                resizeMode="contain"
                            />
                        </View>
                        <Text
                            numberOfLines={1}
                            style={{ fontFamily: 'Outfit-Bold', color: theme.text, fontSize: 12 }}
                        >
                            {company.name}
                        </Text>
                        <Text style={{ fontFamily: 'Outfit-Medium', color: '#71717a', fontSize: 10 }}>
                            {company.jobs} Jobs
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    }
});

export default FeaturedCompanies;