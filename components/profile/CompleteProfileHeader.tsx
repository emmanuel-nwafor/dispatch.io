import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface CompleteProfileHeaderProps {
    title: string;
    onBack?: () => void;
    showBack?: boolean;
}

const CompleteProfileHeader: React.FC<CompleteProfileHeaderProps> = ({ title, onBack, showBack = true }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    return (
        <View style={[styles.container, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
            <View style={styles.row}>
                {showBack && (
                    <TouchableOpacity
                        onPress={onBack || (() => router.back())}
                        style={[styles.backButton, { backgroundColor: isDark ? '#1e1e21' : '#f8fafc' }]}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                )}
                <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                <TouchableOpacity
                    onPress={() => router.push('/screens/(home)')}
                    style={styles.skipButton}
                >
                    <Text style={{ fontFamily: 'Outfit-Bold', color: '#71717a' }}>Later</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp('5%'),
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: wp('5%'),
        fontFamily: 'Outfit-Bold',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    skipButton: {
        paddingHorizontal: 10,
    }
});

export default CompleteProfileHeader;
