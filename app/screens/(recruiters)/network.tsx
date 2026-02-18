import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    useColorScheme,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Candidate {
    id: string;
    name: string;
    role: string;
    location: string;
    avatar: string;
    mutualConnections?: number;
}

export default function RecruitersNetwork() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [invitations, setInvitations] = useState([
        { id: '1', name: 'Sarah Chen', role: 'Fullstack Developer', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { id: '2', name: 'Marcus Miller', role: 'Senior Product Designer', avatar: 'https://i.pravatar.cc/150?u=marcus' },
    ]);

    const suggestions: Candidate[] = [
        { id: '3', name: 'Jordan Lee', role: 'DevOps Engineer at CloudScale', location: 'Greater London', avatar: 'https://i.pravatar.cc/150?u=jordan', mutualConnections: 12 },
        { id: '4', name: 'Elena Rodriguez', role: 'Frontend Lead at Fintechly', location: 'Madrid, Spain', avatar: 'https://i.pravatar.cc/150?u=elena', mutualConnections: 5 },
        { id: '5', name: 'Alex Thompson', role: 'Machine Learning Engineer', location: 'San Francisco, CA', avatar: 'https://i.pravatar.cc/150?u=alex', mutualConnections: 8 },
        { id: '6', name: 'Priya Sharma', role: 'UX Research Lead', location: 'New York, NY', avatar: 'https://i.pravatar.cc/150?u=priya', mutualConnections: 21 },
    ];

    const renderInvitation = ({ item }: { item: any }) => (
        <View style={[styles.invitationCard, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
            <Image source={{ uri: item.avatar }} style={styles.inviteAvatar} />
            <View style={styles.inviteInfo}>
                <Text style={[styles.inviteName, { color: theme.text }]}>{item.name}</Text>
                <Text style={styles.inviteRole} numberOfLines={1}>{item.role}</Text>
            </View>
            <View style={styles.inviteActions}>
                <TouchableOpacity style={styles.ignoreButton}>
                    <Ionicons name="close" size={24} color="#71717a" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.acceptButton, { borderColor: theme.brand }]}>
                    <Ionicons name="checkmark" size={24} color={theme.brand} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSuggestion = ({ item }: { item: Candidate }) => (
        <View style={[styles.suggestionCard, {
            backgroundColor: isDark ? '#111111' : '#fff',
            borderColor: isDark ? '#27272a' : '#f4f4f5'
        }]}>
            <View style={styles.suggestionHeader}>
                <Image source={{ uri: item.avatar }} style={styles.suggestedAvatar} />
                <TouchableOpacity style={styles.dismissButton}>
                    <Ionicons name="close" size={18} color="#71717a" />
                </TouchableOpacity>
            </View>
            <View style={styles.suggestionBody}>
                <Text style={[styles.suggestionName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.suggestionRole} numberOfLines={2}>{item.role}</Text>
                <Text style={styles.mutualText}>{item.mutualConnections} mutual connections</Text>
            </View>
            <TouchableOpacity style={[styles.connectButton, { borderColor: theme.brand }]}>
                <Text style={[styles.connectText, { color: theme.brand }]}>Connect</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Network Header */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.manageHeader, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}
                    >
                        <Text style={[styles.manageTitle, { color: theme.text }]}>Manage my network</Text>
                        <Ionicons name="chevron-forward" size={20} color="#71717a" />
                    </TouchableOpacity>

                    {/* Invitations Section */}
                    {invitations.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Invitations ({invitations.length})</Text>
                                <TouchableOpacity>
                                    <Text style={[styles.seeAll, { color: theme.brand }]}>See all</Text>
                                </TouchableOpacity>
                            </View>
                            {invitations.map((item) => (
                                <View key={item.id}>
                                    {renderInvitation({ item })}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Suggestions Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>People you may know</Text>
                        </View>
                        <View style={styles.suggestionsGrid}>
                            {suggestions.map((item) => (
                                <View key={item.id} style={{ width: '48%', marginBottom: 12 }}>
                                    {renderSuggestion({ item })}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    manageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    manageTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
    },
    section: {
        marginTop: 12,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
    },
    seeAll: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
    },
    invitationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    inviteAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    inviteInfo: {
        flex: 1,
        marginLeft: 12,
    },
    inviteName: {
        fontFamily: 'Outfit-Bold',
        fontSize: 15,
    },
    inviteRole: {
        fontFamily: 'Outfit-Regular',
        fontSize: 13,
        color: '#71717a',
        marginTop: 2,
    },
    inviteActions: {
        flexDirection: 'row',
        gap: 8,
    },
    ignoreButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(113, 113, 122, 0.1)',
    },
    acceptButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    suggestionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    suggestionCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 12,
        alignItems: 'center',
        height: 220,
    },
    suggestionHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
    },
    dismissButton: {
        position: 'absolute',
        right: -4,
        top: -4,
    },
    suggestedAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    suggestionBody: {
        alignItems: 'center',
        flex: 1,
    },
    suggestionName: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
        textAlign: 'center',
    },
    suggestionRole: {
        fontFamily: 'Outfit-Medium',
        fontSize: 12,
        color: '#71717a',
        textAlign: 'center',
        marginTop: 4,
    },
    mutualText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 11,
        color: '#a1a1aa',
        marginTop: 6,
    },
    connectButton: {
        width: '100%',
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.5,
        alignItems: 'center',
        marginTop: 12,
    },
    connectText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 13,
    }
});
