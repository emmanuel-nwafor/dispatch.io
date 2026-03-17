import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Mock Data for Job Reels
const REELS_DATA = [
    {
        id: '1',
        videoUri: 'https://assets.mixkit.co/videos/preview/mixkit-business-woman-working-on-her-laptop-in-an-office-4841-large.mp4',
        companyName: 'TechFlow Solutions',
        jobTitle: 'Senior Product Designer',
        location: 'Remote',
        salary: '$120k - $160k',
        description: 'Join our design-led team to build the future of SaaS. We offer unlimited PTO and a remote-first culture!',
        avatar: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=200&auto=format&fit=crop',
    },
    {
        id: '2',
        videoUri: 'https://assets.mixkit.co/videos/preview/mixkit-working-overtime-at-the-office-1595-large.mp4',
        companyName: 'Nexus AI',
        jobTitle: 'Machine Learning Engineer',
        location: 'New York, NY',
        salary: '$150k - $200k',
        description: 'Building LLMs for the healthcare industry. Looking for experts in PyTorch and NLP.',
        avatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=200&auto=format&fit=crop',
    }
];

export default function ReelsScreen() {
    const insets = useSafeAreaInsets();
    const [viewableItemIndex, setViewableItemIndex] = useState(0);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setViewableItemIndex(viewableItems[0].index);
        }
    }).current;

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const isActive = viewableItemIndex === index;

        return (
            <View style={[styles.container, { height: height - (Platform.OS === 'ios' ? 0 : 50) }]}>
                <Video
                    source={{ uri: item.videoUri }}
                    style={StyleSheet.absoluteFill}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={isActive}
                    isLooping
                    isMuted={false}
                />

                {/* Dark Overlay for Readability */}
                <View style={styles.overlay} />

                {/* Right Side Actions */}
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <View style={styles.avatarBorder}>
                            <Image source={{ uri: item.avatar }} style={styles.companyAvatar} />
                        </View>
                        <View style={styles.plusIcon}>
                            <Ionicons name="add" size={12} color="white" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <Ionicons name="heart" size={32} color="white" />
                        <Text style={styles.actionText}>1.2k</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <MaterialCommunityIcons name="comment-text" size={30} color="white" />
                        <Text style={styles.actionText}>45</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <Ionicons name="share-social" size={30} color="white" />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Content */}
                <View style={[styles.bottomContent, { paddingBottom: insets.bottom + hp('10%') }]}>
                    <View style={styles.jobBadge}>
                        <Text style={styles.jobBadgeText}>{item.location}</Text>
                    </View>

                    <Text style={styles.companyTitle}>{item.companyName} • <Text style={styles.salaryText}>{item.salary}</Text></Text>
                    <Text style={styles.jobTitleText}>{item.jobTitle}</Text>
                    <Text style={styles.descriptionText} numberOfLines={2}>
                        {item.description}
                    </Text>

                    {/* Apply Button - THE JOB PLATFORM KEY */}
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                    >
                        <Text style={styles.applyButtonText}>Apply Now</Text>
                        <Feather name="arrow-right" size={18} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <FlatList
                data={REELS_DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                snapToInterval={height - (Platform.OS === 'ios' ? 0 : 50)}
                snapToAlignment="start"
                decelerationRate="fast"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)', // Subtle darkening
    },
    rightActions: {
        position: 'absolute',
        right: wp('4%'),
        bottom: hp('22%'),
        alignItems: 'center',
        gap: 20,
    },
    actionButton: {
        marginBottom: 10,
    },
    avatarBorder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
        overflow: 'hidden',
    },
    companyAvatar: {
        width: '100%',
        height: '100%',
    },
    plusIcon: {
        position: 'absolute',
        bottom: -5,
        alignSelf: 'center',
        backgroundColor: '#006400', // Your preferred dark green
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionItem: {
        alignItems: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: wp('3%'),
        fontFamily: 'Outfit-Medium',
        marginTop: 4,
    },
    bottomContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: wp('5%'),
    },
    jobBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 10,
    },
    jobBadgeText: {
        color: 'white',
        fontSize: wp('3%'),
        fontFamily: 'Outfit-Bold',
    },
    companyTitle: {
        color: 'white',
        fontSize: wp('4%'),
        fontFamily: 'Outfit-Medium',
        opacity: 0.9,
    },
    salaryText: {
        color: '#4ade80', // Soft green for money
        fontFamily: 'Outfit-Bold',
    },
    jobTitleText: {
        color: 'white',
        fontSize: wp('6%'),
        fontFamily: 'Outfit-Bold',
        marginVertical: 4,
    },
    descriptionText: {
        color: 'white',
        fontSize: wp('3.8%'),
        fontFamily: 'Outfit-Regular',
        opacity: 0.8,
        marginBottom: 20,
    },
    applyButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 15,
        gap: 10,
    },
    applyButtonText: {
        color: 'black',
        fontSize: wp('4.5%'),
        fontFamily: 'Outfit-Bold',
    }
});