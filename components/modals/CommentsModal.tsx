import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, Modal, Pressable,
    TextInput, FlatList, ActivityIndicator, Image, Platform,
    TouchableOpacity, KeyboardAvoidingView, Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Comment {
    user: string;
    text: string;
    avatar?: string;
    timeAgo?: string;
}

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    comments?: Comment[];
    onSend?: (text: string) => Promise<void>;
}

export default function CommentsModal({ visible, onClose, comments = [], onSend }: CommentsModalProps) {
    const [newComment, setNewComment] = useState('');
    const [sending, setSending] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleSend = async () => {
        if (!newComment.trim() || sending || !onSend) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            setSending(true);
            await onSend(newComment.trim());
            setNewComment('');
        } catch (error) {
            console.error('Send comment error', error);
        } finally {
            setSending(false);
        }
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentRow}>
            <Image
                source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user || 'U')}&background=1a1a1a&color=fff&size=128` }}
                style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
                <View style={styles.commentBubble}>
                    <Text style={styles.commentUser}>{item.user || 'User'}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                </View>
                <View style={styles.commentMeta}>
                    <Text style={styles.commentTime}>{item.timeAgo || 'just now'}</Text>
                    <TouchableOpacity style={styles.replyBtn}>
                        <Text style={styles.replyText}>Reply</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.commentLike}>
                <Ionicons name="heart-outline" size={14} color="#999" />
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.root}>
                <AnimatePresence>
                    {visible && (
                        <>
                            {/* Backdrop */}
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={[StyleSheet.absoluteFillObject, styles.backdrop]}
                            >
                                <Pressable style={{ flex: 1 }} onPress={onClose} />
                            </MotiView>

                            {/* Sheet */}
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.kavContainer}
                            >
                                <MotiView
                                    from={{ translateY: hp('80%') }}
                                    animate={{ translateY: 0 }}
                                    exit={{ translateY: hp('80%') }}
                                    transition={{ type: 'timing', duration: 350, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }}
                                    style={styles.sheet}
                                >
                                    {/* Handle bar */}
                                    <View style={styles.handleWrapper}>
                                        <View style={styles.handle} />
                                    </View>

                                    {/* Header */}
                                    <View style={styles.header}>
                                        <Text style={styles.headerTitle}>
                                            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                                        </Text>
                                        <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                            <Ionicons name="close" size={22} color="#aaa" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.divider} />

                                    {/* Comments list */}
                                    <FlatList
                                        data={comments}
                                        keyExtractor={(_, i) => i.toString()}
                                        renderItem={renderComment}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                        ListEmptyComponent={
                                            <View style={styles.emptyWrapper}>
                                                <Ionicons name="chatbubbles-outline" size={48} color="#333" />
                                                <Text style={styles.emptyTitle}>No comments yet</Text>
                                                <Text style={styles.emptySubtitle}>Be the first to share your thoughts!</Text>
                                            </View>
                                        }
                                    />

                                    {/* Input bar */}
                                    <View style={[styles.inputBar, { paddingBottom: Platform.OS === 'ios' ? hp('2%') : hp('1%') }]}>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                ref={inputRef}
                                                style={styles.input}
                                                placeholder="Add a comment..."
                                                placeholderTextColor="#555"
                                                value={newComment}
                                                onChangeText={setNewComment}
                                                multiline
                                                maxLength={500}
                                                returnKeyType="send"
                                                onSubmitEditing={handleSend}
                                            />
                                            <TouchableOpacity
                                                onPress={handleSend}
                                                disabled={sending || !newComment.trim()}
                                                style={styles.sendBtn}
                                                activeOpacity={0.7}
                                            >
                                                {sending ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <LinearGradient
                                                        colors={newComment.trim() ? ['#006400', '#004400'] : ['#2a2a2a', '#1a1a1a']}
                                                        style={styles.sendGradient}
                                                    >
                                                        <Ionicons name="arrow-up" size={18} color="white" />
                                                    </LinearGradient>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </MotiView>
                            </KeyboardAvoidingView>
                        </>
                    )}
                </AnimatePresence>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.65)',
    },
    kavContainer: {
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#161616',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: hp('78%'),
        minHeight: hp('50%'),
        // subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 20,
    },
    handleWrapper: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 4,
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: '#444',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('5%'),
        paddingBottom: 14,
    },
    headerTitle: {
        color: '#fff',
        fontSize: wp('4%'),
        fontFamily: 'Outfit-Bold',
        flex: 1,
        textAlign: 'center',
    },
    closeBtn: {
        position: 'absolute',
        right: wp('4%'),
        backgroundColor: '#2a2a2a',
        borderRadius: 14,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 0.5,
        backgroundColor: '#2a2a2a',
        marginHorizontal: wp('4%'),
    },
    listContent: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('1.5%'),
        paddingBottom: hp('1%'),
        flexGrow: 1,
    },
    commentRow: {
        flexDirection: 'row',
        marginBottom: hp('2%'),
        alignItems: 'flex-start',
    },
    commentAvatar: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('4.5%'),
        marginRight: wp('3%'),
        backgroundColor: '#2a2a2a',
    },
    commentContent: {
        flex: 1,
    },
    commentBubble: {
        backgroundColor: '#1f1f1f',
        borderRadius: 14,
        borderTopLeftRadius: 4,
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1%'),
    },
    commentUser: {
        color: '#bbb',
        fontSize: wp('3%'),
        fontFamily: 'Outfit-SemiBold',
        marginBottom: 2,
    },
    commentText: {
        color: '#f0f0f0',
        fontSize: wp('3.5%'),
        fontFamily: 'Outfit-Regular',
        lineHeight: 20,
    },
    commentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginLeft: wp('2%'),
        gap: 12,
    },
    commentTime: {
        color: '#555',
        fontSize: wp('3%'),
        fontFamily: 'Outfit-Regular',
    },
    replyBtn: {},
    replyText: {
        color: '#888',
        fontSize: wp('3%'),
        fontFamily: 'Outfit-SemiBold',
    },
    commentLike: {
        padding: 6,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    emptyWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('8%'),
        gap: 8,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: wp('4.5%'),
        fontFamily: 'Outfit-Bold',
        marginTop: 8,
    },
    emptySubtitle: {
        color: '#555',
        fontSize: wp('3.5%'),
        fontFamily: 'Outfit-Regular',
        textAlign: 'center',
    },
    inputBar: {
        borderTopWidth: 0.5,
        borderTopColor: '#2a2a2a',
        paddingHorizontal: wp('4%'),
        paddingTop: 10,
        backgroundColor: '#161616',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#222',
        borderRadius: 22,
        paddingHorizontal: wp('3%'),
        paddingVertical: 6,
        borderWidth: 0.5,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        color: '#f0f0f0',
        fontFamily: 'Outfit-Regular',
        fontSize: wp('3.5%'),
        maxHeight: 100,
        paddingTop: 4,
        paddingBottom: 4,
    },
    sendBtn: {
        marginLeft: 6,
        alignSelf: 'flex-end',
    },
    sendGradient: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
});