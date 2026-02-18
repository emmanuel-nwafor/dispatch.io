import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
    id: string;
    sender: string;
    avatar: string;
    lastMessage: string;
    time: string;
    jobTitle?: string;
    isUnread: boolean;
    category: 'focused' | 'other';
}

export default function RecruitersMessages() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [activeTab, setActiveTab] = useState<'focused' | 'other'>('focused');

    const messages: Message[] = [
        {
            id: '1',
            sender: 'Daniel Wright',
            avatar: 'https://i.pravatar.cc/150?u=daniel',
            lastMessage: 'Thanks for reaching out! I would love to discuss the UI Engineer role further.',
            time: '10:45 AM',
            jobTitle: 'UI Engineer',
            isUnread: true,
            category: 'focused'
        },
        {
            id: '2',
            sender: 'Sophia Martinez',
            avatar: 'https://i.pravatar.cc/150?u=sophia',
            lastMessage: 'The portfolio link is updated. Let me know if you need anything else.',
            time: 'Yesterday',
            jobTitle: 'Senior Product Designer',
            isUnread: false,
            category: 'focused'
        },
        {
            id: '3',
            sender: 'James Wilson',
            avatar: 'https://i.pravatar.cc/150?u=james',
            lastMessage: 'I am currently considering other offers, but thank you for the invite.',
            time: '2d ago',
            isUnread: false,
            category: 'other'
        },
        {
            id: '4',
            sender: 'Emily Rose',
            avatar: 'https://i.pravatar.cc/150?u=emily',
            lastMessage: 'Hi Emmanuel, following up on our chat from last week.',
            time: '3d ago',
            jobTitle: 'Frontend Lead',
            isUnread: true,
            category: 'focused'
        }
    ];

    const filteredMessages = messages.filter(m => m.category === activeTab);

    const renderMessage = ({ item }: { item: Message }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.messageCard, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.isUnread && (
                    <View style={[styles.unreadDot, { borderColor: theme.background }]} />
                )}
            </View>
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <Text style={[styles.senderName, { color: theme.text }, item.isUnread && styles.unreadText]}>
                        {item.sender}
                    </Text>
                    <Text style={[styles.timeText, item.isUnread && { color: theme.brand, fontWeight: '700' }]}>
                        {item.time}
                    </Text>
                </View>
                {item.jobTitle && (
                    <Text style={[styles.jobTitle, { color: theme.brand }]}>{item.jobTitle}</Text>
                )}
                <Text
                    style={[styles.lastMessage, { color: isDark ? '#a1a1aa' : '#71717a' }, item.isUnread && { color: theme.text }]}
                    numberOfLines={2}
                >
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={[styles.searchInputWrapper, { backgroundColor: isDark ? '#111111' : '#f4f4f5' }]}>
                        <Ionicons name="search" size={20} color="#71717a" />
                        <TextInput
                            placeholder="Search messages"
                            placeholderTextColor="#71717a"
                            style={[styles.searchInput, { color: theme.text }]}
                        />
                        <Ionicons name="options-outline" size={20} color="#71717a" />
                    </View>
                </View>

                {/* Tabs */}
                <View style={[styles.tabContainer, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('focused')}
                        style={[styles.tab, activeTab === 'focused' && { borderBottomColor: theme.brand }]}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'focused' ? theme.text : '#71717a' }, activeTab === 'focused' && styles.activeTabText]}>
                            Focused
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('other')}
                        style={[styles.tab, activeTab === 'other' && { borderBottomColor: theme.brand }]}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'other' ? theme.text : '#71717a' }, activeTab === 'other' && styles.activeTabText]}>
                            Other
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Message List */}
                <FlatList
                    data={filteredMessages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubbles-outline" size={64} color="#71717a" />
                            <Text style={styles.emptyText}>No messages yet</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 48,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontFamily: 'Outfit-Medium',
        fontSize: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    tab: {
        paddingVertical: 14,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontFamily: 'Outfit-Medium',
        fontSize: 15,
    },
    activeTabText: {
        fontFamily: 'Outfit-Bold',
    },
    listContent: {
        paddingBottom: 120,
    },
    messageCard: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    unreadDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#ef4444',
        borderWidth: 2,
    },
    messageContent: {
        flex: 1,
        marginLeft: 16,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    senderName: {
        fontFamily: 'Outfit-Medium',
        fontSize: 16,
    },
    unreadText: {
        fontFamily: 'Outfit-Bold',
    },
    timeText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        color: '#71717a',
    },
    jobTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    lastMessage: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontFamily: 'Outfit-Medium',
        fontSize: 16,
        color: '#71717a',
        marginTop: 16,
    }
});
