import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface RecruiterProfileHeaderProps {
    name: string;
    headline: string;
    location: string;
    avatarUrl: string;
    bannerUrl: string;
    onEditPress?: () => void;
}

const RecruiterProfileHeader = ({
    name,
    headline,
    location,
    avatarUrl,
    bannerUrl,
    onEditPress
}: RecruiterProfileHeaderProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    return (
        <View style={styles.container}>
            {/* Banner */}
            <View style={styles.bannerContainer}>
                <Image
                    source={{ uri: bannerUrl }}
                    style={styles.banner}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.editBannerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                >
                    <Ionicons name="camera" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Profile Info Section */}
            <View style={styles.infoContainer}>
                <View style={styles.avatarWrapper}>
                    <View style={[styles.avatarBorder, { backgroundColor: theme.background }]}>
                        <Image
                            source={{ uri: avatarUrl }}
                            style={styles.avatar}
                        />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
                        <TouchableOpacity onPress={onEditPress}>
                            <Ionicons name="pencil-outline" size={20} color={theme.brand} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.headline, { color: theme.text }]}>{headline}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color="#71717a" />
                        <Text style={styles.location}>{location}</Text>
                        <Text style={styles.contactInfo}> • Contact info</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    bannerContainer: {
        height: hp('18%'),
        width: '100%',
        position: 'relative',
    },
    banner: {
        width: '100%',
        height: '100%',
    },
    editBannerButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        paddingHorizontal: 16,
        marginTop: -hp('6%'),
    },
    avatarWrapper: {
        marginBottom: 12,
    },
    avatarBorder: {
        width: wp('24%'),
        height: wp('24%'),
        borderRadius: wp('12%'),
        padding: 4,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: wp('12%'),
    },
    textContainer: {
        marginTop: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontFamily: 'Outfit-Bold',
        fontSize: 24,
    },
    headline: {
        fontFamily: 'Outfit-Medium',
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        color: '#71717a',
        marginLeft: 4,
    },
    contactInfo: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
        color: '#84cc16', // theme.brand
    }
});

export default RecruiterProfileHeader;
